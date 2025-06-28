package com.eclassroom.management_service.resolvers

import com.eclassroom.management_service.dto.*
import com.eclassroom.management_service.services.CourseService
import graphql.GraphQLException
import graphql.GraphqlErrorException
import jakarta.persistence.EntityNotFoundException
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import java.util.*

@Controller
class CourseResolver(
    private val courseService: CourseService
) {

    @QueryMapping
    fun getAllCourses(): List<CourseDto> {
        return courseService.getAllCourses()
    }

    @QueryMapping
    fun getAllCoursesBySem(@Argument sem:Int): List<CourseDto> {
        return courseService.getAllCoursesBySem(sem)
    }

    @QueryMapping
    fun getCourseById(@Argument id: Long): CourseDto? {
        return when (val result = courseService.getCourseById(id)) {
            is CourseService.Result.Success -> result.entity
            is CourseService.Result.Error -> throw GraphQLException(result.msg)
            is CourseService.Result.NotFound -> throw EntityNotFoundException(result.msg)
            else -> {throw GraphQLException("There was an error.")}
        }
    }

    @QueryMapping
    fun getFacultyCourses(@Argument facultyId: Long): List<CourseDto> {
        return when (val result = courseService.getFacultyCourses(facultyId)) {
            is CourseService.FacultyCourseResult.Success -> result.course.map { it.toDto() }
            is CourseService.FacultyCourseResult.Error -> throw GraphQLException(result.msg)
            is CourseService.FacultyCourseResult.NotFound -> throw (GraphqlErrorException.newErrorException()
                .message(result.msg)
                .extensions(mapOf("errorCode" to "FACULTY_DOES_NOT_EXISTS"))
                .build())
            else -> {throw GraphQLException("There was an error.")}
        }
    }

    @MutationMapping
    fun saveCourse(@Argument course: CourseInputDto): String {
        return when (val result = courseService.saveCourse(course)) {
            is CourseService.Result.Success -> result.msg
            is CourseService.Result.Error -> throw GraphQLException(result.msg)
            is CourseService.Result.AlreadyExists ->  throw (GraphqlErrorException.newErrorException()
                .message(result.msg)
                .extensions(mapOf("errorCode" to "COURSE_ALREADY_EXISTS"))
                .build())
            else -> {throw GraphQLException("There was an error.")}
        }
    }

    @MutationMapping
    fun enrollStudentToCourse(@Argument courseId: Long, @Argument studentIds: Long): String {
        return when (val result = courseService.enrollStudent(courseId, studentIds)) {
            is CourseService.Result.Success -> result.msg
            is CourseService.Result.Error -> throw GraphQLException(result.msg)
            is CourseService.Result.NotFound -> throw EntityNotFoundException(result.msg)
            else -> {throw GraphQLException("There was an error.")}
        }
    }

    @MutationMapping
    fun assignFacultyToCourse(@Argument courseId: Long, @Argument facultyId: Long): String {
        return when (val result = courseService.assignFaculty(courseId, facultyId)) {
            is CourseService.Result.Success -> result.msg
            is CourseService.Result.Error -> throw GraphQLException(result.msg)
            is CourseService.Result.NotFound -> throw EntityNotFoundException(result.msg)
            else -> {throw GraphQLException("There was an error.")}
        }
    }

    @QueryMapping
    fun getCourseStudents(@Argument courseId: Long): List<UserDto> {
        return when (val result = courseService.getCourseStudents(courseId)) {
            is CourseService.CourseStudentsResult.Success -> result.students
            is CourseService.CourseStudentsResult.Error -> throw GraphQLException(result.msg)
            is CourseService.CourseStudentsResult.NotFound -> throw throw (GraphqlErrorException.newErrorException()
                .message(result.msg)
                .extensions(mapOf("errorCode" to "COURSE_DOES_NOT_EXIST"))
                .build())
            else -> {throw GraphQLException("There was an error.")}
        }
    }
}