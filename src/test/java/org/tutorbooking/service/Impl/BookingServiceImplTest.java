package org.tutorbooking.service.Impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.tutorbooking.domain.entity.Booking;
import org.tutorbooking.domain.entity.BookingSchedule;
import org.tutorbooking.domain.entity.Parent;
import org.tutorbooking.domain.entity.Session;
import org.tutorbooking.domain.entity.Subject;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.entity.TutorSubject;
import org.tutorbooking.domain.entity.User;
import org.tutorbooking.domain.enums.BookingStatus;
import org.tutorbooking.domain.enums.SessionStatus;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.dto.request.BookingCreateRequest;
import org.tutorbooking.dto.response.BookingResponse;
import org.tutorbooking.repository.BookingRepository;
import org.tutorbooking.repository.ParentRepository;
import org.tutorbooking.repository.PaymentRepository;
import org.tutorbooking.repository.ReviewRepository;
import org.tutorbooking.repository.SessionRepository;
import org.tutorbooking.repository.StudentRepository;
import org.tutorbooking.repository.SubjectRepository;
import org.tutorbooking.repository.TutorRepository;
import org.tutorbooking.repository.TutorSubjectRepository;
import org.tutorbooking.repository.projection.BookingSessionSummary;
import org.tutorbooking.service.EmailService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private TutorRepository tutorRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TutorSubjectRepository tutorSubjectRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private BookingServiceImpl service;

    @Test
    void createBookingRejectsSundayDateWithMondayScheduleBeforeSaveOrEmail() {
        stubBookingDependencies();
        BookingCreateRequest request = oneTimeRequest(LocalDate.of(2026, 9, 6), 1);

        assertThrows(IllegalArgumentException.class, () -> service.createBooking(10L, request));

        verify(bookingRepository, never()).save(any(Booking.class));
        verify(emailService, never()).sendBookingStatusChangedEmail(
                any(), any(), any(), any());
    }

    @Test
    void createBookingAllowsMondayDateWithMondaySchedule() {
        stubBookingDependencies();
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        BookingCreateRequest request = oneTimeRequest(LocalDate.of(2026, 9, 7), 1);

        assertDoesNotThrow(() -> service.createBooking(10L, request));

        verify(bookingRepository).save(any(Booking.class));
        verify(emailService).sendBookingStatusChangedEmail(
                eq("tutor@example.test"), eq("Tutor Test"), eq("Mathematics"), eq("WAITING_TUTOR_CONFIRM"));
    }

    @Test
    void acceptBookingCreatesFiveMondaySessionsInRecurringRange() {
        Booking booking = recurringMondayBooking();
        when(bookingRepository.findById(99L)).thenReturn(Optional.of(booking));
        ArgumentCaptor<List<Session>> sessionsCaptor = ArgumentCaptor.forClass(List.class);

        service.acceptBookingByTutor(20L, 99L);

        verify(sessionRepository).saveAll(sessionsCaptor.capture());
        List<LocalDate> sessionDates = sessionsCaptor.getValue().stream()
                .map(Session::getSessionDate)
                .toList();

        assertThat(sessionDates).containsExactly(
                LocalDate.of(2026, 9, 7),
                LocalDate.of(2026, 9, 14),
                LocalDate.of(2026, 9, 21),
                LocalDate.of(2026, 9, 28),
                LocalDate.of(2026, 10, 5));
    }

    @Test
    void getBookingsMapsBatchedSessionAndReviewSummariesWithoutSessions() {
        Booking firstBooking = booking(2L, "Mathematics", BookingStatus.COMPLETED);
        Booking secondBooking = booking(4L, "Physics", BookingStatus.COMPLETED);
        when(bookingRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(firstBooking, secondBooking)));
        when(sessionRepository.summarizeByBookingIds(List.of(2L, 4L))).thenReturn(List.of(
                sessionSummary(2L, 4L, 1L),
                sessionSummary(4L, 2L, 2L)));
        when(reviewRepository.findReviewedBookingIds(List.of(2L, 4L))).thenReturn(List.of(4L));

        Map<Long, BookingResponse> byId = service.getBookings(1L, "ADMIN", 0, 10).getContent().stream()
                .collect(Collectors.toMap(BookingResponse::getId, Function.identity()));

        assertThat(byId.get(2L)).extracting(
                        BookingResponse::getSubjectName,
                        BookingResponse::getTotalSessions,
                        BookingResponse::getCompletedSessions,
                        BookingResponse::getIsReviewed)
                .containsExactly("Mathematics", 4L, 1L, false);
        assertThat(byId.get(4L)).extracting(
                        BookingResponse::getTotalSessions,
                        BookingResponse::getCompletedSessions,
                        BookingResponse::getIsReviewed)
                .containsExactly(2L, 2L, true);
        assertThat(byId.get(2L).getSessions()).isNull();
        verify(sessionRepository).summarizeByBookingIds(List.of(2L, 4L));
        verify(reviewRepository).findReviewedBookingIds(List.of(2L, 4L));
    }

    @Test
    void getBookingsSkipsAggregateQueriesForAnEmptyPage() {
        when(bookingRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));

        BookingResponse response = service.getBookings(1L, "ADMIN", 3, 10).getContent().stream()
                .findFirst()
                .orElse(null);

        assertThat(response).isNull();
        verify(sessionRepository, never()).summarizeByBookingIds(any());
        verify(reviewRepository, never()).findReviewedBookingIds(any());
    }

    @Test
    void pauseBookingReturnsTheSameSummarySemanticsAsBookingDetails() {
        Booking booking = booking(2L, "Mathematics", BookingStatus.ACTIVE);
        when(bookingRepository.findById(2L)).thenReturn(Optional.of(booking));
        when(sessionRepository.findByBookingIdAndStatus(2L, SessionStatus.PENDING)).thenReturn(List.of());
        when(sessionRepository.summarizeByBookingIds(List.of(2L))).thenReturn(List.of(sessionSummary(2L, 4L, 1L)));
        when(reviewRepository.findReviewedBookingIds(List.of(2L))).thenReturn(List.of(2L));

        BookingResponse response = service.pauseBooking(10L, 2L);

        assertThat(response).extracting(
                        BookingResponse::getTotalSessions,
                        BookingResponse::getCompletedSessions,
                        BookingResponse::getIsReviewed)
                .containsExactly(4L, 1L, true);
        assertThat(response.getSessions()).isNull();
        verify(sessionRepository).summarizeByBookingIds(List.of(2L));
        verify(reviewRepository).findReviewedBookingIds(List.of(2L));
    }

    private void stubBookingDependencies() {
        Parent parent = Parent.builder()
                .id(1L)
                .user(User.builder().id(10L).fullName("Parent Test").build())
                .build();
        Tutor tutor = Tutor.builder()
                .id(2L)
                .user(User.builder().id(20L).email("tutor@example.test").fullName("Tutor Test").build())
                .build();
        Subject subject = Subject.builder().id(3L).name("Mathematics").build();
        TutorSubject tutorSubject = TutorSubject.builder().pricePerSession(200_000L).build();

        when(parentRepository.findByUserId(10L)).thenReturn(Optional.of(parent));
        when(tutorRepository.findById(2L)).thenReturn(Optional.of(tutor));
        when(subjectRepository.findById(3L)).thenReturn(Optional.of(subject));
        when(tutorSubjectRepository.findByTutorIdAndSubjectIdAndGradeLevel(2L, 3L, 5))
                .thenReturn(Optional.of(tutorSubject));
    }

    private BookingCreateRequest oneTimeRequest(LocalDate date, int dayOfWeek) {
        BookingCreateRequest.ScheduleItem schedule = new BookingCreateRequest.ScheduleItem();
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(LocalTime.of(8, 0));
        schedule.setEndTime(LocalTime.of(10, 0));

        BookingCreateRequest request = new BookingCreateRequest();
        request.setTutorId(2L);
        request.setSubjectId(3L);
        request.setGradeLevel((byte) 5);
        request.setTeachingMode(TeachingMode.ONLINE);
        request.setIsRecurring(false);
        request.setRecurringStartDate(date);
        request.setRecurringEndDate(date);
        request.setSchedules(List.of(schedule));
        return request;
    }

    private Booking recurringMondayBooking() {
        Parent parent = Parent.builder()
                .id(1L)
                .user(User.builder().id(10L).email("parent@example.test").fullName("Parent Test").build())
                .build();
        Tutor tutor = Tutor.builder()
                .id(2L)
                .user(User.builder().id(20L).email("tutor@example.test").fullName("Tutor Test").build())
                .build();
        Subject subject = Subject.builder().id(3L).name("Mathematics").build();
        Booking booking = Booking.builder()
                .id(99L)
                .parent(parent)
                .tutor(tutor)
                .subject(subject)
                .isRecurring(true)
                .status(BookingStatus.WAITING_TUTOR_CONFIRM)
                .recurringStartDate(LocalDate.of(2026, 9, 6))
                .recurringEndDate(LocalDate.of(2026, 10, 6))
                .schedules(new ArrayList<>())
                .build();
        BookingSchedule schedule = BookingSchedule.builder()
                .booking(booking)
                .dayOfWeek(1)
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(10, 0))
                .build();
        booking.getSchedules().add(schedule);
        return booking;
    }

    private Booking booking(Long id, String subjectName, BookingStatus status) {
        Parent parent = Parent.builder()
                .id(1L)
                .user(User.builder().id(10L).email("parent@example.test").fullName("Parent Test").build())
                .build();
        Tutor tutor = Tutor.builder()
                .id(2L)
                .user(User.builder().id(20L).email("tutor@example.test").fullName("Tutor Test").build())
                .build();
        return Booking.builder()
                .id(id)
                .parent(parent)
                .tutor(tutor)
                .subject(Subject.builder().id(3L).name(subjectName).build())
                .status(status)
                .isRecurring(false)
                .schedules(new ArrayList<>())
                .build();
    }

    private BookingSessionSummary sessionSummary(Long bookingId, Long totalSessions, Long completedSessions) {
        return new BookingSessionSummary() {
            @Override
            public Long getBookingId() {
                return bookingId;
            }

            @Override
            public Long getTotalSessions() {
                return totalSessions;
            }

            @Override
            public Long getCompletedSessions() {
                return completedSessions;
            }
        };
    }
}
