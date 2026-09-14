package org.tutorbooking.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;
import org.tutorbooking.security.UserPrincipal;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.ai.openai.api-key=test-placeholder")
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Transactional
class BookingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listReturnsSeededProgressWithoutSessionArrays() throws Exception {
        mockMvc.perform(get("/api/bookings")
                        .param("page", "0")
                        .param("size", "100")
                        .with(administrator()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[?(@.id == 2)].totalSessions").value(contains(4)))
                .andExpect(jsonPath("$.data.content[?(@.id == 2)].completedSessions").value(contains(1)))
                .andExpect(jsonPath("$.data.content[?(@.id == 2)].isReviewed").value(contains(false)))
                .andExpect(jsonPath("$.data.content[?(@.id == 4)].totalSessions").value(contains(2)))
                .andExpect(jsonPath("$.data.content[?(@.id == 4)].completedSessions").value(contains(2)))
                .andExpect(jsonPath("$.data.content[?(@.id == 4)].isReviewed").value(contains(true)))
                .andExpect(jsonPath("$.data.content[?(@.id == 2)].sessions").value(contains(nullValue())));
    }

    @Test
    void detailReturnsSeededSessionsAndMatchingProgress() throws Exception {
        mockMvc.perform(get("/api/bookings/2").with(administrator()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalSessions").value(4))
                .andExpect(jsonPath("$.data.completedSessions").value(1))
                .andExpect(jsonPath("$.data.isReviewed").value(false))
                .andExpect(jsonPath("$.data.sessions", hasSize(4)));
    }

    private RequestPostProcessor administrator() {
        UserPrincipal principal = UserPrincipal.builder()
                .id(1L)
                .email("admin@example.test")
                .role("ADMIN")
                .build();
        return authentication(new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()));
    }
}
