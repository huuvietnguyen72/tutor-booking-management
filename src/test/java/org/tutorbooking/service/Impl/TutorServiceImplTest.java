package org.tutorbooking.service.Impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.enums.EducationLevel;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.domain.enums.TutorApprovalStatus;
import org.tutorbooking.dto.request.UpdateTutorRequest;
import org.tutorbooking.dto.response.TutorDetailResponse;
import org.tutorbooking.repository.ReviewRepository;
import org.tutorbooking.repository.TutorRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TutorServiceImplTest {

    @Mock
    private TutorRepository tutorRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private TutorServiceImpl service;

    @Test
    void getMyProfileReturnsCanonicalEnumsAndRejectionReason() {
        Tutor tutor = rejectedTutor("bachelor", "offline", "Cần bổ sung bản scan bằng cấp rõ ràng.");
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        TutorDetailResponse result = service.getMyTutorProfile(14L);

        assertEquals(EducationLevel.BACHELOR, result.getEducationLevel());
        assertEquals(TeachingMode.OFFLINE, result.getTeachingMode());
        assertEquals(TutorApprovalStatus.REJECTED, result.getApprovalStatus());
        assertEquals("Cần bổ sung bản scan bằng cấp rõ ràng.", result.getRejectionReason());
    }

    @Test
    void rejectedTutorWithQualificationChangeReturnsToPending() {
        Tutor tutor = rejectedTutor("bachelor", "offline", "Cần bổ sung bản scan bằng cấp rõ ràng.");
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.BACHELOR, "2 năm dạy tự do.",
                "Chứng chỉ đã bổ sung", TeachingMode.OFFLINE, "Hà Nội"));

        assertEquals("pending", tutor.getApprovalStatus());
        assertNull(tutor.getRejectionReason());
    }

    @Test
    void rejectedTutorWithExperienceOnlyChangeReturnsToPending() {
        Tutor tutor = rejectedTutor("bachelor", "offline", "Cần bổ sung bản scan bằng cấp rõ ràng.");
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.BACHELOR, "3 năm dạy tự do.",
                "Chứng chỉ chưa hợp lệ", TeachingMode.OFFLINE, "Hà Nội"));

        assertEquals("pending", tutor.getApprovalStatus());
        assertNull(tutor.getRejectionReason());
    }

    @Test
    void rejectedTutorWithCanonicalNoOpKeepsRejectionReason() {
        Tutor tutor = rejectedTutor("bachelor", "offline", "Cần bổ sung bản scan bằng cấp rõ ràng.");
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.BACHELOR, "2 năm dạy tự do.",
                "Chứng chỉ chưa hợp lệ", TeachingMode.OFFLINE, "Hà Nội"));

        assertEquals("rejected", tutor.getApprovalStatus());
        assertEquals("Cần bổ sung bản scan bằng cấp rõ ràng.", tutor.getRejectionReason());
    }

    @Test
    void pendingTutorUpdateStaysPending() {
        Tutor tutor = tutor("bachelor", "offline", "pending", null);
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.BACHELOR, "3 năm dạy tự do.",
                "Chứng chỉ đã bổ sung", TeachingMode.OFFLINE, "Hà Nội"));

        assertEquals("pending", tutor.getApprovalStatus());
        assertNull(tutor.getRejectionReason());
    }

    @Test
    void approvedTutorWithCredentialChangeReturnsToPending() {
        Tutor tutor = tutor("bachelor", "offline", "approved", null);
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.MASTER, "2 năm dạy tự do.",
                "Chứng chỉ chưa hợp lệ", TeachingMode.OFFLINE, "Hà Nội"));

        assertEquals("pending", tutor.getApprovalStatus());
        assertNull(tutor.getRejectionReason());
        assertEquals("master", tutor.getEducationLevel());
        assertEquals("offline", tutor.getTeachingMode());
    }

    @Test
    void approvedTutorWithLogisticsOnlyChangeStaysApproved() {
        Tutor tutor = tutor("bachelor", "offline", "approved", null);
        when(tutorRepository.findByUserId(14L)).thenReturn(Optional.of(tutor));

        service.updateProfile(14L, updateRequest(EducationLevel.BACHELOR, "2 năm dạy tự do.",
                "Chứng chỉ chưa hợp lệ", TeachingMode.OFFLINE, "Hồ Chí Minh"));

        assertEquals("approved", tutor.getApprovalStatus());
        assertNull(tutor.getRejectionReason());
        assertEquals("Hồ Chí Minh", tutor.getTeachingArea());
    }

    private Tutor rejectedTutor(String educationLevel, String teachingMode, String rejectionReason) {
        return Tutor.builder()
                .id(5L)
                .educationLevel(educationLevel)
                .experience("2 năm dạy tự do.")
                .qualifications("Chứng chỉ chưa hợp lệ")
                .teachingMode(teachingMode)
                .teachingArea("Hà Nội")
                .approvalStatus("rejected")
                .rejectionReason(rejectionReason)
                .build();
    }

    private Tutor tutor(String educationLevel, String teachingMode, String approvalStatus, String rejectionReason) {
        return Tutor.builder()
                .id(5L)
                .educationLevel(educationLevel)
                .experience("2 năm dạy tự do.")
                .qualifications("Chứng chỉ chưa hợp lệ")
                .teachingMode(teachingMode)
                .teachingArea("Hà Nội")
                .approvalStatus(approvalStatus)
                .rejectionReason(rejectionReason)
                .build();
    }

    private UpdateTutorRequest updateRequest(
            EducationLevel educationLevel,
            String experience,
            String qualifications,
            TeachingMode teachingMode,
            String teachingArea) {
        return UpdateTutorRequest.builder()
                .educationLevel(educationLevel)
                .experience(experience)
                .qualifications(qualifications)
                .teachingMode(teachingMode)
                .teachingArea(teachingArea)
                .build();
    }
}
