package org.tutorbooking.service.Impl;

import org.tutorbooking.dto.response.TopTutorResponse;
import org.tutorbooking.exception.ResourceNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.tutorbooking.service.TutorService;
import org.tutorbooking.repository.TutorRepository;
import org.tutorbooking.domain.entity.Tutor;
import org.tutorbooking.domain.entity.Review;
import org.tutorbooking.dto.request.UpdateTutorRequest;
import org.tutorbooking.dto.response.ReviewResponse;
import org.tutorbooking.dto.response.TutorDetailResponse;
import org.tutorbooking.dto.response.TutorReviewSummaryResponse;
import org.tutorbooking.domain.enums.EducationLevel;
import org.tutorbooking.domain.enums.TeachingMode;
import org.tutorbooking.domain.enums.TutorApprovalStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.tutorbooking.repository.ReviewRepository;

import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public TutorDetailResponse getTutorDetail(Long tutorId) {
        Tutor tutor = tutorRepository.findDetailById(tutorId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ gia sư: " + tutorId));

        if (!"approved".equalsIgnoreCase(tutor.getApprovalStatus())) {
            throw new ResourceNotFoundException("Hồ sơ gia sư này chưa được phê duyệt công khai.");
        }
        return mapToTutorDetailResponse(tutor);
    }

    @Override
    public TutorDetailResponse getMyTutorProfile(Long userId) {
        Tutor tutor = tutorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ gia sư."));
        
        return mapToTutorDetailResponse(tutor);
    }

    @Override
    @Transactional
    public void updateProfile(Long userId, UpdateTutorRequest req) {
        Tutor tutor = tutorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ gia sư để cập nhật."));

        boolean educationChanged = req.getEducationLevel() != educationLevel(tutor.getEducationLevel());
        boolean experienceChanged = !Objects.equals(req.getExperience(), tutor.getExperience());
        boolean qualificationsChanged = !Objects.equals(req.getQualifications(), tutor.getQualifications());
        boolean teachingModeChanged = req.getTeachingMode() != teachingMode(tutor.getTeachingMode());
        boolean teachingAreaChanged = !Objects.equals(req.getTeachingArea(), tutor.getTeachingArea());
        boolean anyChange = educationChanged || experienceChanged || qualificationsChanged
                || teachingModeChanged || teachingAreaChanged;
        boolean credentialChange = educationChanged || experienceChanged || qualificationsChanged;
        TutorApprovalStatus currentStatus = approvalStatus(tutor.getApprovalStatus());

        if ((currentStatus == TutorApprovalStatus.REJECTED && anyChange)
                || (currentStatus == TutorApprovalStatus.APPROVED && credentialChange)) {
            tutor.setApprovalStatus("pending");
            tutor.setRejectionReason(null);
        }

        tutor.setEducationLevel(persistenceValue(req.getEducationLevel()));
        tutor.setExperience(req.getExperience());
        tutor.setQualifications(req.getQualifications());
        tutor.setTeachingMode(persistenceValue(req.getTeachingMode()));
        tutor.setTeachingArea(req.getTeachingArea());
    }

    @Override
    public Page<TutorDetailResponse> searchTutors(Long subjectId, Integer grade, Long minPrice, Long maxPrice, String teachingMode, int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt"); // default
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Sort.Direction dir = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(dir, sortBy);
        }
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Tutor> tutors = tutorRepository.searchApprovedTutors(subjectId, grade, minPrice, maxPrice, teachingMode, pageable);
        return tutors.map(this::mapToTutorDetailResponse);
    }

    
    @Override
    public TutorReviewSummaryResponse getTutorReviews(Long tutorId, Integer rating, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Double avgRating = reviewRepository.getAverageRatingByTutorId(tutorId);
        if (avgRating == null) avgRating = 0.0;
        
        long totalReviews = reviewRepository.countByTutorId(tutorId);
        
        Page<Review> reviewPage;
        if (rating != null) {
            reviewPage = reviewRepository.findByTutorIdAndRating(tutorId, rating, pageable);
        } else {
            reviewPage = reviewRepository.findByTutorId(tutorId, pageable);
        }
        
        Page<ReviewResponse> reviewDtos = reviewPage.map(review -> ReviewResponse.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId()) 
                .parentName(review.getParent().getUser().getFullName())
                .tutorName(review.getTutor().getUser().getFullName()) 
                .subjectName(review.getBooking().getSubject().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build());

        return TutorReviewSummaryResponse.builder()
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalReviews(totalReviews)
                .reviews(reviewDtos)
                .build();
    }


    private TutorDetailResponse mapToTutorDetailResponse(Tutor tutor) {
        TutorDetailResponse res = new TutorDetailResponse();
        res.setId(tutor.getId());

        if (tutor.getUser() != null) {
            res.setFullName(tutor.getUser().getFullName());
            res.setAvatarUrl(tutor.getUser().getAvatarUrl());
            res.setEmail(tutor.getUser().getEmail());
        }

        res.setEducationLevel(educationLevel(tutor.getEducationLevel()));
        res.setExperience(tutor.getExperience());
        res.setQualifications(tutor.getQualifications());
        res.setTeachingMode(teachingMode(tutor.getTeachingMode()));
        res.setTeachingArea(tutor.getTeachingArea());
        res.setApprovalStatus(approvalStatus(tutor.getApprovalStatus()));
        res.setRejectionReason(tutor.getRejectionReason());

        return res;
    }

    @Override
    public Page<TutorDetailResponse> getPendingTutors (int page, int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Tutor> tutors = tutorRepository.findPendingTutors(pageable);

        return tutors.map(this::mapToTutorDetailResponse);
    }

    @Override
    @Transactional
    public void approveTutor(Long tutorId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ gia sư"));
        
        if (!"pending".equalsIgnoreCase(tutor.getApprovalStatus())) {
            throw new RuntimeException("Hồ sơ này không ở trạng thái chờ duyệt!");
        }
        
        tutor.setApprovalStatus("approved");
        tutor.setRejectionReason(null); // Xóa lý do từ chối cũ (nếu có)
    }

    @Override
    @Transactional
    public void rejectTutor(Long tutorId, String reason) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ gia sư"));
        
        if (!"pending".equalsIgnoreCase(tutor.getApprovalStatus())) {
            throw new RuntimeException("Hồ sơ này không ở trạng thái chờ duyệt!");
        }
        
        tutor.setApprovalStatus("rejected");
        tutor.setRejectionReason(reason);
    }

    @Override
    public Page<TopTutorResponse> getTopTutors(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return tutorRepository.findTopTutors(pageable);
    }

    private EducationLevel educationLevel(String value) {
        return EducationLevel.valueOf(value.toUpperCase(Locale.ROOT));
    }

    private TeachingMode teachingMode(String value) {
        return TeachingMode.valueOf(value.toUpperCase(Locale.ROOT));
    }

    private TutorApprovalStatus approvalStatus(String value) {
        return TutorApprovalStatus.valueOf(value.toUpperCase(Locale.ROOT));
    }

    private String persistenceValue(Enum<?> value) {
        return value.name().toLowerCase(Locale.ROOT);
    }
}
