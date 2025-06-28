package com.eclassroom.management_service.services

import com.eclassroom.management_service.dto.*
import com.eclassroom.management_service.entities.CourseEntity
import com.eclassroom.management_service.entities.UsersEntity
import com.eclassroom.management_service.repositories.CourseRepository
import com.eclassroom.management_service.repositories.UserRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.stereotype.Service
import java.util.*
import kotlin.jvm.optionals.getOrNull

@Service
class CourseService(
    private val courseRepository: CourseRepository,
    private val userRepository: UserRepository
) {

    interface Result{
        data class Success(val msg:String,var entity:CourseDto?=null) : Result
        data class Error(val msg:String): Result
        data class NotFound(val msg: String): Result
        data class AlreadyExists(val msg: String): Result
    }

    interface FacultyCourseResult{
        data class Success(var course:List<CourseEntity>) : FacultyCourseResult
        data class Error(val msg:String): FacultyCourseResult
        data class NotFound(val msg: String): FacultyCourseResult
    }

    interface CourseStudentsResult{
        data class Success(var students:List<UserDto>) : CourseStudentsResult
        data class Error(val msg:String): CourseStudentsResult
        data class NotFound(val msg: String): CourseStudentsResult
    }

    fun getCourseById(id: Long): Result {
        val course = courseRepository.findById(id).getOrNull()
            ?: return  Result.NotFound( msg = "Course with id $id not found")
        return Result.Success( msg = "Success",entity = course.toDto())
    }

    fun getAllCourses(): List<CourseDto> {
        return courseRepository.findAll().map { it.toDto() }
    }

    fun getAllCoursesBySem(sem:Int): List<CourseDto> {
        return courseRepository.findBySem(sem)?.map { it.toDto() } ?: listOf()
    }

    fun saveCourse(courseInputDto: CourseInputDto): Result {
        try {
            if(courseRepository.findByTitle(courseInputDto.title)!=null)
                return Result.AlreadyExists("Course with title:${courseInputDto.title} already exists")

            var faculty: UsersEntity? = null
            if(courseInputDto.facultyId!=null){
                faculty = userRepository.findById(courseInputDto.facultyId).getOrNull() ?:
                return Result.NotFound("Faculty with ID:${faculty} does not exist")
            }

            val entity = courseInputDto.toEntity(faculty)
            courseRepository.save(entity)
            return Result.Success("Course data saved successfully")
        } catch (e:Exception){
            return Result.Error("Error while saving course: ${e.message} ${e.cause}")
        }
    }

    @Transactional
    fun enrollStudent(courseId: Long, studentId: Long): Result {
//        val course = courseRepository.findById(courseId).getOrNull()
//            ?: return Result.NotFound(msg = "Course with id $courseId not found")
//        println("courseId${course.id}")
//
//        val student = userRepository.findById(studentId).getOrNull()
//            ?: return Result.NotFound("No valid student found for provided ID.")
//        println("studentid${student.id}")
//
//        if (course.students.any { it.id == studentId }) {
//            return Result.AlreadyExists("Student already enrolled to course")
//        }
//        println("test${student.id}")

        val rowsInserted = courseRepository.enrollStudentInCourse(studentId, courseId)
        println("test${rowsInserted}")
        return if (rowsInserted!=null) {
            Result.Success("Student enrolled successfully")
        } else {
            Result.AlreadyExists("Student already enrolled in course")
        }

    }

    fun getFacultyCourses(facultyId: Long): FacultyCourseResult{
        if(!userRepository.existsById(facultyId))
            return FacultyCourseResult.NotFound("No faculty found for given ID:${facultyId}.")
        val courses = courseRepository.findByFacultyId(facultyId) ?: listOf()
        return FacultyCourseResult.Success(courses)
    }

    fun assignFaculty(courseId: Long, facultyId: Long): Result {
        val course = courseRepository.findById(courseId).getOrNull()
            ?: return  Result.NotFound( msg = "Course with id $courseId not found")

        val faculty = userRepository.findById(facultyId).getOrNull()
            ?: return  Result.NotFound( msg = "Faculty with id $facultyId not found")

        course.faculty = faculty
        courseRepository.save(course)

        return Result.Success("Faculty assigned successfully")
    }

    fun getCourseStudents(courseId:Long):CourseStudentsResult{
        val course = courseRepository.findById(courseId).getOrNull()
            ?: return CourseStudentsResult.NotFound( msg = "Course with id $courseId not found")
        val students = courseRepository.findStudentsByCourseId(courseId)
        return CourseStudentsResult.Success(students.map { it.toUserDto() })
    }

}