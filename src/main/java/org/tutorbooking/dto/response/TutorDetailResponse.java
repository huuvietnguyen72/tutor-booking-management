package org.tutorbooking.dto.response;

import lombok.Data;
import org.tutorbooking.domain.enums.EducationLevel;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.domain.enums.TutorApprovalStatus;

@Data
public class TutorDetailResponse {

    private Long id;

    // thông tin user (chỉ lấy cần thiết)
    private String fullName;
    private String avatarUrl;
    private String email;

    // thông tin tutor
    private EducationLevel educationLevel;
    private String experience;
    private String qualifications;
    private TeachingMode teachingMode;
    private String teachingArea;
    private TutorApprovalStatus approvalStatus;

    private String rejectionReason;
}
