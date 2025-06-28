package com.eclassroom.management_service.repositories

import com.eclassroom.management_service.dto.UserDtoTemp
import com.eclassroom.management_service.entities.CourseEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.data.jpa.repository.Modifying
import org.springframework.transaction.annotation.Transactional


@Repository
interface CourseRepository : JpaRepository<CourseEntity, Long> {
    fun findByTitle(title:String):CourseEntity?
    fun findByFacultyId(facultyId:Long): List<CourseEntity>?
    fun findBySem(sem:Int): List<CourseEntity>?
    @Query("""
        SELECT new com.eclassroom.management_service.dto.UserDtoTemp(
            u.id, u.firstName, u.lastName, u.email, u.dob, u.phoneNumber,
            u.status, u.role, u.gender, u.createdBy, u.roleNumber, u.sem
        )
        FROM CourseEntity c
        JOIN c.students u
        WHERE c.id = :courseId
    """)
    fun findStudentsByCourseId(@Param("courseId") courseId: Long): List<UserDtoTemp>

    @Modifying
    @Query(value = "INSERT IGNORE INTO student_courses (student_id, course_id) VALUES (:studentId, :courseId)", nativeQuery = true)
    fun enrollStudentInCourse(@Param("studentId") studentId:Long, @Param("courseId") courseId:Long);

}
