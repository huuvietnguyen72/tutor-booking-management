package org.tutorbooking.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.tutorbooking.repository.projection.BookingSessionSummary;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.ai.openai.api-key=test-placeholder")
@ActiveProfiles("local")
class SessionRepositoryIntegrationTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Test
    void summarizeByBookingIdsReturnsSeededSessionProgress() {
        Map<Long, BookingSessionSummary> byId = sessionRepository.summarizeByBookingIds(List.of(2L, 4L))
                .stream()
                .collect(Collectors.toMap(BookingSessionSummary::getBookingId, Function.identity()));

        assertThat(byId).containsKeys(2L, 4L);
        assertThat(byId.get(2L))
                .extracting(BookingSessionSummary::getTotalSessions, BookingSessionSummary::getCompletedSessions)
                .containsExactly(4L, 1L);
        assertThat(byId.get(4L))
                .extracting(BookingSessionSummary::getTotalSessions, BookingSessionSummary::getCompletedSessions)
                .containsExactly(2L, 2L);
    }
}
