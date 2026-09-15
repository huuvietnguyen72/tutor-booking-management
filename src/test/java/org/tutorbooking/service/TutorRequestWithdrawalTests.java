package org.tutorbooking.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tutorbooking.domain.entity.Parent;
import org.tutorbooking.domain.entity.Student;
import org.tutorbooking.domain.entity.Subject;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.entity.TutorApplication;
import org.tutorbooking.domain.entity.TutorRequest;
import org.tutorbooking.domain.entity.User;
import org.tutorbooking.domain.enums.TutorApplicationStatus;
import org.tutorbooking.domain.enums.TutorRequestStatus;
import org.tutorbooking.repository.ParentRepository;
import org.tutorbooking.repository.StudentRepository;
import org.tutorbooking.repository.SubjectRepository;
import org.tutorbooking.repository.TutorApplicationRepository;
import org.tutorbooking.repository.TutorRepository;
import org.tutorbooking.repository.TutorRequestRepository;
import org.tutorbooking.service.Impl.TutorRequestServiceImpl;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantLock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.inOrder;

@ExtendWith(MockitoExtension.class)
class TutorRequestWithdrawalTests {

    private static final Long APPLICATION_ID = 1L;
    private static final Long TUTOR_USER_ID = 10L;

    @Mock
    private TutorRequestRepository tutorRequestRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private TutorRepository tutorRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EmailService emailService;

    private TutorApplicationRepository tutorApplicationRepository;
    private TutorRequestServiceImpl service;
    private long remainingPendingApplications;

    @BeforeEach
    void setUp() {
        tutorApplicationRepository = mock(TutorApplicationRepository.class, invocation -> {
            if ("countByRequestIdAndStatusAndIdNot".equals(invocation.getMethod().getName())) {
                return remainingPendingApplications;
            }
            return Answers.RETURNS_DEFAULTS.answer(invocation);
        });
        service = new TutorRequestServiceImpl(
                tutorRequestRepository,
                tutorApplicationRepository,
                parentRepository,
                tutorRepository,
                subjectRepository,
                studentRepository,
                emailService);
    }

    @Test
    void withdrawsAnOwnedPendingApplication() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.PENDING, TutorRequestStatus.SEARCHING);
        stubWithdrawal(tutor, application);
        stubRequestLock(application);

        service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID);

        verify(tutorApplicationRepository).delete(application);
        verify(tutorRequestRepository).findByIdForUpdate(application.getRequest().getId());
    }

    @Test
    void rejectsWithdrawalByAnotherTutor() {
        Tutor owner = tutor(2L);
        TutorApplication application = application(owner, TutorApplicationStatus.PENDING, TutorRequestStatus.SEARCHING);
        Tutor anotherTutor = tutor(3L);
        when(tutorRepository.findByUserId(TUTOR_USER_ID)).thenReturn(Optional.of(anotherTutor));
        when(tutorApplicationRepository.findById(APPLICATION_ID)).thenReturn(Optional.of(application));

        assertThrows(RuntimeException.class, () -> service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID));

        verify(tutorApplicationRepository, never()).delete(application);
    }

    @Test
    void rejectsWithdrawalOfAnAcceptedApplication() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.ACCEPTED, TutorRequestStatus.MATCHED);
        stubWithdrawal(tutor, application);

        assertThrows(RuntimeException.class, () -> service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID));

        verify(tutorApplicationRepository, never()).delete(application);
    }

    @Test
    void rejectsWithdrawalOfARejectedApplication() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.REJECTED, TutorRequestStatus.HAS_APPLICANTS);
        stubWithdrawal(tutor, application);

        assertThrows(RuntimeException.class, () -> service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID));

        verify(tutorApplicationRepository, never()).delete(application);
    }

    @Test
    void withdrawingTheFinalPendingApplicationReturnsTheRequestToSearching() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.PENDING, TutorRequestStatus.HAS_APPLICANTS);
        stubWithdrawal(tutor, application);
        stubRequestLock(application);
        remainingPendingApplications = 0L;
        TutorRequest request = application.getRequest();

        service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID);

        assertEquals(TutorRequestStatus.SEARCHING, request.getStatus());
        verify(tutorApplicationRepository).delete(application);
        verify(tutorRequestRepository).save(request);
    }

    @Test
    void withdrawingWhileAnotherPendingApplicationExistsKeepsTheRequestOpenToApplicants() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.PENDING, TutorRequestStatus.HAS_APPLICANTS);
        stubWithdrawal(tutor, application);
        stubRequestLock(application);
        remainingPendingApplications = 1L;
        TutorRequest request = application.getRequest();

        service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID);

        assertEquals(TutorRequestStatus.HAS_APPLICANTS, request.getStatus());
        verify(tutorApplicationRepository).delete(application);
        verify(tutorRequestRepository, never()).save(request);
    }

    @Test
    void concurrentWithdrawalsSerializeSoTheLastPendingApplicationReturnsTheRequestToSearching() throws Exception {
        Long secondApplicationId = 2L;
        Long secondTutorUserId = 11L;
        TutorRequest request = TutorRequest.builder().id(2L).status(TutorRequestStatus.HAS_APPLICANTS).build();
        Tutor firstTutor = tutor(2L);
        Tutor secondTutor = tutor(3L);
        TutorApplication firstApplication = TutorApplication.builder()
                .id(APPLICATION_ID)
                .tutor(firstTutor)
                .request(request)
                .status(TutorApplicationStatus.PENDING)
                .build();
        TutorApplication secondApplication = TutorApplication.builder()
                .id(secondApplicationId)
                .tutor(secondTutor)
                .request(request)
                .status(TutorApplicationStatus.PENDING)
                .build();
        Map<Long, TutorApplication> applications = Map.of(
                APPLICATION_ID, firstApplication,
                secondApplicationId, secondApplication);
        Set<Long> pendingApplicationIds = ConcurrentHashMap.newKeySet();
        pendingApplicationIds.addAll(applications.keySet());
        CyclicBarrier simultaneousCount = new CyclicBarrier(2);
        ReentrantLock requestLock = new ReentrantLock();
        AtomicBoolean requestLockUsed = new AtomicBoolean();

        TutorApplicationRepository concurrentApplications = mock(TutorApplicationRepository.class, invocation -> {
            String methodName = invocation.getMethod().getName();
            if ("findById".equals(methodName)) {
                return Optional.of(applications.get(invocation.getArgument(0)));
            }
            if ("countByRequestIdAndStatusAndIdNot".equals(methodName)) {
                Long applicationId = invocation.getArgument(2);
                long remaining = pendingApplicationIds.stream().filter(id -> !id.equals(applicationId)).count();
                if (!requestLockUsed.get()) {
                    simultaneousCount.await(5, TimeUnit.SECONDS);
                }
                return remaining;
            }
            if ("delete".equals(methodName)) {
                TutorApplication application = invocation.getArgument(0);
                pendingApplicationIds.remove(application.getId());
                if (requestLock.isHeldByCurrentThread()) {
                    requestLock.unlock();
                }
                return null;
            }
            return Answers.RETURNS_DEFAULTS.answer(invocation);
        });
        TutorRequestRepository lockingRequests = mock(TutorRequestRepository.class, invocation -> {
            if ("findByIdForUpdate".equals(invocation.getMethod().getName())) {
                requestLock.lock();
                requestLockUsed.set(true);
                return Optional.of(request);
            }
            if ("save".equals(invocation.getMethod().getName())) {
                return invocation.getArgument(0);
            }
            return Answers.RETURNS_DEFAULTS.answer(invocation);
        });
        TutorRequestServiceImpl concurrentService = new TutorRequestServiceImpl(
                lockingRequests,
                concurrentApplications,
                parentRepository,
                tutorRepository,
                subjectRepository,
                studentRepository,
                emailService);
        when(tutorRepository.findByUserId(TUTOR_USER_ID)).thenReturn(Optional.of(firstTutor));
        when(tutorRepository.findByUserId(secondTutorUserId)).thenReturn(Optional.of(secondTutor));

        CompletableFuture.allOf(
                CompletableFuture.runAsync(() -> concurrentService.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID)),
                CompletableFuture.runAsync(() -> concurrentService.withdrawApplication(secondApplicationId, secondTutorUserId)))
                .get(5, TimeUnit.SECONDS);

        assertEquals(TutorRequestStatus.SEARCHING, request.getStatus());
    }

    @Test
    void acceptingAnApplicationLocksTheRequestBeforeWritingApplicationState() {
        Tutor tutor = tutor(2L);
        TutorApplication application = application(tutor, TutorApplicationStatus.PENDING, TutorRequestStatus.HAS_APPLICANTS);
        Parent parent = Parent.builder().id(application.getRequest().getParent().getId()).build();
        when(parentRepository.findByUserId(TUTOR_USER_ID)).thenReturn(Optional.of(parent));
        when(tutorApplicationRepository.findById(APPLICATION_ID)).thenReturn(Optional.of(application));
        when(tutorRequestRepository.findByApplicationIdForUpdate(APPLICATION_ID))
                .thenReturn(Optional.of(application.getRequest()));

        service.acceptApplication(APPLICATION_ID, TUTOR_USER_ID);

        InOrder calls = inOrder(tutorRequestRepository, tutorApplicationRepository);
        calls.verify(tutorRequestRepository).findByApplicationIdForUpdate(APPLICATION_ID);
        calls.verify(tutorApplicationRepository).findById(APPLICATION_ID);
        calls.verify(tutorApplicationRepository).save(application);
    }

    private void stubWithdrawal(Tutor tutor, TutorApplication application) {
        when(tutorRepository.findByUserId(TUTOR_USER_ID)).thenReturn(Optional.of(tutor));
        when(tutorApplicationRepository.findById(APPLICATION_ID)).thenReturn(Optional.of(application));
    }

    private void stubRequestLock(TutorApplication application) {
        when(tutorRequestRepository.findByIdForUpdate(application.getRequest().getId()))
                .thenReturn(Optional.of(application.getRequest()));
    }

    private Tutor tutor(Long id) {
        return Tutor.builder().id(id).user(User.builder().id(TUTOR_USER_ID).build()).build();
    }

    private TutorApplication application(
            Tutor tutor,
            TutorApplicationStatus applicationStatus,
            TutorRequestStatus requestStatus) {
        return TutorApplication.builder()
                .id(APPLICATION_ID)
                .tutor(tutor)
                .request(TutorRequest.builder()
                        .id(2L)
                        .parent(Parent.builder().id(4L).build())
                        .subject(Subject.builder().id(5L).name("Mathematics").build())
                        .student(Student.builder().id(6L).build())
                        .status(requestStatus)
                        .build())
                .status(applicationStatus)
                .build();
    }
}
