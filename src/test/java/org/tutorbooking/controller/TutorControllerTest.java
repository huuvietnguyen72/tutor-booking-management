package org.tutorbooking.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.tutorbooking.exception.GlobalExceptionHandler;
import org.tutorbooking.service.TutorService;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TutorControllerTest {

    @Mock
    private TutorService tutorService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new TutorController(tutorService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void updateProfileRejectsUnknownEnumsWithoutCallingService() throws Exception {
        mockMvc.perform(put("/api/tutors/my-profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "educationLevel": "UNIVERSITY",
                                  "experience": "2 năm",
                                  "qualifications": "Chứng chỉ",
                                  "teachingMode": "REMOTE",
                                  "teachingArea": "Hà Nội"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Giá trị enum không hợp lệ"));

        verifyNoInteractions(tutorService);
    }
}
