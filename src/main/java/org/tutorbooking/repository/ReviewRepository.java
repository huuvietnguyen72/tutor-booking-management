package org.tutorbooking.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.tutorbooking.domain.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByBookingId(Long bookingId);
    @Query("SELECT r.booking.id FROM Review r WHERE r.booking.id IN :bookingIds")
    List<Long> findReviewedBookingIds(@Param("bookingIds") List<Long> bookingIds);
    Page<Review> findByTutorId(Long tutorId, Pageable pageable);
    Page<Review> findByTutorIdAndRating(Long tutorId, Integer rating, Pageable pageable);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.tutor.id = :tutorId")
    Double getAverageRatingByTutorId(@Param("tutorId") Long tutorId);
    
    long countByTutorId(Long tutorId);
}
