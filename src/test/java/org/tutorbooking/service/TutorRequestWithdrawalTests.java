package org.tutorbooking.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

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

        service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID);

        verify(tutorApplicationRepository).delete(application);
        verifyNoInteractions(tutorRequestRepository);
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
        remainingPendingApplications = 1L;
        TutorRequest request = application.getRequest();

        service.withdrawApplication(APPLICATION_ID, TUTOR_USER_ID);

        assertEquals(TutorRequestStatus.HAS_APPLICANTS, request.getStatus());
        verify(tutorApplicationRepository).delete(application);
        verify(tutorRequestRepository, never()).save(request);
    }

    private void stubWithdrawal(Tutor tutor, TutorApplication application) {
        when(tutorRepository.findByUserId(TUTOR_USER_ID)).thenReturn(Optional.of(tutor));
        when(tutorApplicationRepository.findById(APPLICATION_ID)).thenReturn(Optional.of(application));
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
