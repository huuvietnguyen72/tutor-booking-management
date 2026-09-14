package org.tutorbooking.dto.response;

import lombok.Builder;
import lombok.Data;
import org.tutorbooking.domain.enums.BookingStatus;
import org.tutorbooking.domain.enums.TeachingMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long parentId;
    private String parentName;
    private String parentAvatar;
    private Long tutorId;
    private String tutorName;
    private String tutorAvatar;
    private Long subjectId;
    private String subjectName;
    private Long studentId;
    private String studentName;
    private Byte gradeLevel;
    private BigDecimal pricePerSession;
    private TeachingMode teachingMode;
    private Boolean isRecurring;
    private List<ScheduleResponseItem> schedules;

    @Data
    @Builder
    public static class ScheduleResponseItem {
        private Long id;
        private Integer dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    private LocalDate recurringStartDate;
    private LocalDate recurringEndDate;
    private BookingStatus status;
    private Long totalSessions;
    private Long completedSessions;
    private Boolean isReviewed;
    private List<SessionResponse> sessions;
    private Long paymentId;
}
