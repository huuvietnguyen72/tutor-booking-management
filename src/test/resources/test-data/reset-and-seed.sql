SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE chat_messages;
TRUNCATE TABLE notifications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE payments;
TRUNCATE TABLE sessions;
TRUNCATE TABLE booking_schedules;
TRUNCATE TABLE bookings;
TRUNCATE TABLE tutor_applications;
TRUNCATE TABLE tutor_requests;
TRUNCATE TABLE tutor_availability;
TRUNCATE TABLE tutor_subjects;
TRUNCATE TABLE students;
TRUNCATE TABLE parents;
TRUNCATE TABLE tutors;
TRUNCATE TABLE subjects;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users
    (id, email, password, role, auth_provider, full_name, phone, avatar_url, address,
     is_active, refresh_token, created_at, updated_at, deleted_at)
VALUES
    (1, 'admin@test.local', @test_password_hash, 'ADMIN', 'LOCAL', 'Quản trị viên Test',
     '0900000001', NULL, 'Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (2, 'parent.one@test.local', @test_password_hash, 'PARENT', 'LOCAL', 'Nguyễn Minh Anh',
     '0900000002', NULL, 'Cầu Giấy, Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (3, 'parent.two@test.local', @test_password_hash, 'PARENT', 'LOCAL', 'Trần Thu Hà',
     '0900000003', NULL, 'Thanh Xuân, Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (4, 'parent.disabled@test.local', @test_password_hash, 'PARENT', 'LOCAL', 'Phụ huynh Đã khóa',
     '0900000004', NULL, 'Hà Nội', FALSE, NULL, NOW(), NOW(), NULL),
    (10, 'tutor.online@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Lê Hoàng Nam',
     '0900000010', NULL, 'Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (11, 'tutor.offline@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Phạm Ngọc Lan',
     '0900000011', NULL, 'Cầu Giấy, Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (12, 'tutor.both@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Vũ Đức Long',
     '0900000012', NULL, 'Thanh Xuân, Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (13, 'tutor.pending@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Đỗ Mai Chi',
     '0900000013', NULL, 'Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (14, 'tutor.rejected@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Bùi Quang Huy',
     '0900000014', NULL, 'Hà Nội', TRUE, NULL, NOW(), NOW(), NULL),
    (15, 'tutor.disabled@test.local', @test_password_hash, 'TUTOR', 'LOCAL', 'Gia sư Đã khóa',
     '0900000015', NULL, 'Hà Nội', FALSE, NULL, NOW(), NOW(), NULL),
    (16, 'parent.google@test.local', @test_password_hash, 'PARENT', 'GOOGLE', 'Phụ huynh Google',
     '0900000016', NULL, 'Hà Nội', TRUE, NULL, NOW(), NOW(), NULL);

INSERT INTO parents (id, user_id, address, district, city, created_at, updated_at)
VALUES
    (1, 2, '123 Xuân Thủy', 'Cầu Giấy', 'Hà Nội', NOW(), NOW()),
    (2, 3, '45 Nguyễn Trãi', 'Thanh Xuân', 'Hà Nội', NOW(), NOW()),
    (3, 4, '10 Trần Duy Hưng', 'Cầu Giấy', 'Hà Nội', NOW(), NOW()),
    (4, 16, '20 Hoàng Quốc Việt', 'Cầu Giấy', 'Hà Nội', NOW(), NOW());

INSERT INTO tutors
    (id, user_id, education_level, experience, qualifications, teaching_mode, teaching_area,
     approval_status, rejection_reason, approved_at, created_at, updated_at)
VALUES
    (1, 10, 'master', '6 năm dạy Toán và Vật lý trực tuyến.', 'Thạc sĩ Toán học', 'online',
     'Toàn quốc', 'approved', NULL, DATE_SUB(NOW(), INTERVAL 120 DAY), NOW(), NOW()),
    (2, 11, 'bachelor', '4 năm dạy tiếng Anh tại nhà.', 'IELTS 8.0', 'offline',
     'Cầu Giấy, Ba Đình', 'approved', NULL, DATE_SUB(NOW(), INTERVAL 90 DAY), NOW(), NOW()),
    (3, 12, 'phd', '8 năm luyện thi và dạy nhóm.', 'Tiến sĩ Vật lý', 'both',
     'Hà Nội', 'approved', NULL, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW(), NOW()),
    (4, 13, 'bachelor', '1 năm trợ giảng.', 'Cử nhân Sư phạm', 'online',
     'Toàn quốc', 'pending', NULL, NULL, NOW(), NOW()),
    (5, 14, 'bachelor', '2 năm dạy tự do.', 'Chứng chỉ chưa hợp lệ', 'offline',
     'Hà Nội', 'rejected', 'Cần bổ sung bản scan bằng cấp rõ ràng.', NULL, NOW(), NOW()),
    (6, 15, 'master', '5 năm kinh nghiệm.', 'Thạc sĩ Ngữ văn', 'both',
     'Hà Nội', 'approved', NULL, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW(), NOW());

INSERT INTO subjects (id, name, description, is_active, created_at, updated_at)
VALUES
    (1, 'Toán học', 'Toán từ cơ bản đến nâng cao.', TRUE, NOW(), NOW()),
    (2, 'Tiếng Anh', 'Ngữ pháp, giao tiếp và luyện thi.', TRUE, NOW(), NOW()),
    (3, 'Vật lý', 'Vật lý THCS và THPT.', TRUE, NOW(), NOW()),
    (4, 'Hóa học', 'Hóa học THCS và THPT.', TRUE, NOW(), NOW()),
    (5, 'Ngữ văn', 'Đọc hiểu và kỹ năng viết.', TRUE, NOW(), NOW()),
    (6, 'Tin học thử nghiệm', 'Môn đã ngừng tuyển sinh.', FALSE, NOW(), NOW());

INSERT INTO students
    (id, parent_id, full_name, grade, school, academic_level, special_notes, created_at, updated_at)
VALUES
    (1, 1, 'Nguyễn Gia Bảo', 5, 'Tiểu học Dịch Vọng A', 'good', 'Cần củng cố kỹ năng giải toán.', NOW(), NOW()),
    (2, 1, 'Nguyễn Minh Khang', 9, 'THCS Cầu Giấy', 'average', 'Ôn thi vào lớp 10.', NOW(), NOW()),
    (3, 2, 'Trần Ngọc Mai', 5, 'Tiểu học Nguyễn Trãi', 'excellent', NULL, NOW(), NOW()),
    (4, 2, 'Trần Hoàng Sơn', 12, 'THPT Nhân Chính', 'weak', 'Mất gốc Vật lý.', NOW(), NOW()),
    (5, 3, 'Học sinh Tài khoản khóa', 7, 'THCS Test', 'average', NULL, NOW(), NOW());

INSERT INTO tutor_subjects (id, tutor_id, subject_id, grade_level, price_per_session, created_at, updated_at)
VALUES
    (1, 1, 1, 5, 200000, NOW(), NOW()),
    (2, 1, 1, 9, 250000, NOW(), NOW()),
    (3, 1, 3, 9, 280000, NOW(), NOW()),
    (4, 2, 2, 5, 180000, NOW(), NOW()),
    (5, 2, 2, 9, 220000, NOW(), NOW()),
    (6, 2, 5, 9, 200000, NOW(), NOW()),
    (7, 3, 1, 5, 300000, NOW(), NOW()),
    (8, 3, 3, 12, 350000, NOW(), NOW()),
    (9, 3, 4, 12, 330000, NOW(), NOW()),
    (10, 4, 2, 5, 150000, NOW(), NOW()),
    (11, 5, 5, 9, 170000, NOW(), NOW()),
    (12, 6, 5, 12, 260000, NOW(), NOW());

INSERT INTO tutor_availability
    (id, tutor_id, day_of_week, start_time, end_time, is_active, created_at, updated_at)
VALUES
    (1, 1, 1, '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
    (2, 1, 3, '19:00:00', '21:00:00', TRUE, NOW(), NOW()),
    (3, 1, 6, '09:00:00', '11:00:00', TRUE, NOW(), NOW()),
    (4, 2, 2, '18:00:00', '20:00:00', TRUE, NOW(), NOW()),
    (5, 2, 4, '18:00:00', '20:00:00', TRUE, NOW(), NOW()),
    (6, 3, 1, '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
    (7, 3, 5, '19:00:00', '21:00:00', TRUE, NOW(), NOW()),
    (8, 3, 7, '09:30:00', '10:30:00', TRUE, NOW(), NOW()),
    (9, 4, 3, '18:00:00', '20:00:00', TRUE, NOW(), NOW()),
    (10, 5, 2, '08:00:00', '10:00:00', FALSE, NOW(), NOW()),
    (11, 6, 6, '14:00:00', '16:00:00', TRUE, NOW(), NOW());

INSERT INTO tutor_requests
    (id, parent_id, subject_id, student_id, grade_level, desired_price, teaching_mode,
     preferred_area, schedule_note, sessions_per_week, status, approved_at, created_at, updated_at)
VALUES
    (1, 1, 1, 1, 5, 200000, 'ONLINE', NULL, 'Tối thứ 3 hoặc thứ 5.', 2,
     'SEARCHING', NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
    (2, 1, 2, 2, 9, 220000, 'OFFLINE', 'Cầu Giấy', 'Ôn thi vào lớp 10.', 3,
     'HAS_APPLICANTS', NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
    (3, 2, 1, 3, 5, 280000, 'BOTH', 'Thanh Xuân', 'Cần gia sư có kinh nghiệm.', 2,
     'MATCHED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    (4, 2, 3, 4, 12, 320000, 'OFFLINE', 'Thanh Xuân', 'Yêu cầu đã hủy nhưng còn application pending để test.', 2,
     'CANCELLED', NULL, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
    (5, 1, 5, 2, 9, 190000, 'OFFLINE', 'Cầu Giấy', 'Tất cả ứng viên đã bị từ chối.', 1,
     'HAS_APPLICANTS', NULL, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
    (6, 4, 2, NULL, 5, 180000, 'ONLINE', NULL, 'Request ở trạng thái PENDING để test lọc.', 1,
     'PENDING', NULL, NOW(), NOW());

INSERT INTO tutor_applications
    (id, request_id, tutor_id, proposed_price, cover_letter, status, responded_at, created_at)
VALUES
    (1, 2, 2, 210000, 'Tôi có kinh nghiệm ôn thi vào lớp 10.', 'PENDING', NULL, DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (2, 2, 3, 230000, 'Tôi có thể dạy trực tiếp ba buổi mỗi tuần.', 'PENDING', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (3, 3, 1, 280000, 'Tôi phù hợp với yêu cầu này.', 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (4, 3, 3, 300000, 'Ứng tuyển thứ hai cho request đã matched.', 'REJECTED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (5, 4, 1, 320000, 'Application pending trong request cancelled để test invalid transition.', 'PENDING', NULL, DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (6, 5, 2, 190000, 'Ứng viên duy nhất đã bị từ chối.', 'REJECTED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY));

INSERT INTO bookings
    (id, parent_id, tutor_id, subject_id, student_id, grade_level, price_per_session,
     teaching_mode, is_recurring, recurring_start_date, recurring_end_date, status, created_at, updated_at)
VALUES
    (1, 1, 1, 1, 1, 5, 200000, 'ONLINE', FALSE,
     DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY),
     'WAITING_TUTOR_CONFIRM', NOW(), NOW()),
    (2, 1, 1, 1, 1, 5, 200000, 'ONLINE', TRUE,
     DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 28 DAY),
     'ACTIVE', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    (3, 1, 2, 2, 2, 9, 220000, 'OFFLINE', TRUE,
     DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 21 DAY),
     'PAUSED', DATE_SUB(NOW(), INTERVAL 12 DAY), NOW()),
    (4, 2, 3, 1, 3, 5, 300000, 'OFFLINE', TRUE,
     DATE_SUB(CURRENT_DATE, INTERVAL 35 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY),
     'COMPLETED', DATE_SUB(NOW(), INTERVAL 40 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (5, 2, 2, 2, 3, 5, 180000, 'OFFLINE', FALSE,
     DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY),
     'CANCELLED', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
    (6, 1, 3, 3, 2, 12, 350000, 'ONLINE', FALSE,
     DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY),
     'PENDING_PAYMENTS', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
    (7, 1, 2, 5, 2, 9, 200000, 'OFFLINE', TRUE,
     DATE_SUB(CURRENT_DATE, INTERVAL 28 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY),
     'COMPLETED', DATE_SUB(NOW(), INTERVAL 35 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO booking_schedules (id, booking_id, day_of_week, start_time, end_time)
VALUES
    (1, 1, WEEKDAY(DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)) + 1, '08:00:00', '10:00:00'),
    (2, 2, 1, '08:00:00', '10:00:00'),
    (3, 2, 3, '19:00:00', '21:00:00'),
    (4, 3, 2, '18:00:00', '20:00:00'),
    (5, 3, 4, '18:00:00', '20:00:00'),
    (6, 4, 1, '14:00:00', '16:00:00'),
    (7, 5, WEEKDAY(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)) + 1, '18:00:00', '20:00:00'),
    (8, 6, WEEKDAY(DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)) + 1, '19:00:00', '21:00:00'),
    (9, 7, 4, '18:00:00', '20:00:00');

INSERT INTO sessions
    (id, booking_id, session_date, start_time, end_time, status, cancelled_by, cancel_reason, created_at, updated_at)
VALUES
    (1, 2, DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY), '08:00:00', '10:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW()),
    (2, 2, DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), '19:00:00', '21:00:00', 'CANCELLED', 2, 'Học sinh bị ốm.', NOW(), NOW()),
    (3, 2, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '08:00:00', '10:00:00', 'CONFIRMED', NULL, NULL, NOW(), NOW()),
    (4, 2, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '19:00:00', '21:00:00', 'PENDING', NULL, NULL, NOW(), NOW()),
    (5, 3, DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), '18:00:00', '20:00:00', 'CANCELLED', 2, 'Booking đang tạm dừng.', NOW(), NOW()),
    (6, 3, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '18:00:00', '20:00:00', 'CANCELLED', 2, 'Booking đang tạm dừng.', NOW(), NOW()),
    (7, 4, DATE_SUB(CURRENT_DATE, INTERVAL 28 DAY), '14:00:00', '16:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW()),
    (8, 4, DATE_SUB(CURRENT_DATE, INTERVAL 21 DAY), '14:00:00', '16:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW()),
    (9, 5, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '18:00:00', '20:00:00', 'CANCELLED', 3, 'Phụ huynh đổi kế hoạch.', NOW(), NOW()),
    (10, 7, DATE_SUB(CURRENT_DATE, INTERVAL 21 DAY), '18:00:00', '20:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW()),
    (11, 7, DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY), '18:00:00', '20:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW()),
    (12, 7, DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), '18:00:00', '20:00:00', 'COMPLETED', NULL, NULL, NOW(), NOW());

INSERT INTO reviews (id, booking_id, parent_id, tutor_id, rating, comment, created_at)
VALUES
    (1, 4, 2, 3, 5, 'Gia sư giảng dễ hiểu, đúng giờ và hỗ trợ học sinh rất tốt.', DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO payments
    (id, user_id, booking_id, request_id, amount, payment_type, payment_method, status,
     transaction_id, paid_at, checkout_url, qr_code, created_at, updated_at)
VALUES
    (1, 2, 6, NULL, 10000, 'CLASS_FINDING_FEE', 'BANK_TRANSFER', 'PENDING',
     NULL, NULL, NULL, NULL, NOW(), NOW()),
    (2, 12, 6, NULL, 10000, 'CLASS_RECEIVING_FEE', 'BANK_TRANSFER', 'COMPLETED',
     'TEST-TXN-0002', DATE_SUB(NOW(), INTERVAL 1 DAY), 'https://pay.test.local/2', 'TEST-QR-2', NOW(), NOW()),
    (3, 3, 5, NULL, 10000, 'CLASS_FINDING_FEE', 'BANK_TRANSFER', 'FAILED',
     'TEST-TXN-0003', NULL, NULL, NULL, NOW(), NOW()),
    (4, 2, 4, NULL, 10000, 'CLASS_FINDING_FEE', 'BANK_TRANSFER', 'REFUNDED',
     'TEST-TXN-0004', DATE_SUB(NOW(), INTERVAL 30 DAY), NULL, NULL, NOW(), NOW());

INSERT INTO chat_messages (id, user_id, role, content, created_at)
VALUES
    (1, 2, 'USER', 'Tôi cần tìm gia sư Toán lớp 5.', DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
    (2, 2, 'ASSISTANT', 'Bạn có thể lọc gia sư theo môn Toán và lớp 5.', DATE_SUB(NOW(), INTERVAL 19 MINUTE)),
    (3, 2, 'USER', 'Tôi muốn học trực tuyến.', DATE_SUB(NOW(), INTERVAL 18 MINUTE)),
    (4, 2, 'ASSISTANT', 'Gia sư Lê Hoàng Nam đang hỗ trợ hình thức trực tuyến.', DATE_SUB(NOW(), INTERVAL 17 MINUTE)),
    (5, 10, 'USER', 'Làm sao cập nhật lịch rảnh?', DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
    (6, 10, 'ASSISTANT', 'Bạn có thể cập nhật tại mục Lịch rảnh trong dashboard gia sư.', DATE_SUB(NOW(), INTERVAL 9 MINUTE));

INSERT INTO notifications
    (id, user_id, title, content, type, is_read, reference_type, reference_id, created_at)
VALUES
    (1, 10, 'Có lời mời dạy mới', 'Phụ huynh đã gửi một booking mới.', 'booking_confirmed', FALSE, 'BOOKING', 1, NOW()),
    (2, 2, 'Booking đã được xác nhận', 'Gia sư đã xác nhận lịch học.', 'booking_confirmed', TRUE, 'BOOKING', 2, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (3, 2, 'Có ứng viên mới', 'Yêu cầu tìm gia sư có ứng viên mới.', 'new_application', FALSE, 'TUTOR_REQUEST', 2, NOW()),
    (4, 10, 'Ứng tuyển được chấp nhận', 'Phụ huynh đã chấp nhận ứng tuyển.', 'application_accepted', TRUE, 'TUTOR_APPLICATION', 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (5, 12, 'Ứng tuyển bị từ chối', 'Phụ huynh đã chọn một gia sư khác.', 'application_rejected', FALSE, 'TUTOR_APPLICATION', 4, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (6, 13, 'Hồ sơ đang chờ duyệt', 'Hồ sơ của bạn đang được quản trị viên xem xét.', 'tutor_approved', FALSE, 'TUTOR', 4, NOW()),
    (7, 14, 'Hồ sơ cần bổ sung', 'Vui lòng bổ sung bằng cấp rõ ràng.', 'tutor_rejected', FALSE, 'TUTOR', 5, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (8, 2, 'Yêu cầu thanh toán', 'Vui lòng hoàn tất phí dịch vụ.', 'payment_due', FALSE, 'PAYMENT', 1, NOW());
