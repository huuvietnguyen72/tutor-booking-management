package org.tutorbooking.repository.projection;

public interface BookingSessionSummary {
    Long getBookingId();

    Long getTotalSessions();

    Long getCompletedSessions();
}
