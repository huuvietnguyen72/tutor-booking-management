package org.tutorbooking.service.Impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tutorbooking.domain.entity.Booking;
import org.tutorbooking.domain.entity.Parent;
import org.tutorbooking.domain.entity.Subject;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.entity.TutorSubject;
import org.tutorbooking.domain.entity.User;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.dto.request.BookingCreateRequest;
import org.tutorbooking.repository.BookingRepository;
import org.tutorbooking.repository.ParentRepository;
import org.tutorbooking.repository.PaymentRepository;
import org.tutorbooking.repository.SessionRepository;
import org.tutorbooking.repository.StudentRepository;
import org.tutorbooking.repository.SubjectRepository;
import org.tutorbooking.repository.TutorRepository;
import org.tutorbooking.repository.TutorSubjectRepository;
import org.tutorbooking.service.EmailService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

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
}
