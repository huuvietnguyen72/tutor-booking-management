package org.tutorbooking.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.tutorbooking.domain.enums.EducationLevel;
import org.tutorbooking.domain.enums.TeachingMode;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTutorRequest {

    @NotNull(message = "Education level không được để trống")
    private EducationLevel educationLevel;

    @Size(max = 2000, message = "Experience quá dài")
    private String experience;

    @Size(max = 2000, message = "Qualifications quá dài")
    private String qualifications;

    @NotNull(message = "Teaching mode không được để trống")
    private TeachingMode teachingMode;

    @Size(max = 255, message = "Teaching area quá dài")
    private String teachingArea;
}
