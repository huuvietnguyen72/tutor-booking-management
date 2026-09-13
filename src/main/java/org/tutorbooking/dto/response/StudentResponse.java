package org.tutorbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tutorbooking.domain.enums.AcademicLevel;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String fullName;
    private Byte grade;
    private String school;
    private AcademicLevel academicLevel;
    private String specialNotes;
    private LocalDateTime createdAt;
}
