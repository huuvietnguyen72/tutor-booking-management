package org.tutorbooking.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.tutorbooking.domain.entity.Parent;
import org.tutorbooking.domain.entity.Subject;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.entity.TutorApplication;
import org.tutorbooking.domain.entity.TutorRequest;
import org.tutorbooking.domain.entity.User;
import org.tutorbooking.domain.enums.AuthProvider;
import org.tutorbooking.domain.enums.Role;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.domain.enums.TutorApplicationStatus;
import org.tutorbooking.domain.enums.TutorRequestStatus;
import org.tutorbooking.repository.ParentRepository;
import org.tutorbooking.repository.SubjectRepository;
import org.tutorbooking.repository.TutorApplicationRepository;
import org.tutorbooking.repository.TutorRepository;
import org.tutorbooking.repository.TutorRequestRepository;
import org.tutorbooking.repository.UserRepository;

import java.math.BigDecimal;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "spring.ai.openai.api-key=test-placeholder",
        "spring.datasource.hikari.transaction-isolation=TRANSACTION_REPEATABLE_READ"
})
@ActiveProfiles("local")
@Import(TutorRequestWithdrawalConcurrencyIntegrationTest.ConcurrencyConfiguration.class)
class TutorRequestWithdrawalConcurrencyIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TutorRequestRepository tutorRequestRepository;

    @Autowired
    private TutorApplicationRepository tutorApplicationRepository;

    @Autowired
    private TutorRequestService tutorRequestService;

    @Autowired
    private ApplicationReadBarrier applicationReadBarrier;

    @Autowired
    private RequestLockBarrier requestLockBarrier;

    private Long requestId;
    private List<Long> applicationIds;
    private List<Long> tutorIds;
    private Long parentId;
    private Long subjectId;
    private List<Long> userIds;
    private List<Long> tutorUserIds;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString();
        Subject subject = subjectRepository.saveAndFlush(Subject.builder()
                .name("Withdrawal concurrency " + suffix)
                .build());
        User parentUser = userRepository.saveAndFlush(user("parent-" + suffix, Role.PARENT));
        Parent parent = parentRepository.saveAndFlush(Parent.builder().user(parentUser).build());
        User firstTutorUser = userRepository.saveAndFlush(user("tutor-one-" + suffix, Role.TUTOR));
        User secondTutorUser = userRepository.saveAndFlush(user("tutor-two-" + suffix, Role.TUTOR));
        Tutor firstTutor = tutorRepository.saveAndFlush(Tutor.builder()
                .user(firstTutorUser)
                .approvalStatus("approved")
                .build());
        Tutor secondTutor = tutorRepository.saveAndFlush(Tutor.builder()
                .user(secondTutorUser)
                .approvalStatus("approved")
                .build());
        TutorRequest request = tutorRequestRepository.saveAndFlush(TutorRequest.builder()
                .parent(parent)
                .subject(subject)
                .gradeLevel((byte) 7)
                .desiredPrice(BigDecimal.valueOf(250_000))
                .teachingMode(TeachingMode.ONLINE)
                .sessionsPerWeek((byte) 1)
                .status(TutorRequestStatus.HAS_APPLICANTS)
                .build());
        TutorApplication firstApplication = tutorApplicationRepository.saveAndFlush(application(request, firstTutor));
        TutorApplication secondApplication = tutorApplicationRepository.saveAndFlush(application(request, secondTutor));

        requestId = request.getId();
        applicationIds = List.of(firstApplication.getId(), secondApplication.getId());
        tutorIds = List.of(firstTutor.getId(), secondTutor.getId());
        parentId = parent.getId();
        subjectId = subject.getId();
        userIds = List.of(parentUser.getId(), firstTutorUser.getId(), secondTutorUser.getId());
        tutorUserIds = List.of(firstTutorUser.getId(), secondTutorUser.getId());
    }

    @AfterEach
    void tearDown() {
        if (applicationIds != null) {
            tutorApplicationRepository.deleteAllByIdInBatch(applicationIds);
        }
        if (requestId != null) {
            tutorRequestRepository.deleteById(requestId);
        }
        if (tutorIds != null) {
            tutorRepository.deleteAllByIdInBatch(tutorIds);
        }
        if (parentId != null) {
            parentRepository.deleteById(parentId);
        }
        if (subjectId != null) {
            subjectRepository.deleteById(subjectId);
        }
        if (userIds != null) {
            userRepository.deleteAllByIdInBatch(userIds);
        }
    }

    @Test
    void concurrentWithdrawalsSeeTheCommittedDeletionBeforeCountingPendingApplications() throws Exception {
        Set<Long> applications = Set.copyOf(applicationIds);
        applicationReadBarrier.awaitApplications(applications);
        try {
            CompletableFuture.allOf(
                    CompletableFuture.runAsync(() -> tutorRequestService.withdrawApplication(
                            applicationIds.get(0), tutorUserIds.get(0))),
                    CompletableFuture.runAsync(() -> tutorRequestService.withdrawApplication(
                            applicationIds.get(1), tutorUserIds.get(1))))
                    .get(10, TimeUnit.SECONDS);
        } finally {
            applicationReadBarrier.clear();
        }

        assertThat(tutorApplicationRepository.countByRequestId(requestId)).isZero();
        assertThat(tutorRequestRepository.findById(requestId)).get()
                .extracting(TutorRequest::getStatus)
                .isEqualTo(TutorRequestStatus.SEARCHING);
    }

    @Test
    void concurrentAcceptancesOfDifferentPendingApplicationsLeaveOneAcceptedAndTheRequestMatched() throws Exception {
        applicationReadBarrier.awaitApplications(Set.copyOf(applicationIds));
        requestLockBarrier.awaitRequestLocks(2);
        try {
            CompletableFuture.allOf(
                    CompletableFuture.runAsync(() -> tutorRequestService.acceptApplication(
                            applicationIds.get(0), userIds.get(0))),
                    CompletableFuture.runAsync(() -> tutorRequestService.acceptApplication(
                            applicationIds.get(1), userIds.get(0))))
                    .get(10, TimeUnit.SECONDS);
        } finally {
            applicationReadBarrier.clear();
            requestLockBarrier.clear();
        }

        assertThat(tutorApplicationRepository.findAllById(applicationIds))
                .extracting(TutorApplication::getStatus)
                .containsExactlyInAnyOrder(TutorApplicationStatus.ACCEPTED, TutorApplicationStatus.REJECTED);
        assertThat(tutorRequestRepository.findById(requestId)).get()
                .extracting(TutorRequest::getStatus)
                .isEqualTo(TutorRequestStatus.MATCHED);
    }

    private User user(String prefix, Role role) {
        return User.builder()
                .email(prefix + "@test.local")
                .password("test-password")
                .fullName(prefix)
                .role(role)
                .authProvider(AuthProvider.LOCAL)
                .build();
    }

    private TutorApplication application(TutorRequest request, Tutor tutor) {
        return TutorApplication.builder()
                .request(request)
                .tutor(tutor)
                .proposedPrice(BigDecimal.valueOf(250_000))
                .coverLetter("Concurrency test")
                .status(TutorApplicationStatus.PENDING)
                .build();
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class ConcurrencyConfiguration {

        @Bean
        ApplicationReadBarrier applicationReadBarrier() {
            return new ApplicationReadBarrier();
        }

        @Bean
        @Primary
        TutorApplicationRepository synchronizedTutorApplicationRepository(
                @Qualifier("tutorApplicationRepository") TutorApplicationRepository delegate,
                ApplicationReadBarrier applicationReadBarrier) {
            return (TutorApplicationRepository) Proxy.newProxyInstance(
                    TutorApplicationRepository.class.getClassLoader(),
                    new Class<?>[] { TutorApplicationRepository.class },
                    (proxy, method, arguments) -> {
                        try {
                            Object result = method.invoke(delegate, arguments);
                            if ("findById".equals(method.getName()) && arguments != null) {
                                applicationReadBarrier.awaitIfTracked((Long) arguments[0]);
                            }
                            return result;
                        } catch (InvocationTargetException exception) {
                            throw exception.getCause();
                        }
                    });
        }

        @Bean
        @Primary
        TutorRequestRepository synchronizedTutorRequestRepository(
                @Qualifier("tutorRequestRepository") TutorRequestRepository delegate,
                RequestLockBarrier requestLockBarrier) {
            return (TutorRequestRepository) Proxy.newProxyInstance(
                    TutorRequestRepository.class.getClassLoader(),
                    new Class<?>[] { TutorRequestRepository.class },
                    (proxy, method, arguments) -> {
                        try {
                            if ("findByIdForUpdate".equals(method.getName())
                                    || "findByApplicationIdForUpdate".equals(method.getName())) {
                                requestLockBarrier.awaitIfTracked();
                            }
                            return method.invoke(delegate, arguments);
                        } catch (InvocationTargetException exception) {
                            throw exception.getCause();
                        }
                    });
        }

        @Bean
        RequestLockBarrier requestLockBarrier(ApplicationReadBarrier applicationReadBarrier) {
            return new RequestLockBarrier(applicationReadBarrier::bypass);
        }
    }

    static class ApplicationReadBarrier {
        private volatile Set<Long> applicationIds = Set.of();
        private volatile CountDownLatch applicationsRead;
        private volatile boolean bypassed;

        void awaitApplications(Set<Long> applicationIds) {
            this.applicationIds = applicationIds;
            this.applicationsRead = new CountDownLatch(applicationIds.size());
        }

        void awaitIfTracked(Long applicationId) throws InterruptedException {
            CountDownLatch latch = applicationsRead;
            if (bypassed || latch == null || !applicationIds.contains(applicationId)) {
                return;
            }

            latch.countDown();
            assertThat(latch.await(5, TimeUnit.SECONDS)).isTrue();
        }

        void clear() {
            applicationIds = Set.of();
            applicationsRead = null;
            bypassed = false;
        }

        void bypass() {
            bypassed = true;
        }
    }

    static class RequestLockBarrier {
        private volatile CountDownLatch requestLocks;
        private final Runnable applicationReadBarrierBypass;

        RequestLockBarrier(Runnable applicationReadBarrierBypass) {
            this.applicationReadBarrierBypass = applicationReadBarrierBypass;
        }

        void awaitRequestLocks(int concurrentRequests) {
            requestLocks = new CountDownLatch(concurrentRequests);
        }

        void awaitIfTracked() throws InterruptedException {
            CountDownLatch latch = requestLocks;
            if (latch == null) {
                return;
            }

            applicationReadBarrierBypass.run();
            latch.countDown();
            assertThat(latch.await(5, TimeUnit.SECONDS)).isTrue();
        }

        void clear() {
            requestLocks = null;
        }
    }
}
