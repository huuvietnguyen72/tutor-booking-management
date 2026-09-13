package org.tutorbooking.service.Impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tutorbooking.domain.entity.Parent;
import org.tutorbooking.domain.entity.Student;
import org.tutorbooking.domain.enums.AcademicLevel;
import org.tutorbooking.dto.request.StudentRequest;
import org.tutorbooking.repository.BookingRepository;
import org.tutorbooking.repository.ParentRepository;
import org.tutorbooking.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private StudentServiceImpl service;

    @Test
    void getStudentsByParentReturnsUppercaseAcademicLevelForLowercasePersistenceValue() {
        Long parentUserId = 14L;
        Parent parent = Parent.builder().id(5L).build();
        Student student = Student.builder().id(8L).parent(parent).academicLevel("good").build();
        when(parentRepository.findByUserId(parentUserId)).thenReturn(Optional.of(parent));
        when(studentRepository.findByParentId(parent.getId())).thenReturn(List.of(student));

        assertEquals(AcademicLevel.GOOD, service.getStudentsByParent(parentUserId).get(0).getAcademicLevel());
    }

    @Test
    void addStudentPersistsUppercaseRequestLevelAsLowercase() {
        Long parentUserId = 14L;
        Parent parent = Parent.builder().id(5L).build();
        StudentRequest request = studentRequest("GOOD");
        ArgumentCaptor<Student> savedStudentCaptor = ArgumentCaptor.forClass(Student.class);
        when(parentRepository.findByUserId(parentUserId)).thenReturn(Optional.of(parent));
        when(studentRepository.save(savedStudentCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        service.addStudent(parentUserId, request);

        Student savedStudent = savedStudentCaptor.getValue();
        assertEquals("good", savedStudent.getAcademicLevel());
    }

    @Test
    void addStudentDefaultsMissingAcademicLevelToAverage() {
        Long parentUserId = 14L;
        Parent parent = Parent.builder().id(5L).build();
        StudentRequest request = studentRequest(null);
        ArgumentCaptor<Student> savedStudentCaptor = ArgumentCaptor.forClass(Student.class);
        when(parentRepository.findByUserId(parentUserId)).thenReturn(Optional.of(parent));
        when(studentRepository.save(savedStudentCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        service.addStudent(parentUserId, request);

        assertEquals("average", savedStudentCaptor.getValue().getAcademicLevel());
    }

    private StudentRequest studentRequest(String academicLevel) {
        StudentRequest request = new StudentRequest();
        request.setFullName("Student Test");
        request.setGrade((byte) 5);
        request.setSchool("Test School");
        request.setAcademicLevel(academicLevel);
        request.setSpecialNotes("No notes");
        return request;
    }
}
