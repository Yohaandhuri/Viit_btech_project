package com.eclassroom.management_service.dto

import com.eclassroom.management_service.entities.CourseEntity
import com.eclassroom.management_service.entities.UsersEntity

data class CourseDto(
    val id: Long? = null,
    val title: String,
    val duration: String,
    val credits: String,
    val facultyId: Long?, // reference by ID
    val year:String = "2025",
    val sem:Int = 1
//    val studentIds: Set<Long> = setOf() // reference by IDs
)

data class CourseDtoTemp(
    val id: Long? = null,
    val title: String,
    val duration: String,
    val credicts: String,
    val facultyId: Long?, // reference by ID
    val year:String = "2025",
    val sem:Int = 1
//    val studentIds: Set<Long> = setOf() // reference by IDs
)

data class CourseInputDto(
    val title: String,
    val duration: String,
    val credits: String,
    val facultyId: Long? = null,// reference by ID
    val year:String = "2025",
    val sem:Int = 1
)

fun CourseEntity.toDto(): CourseDto {
    return CourseDto(
        id = this.id,
        title = this.title,
        duration = this.duration,
        credits = this.credicts,
        facultyId = this.faculty?.id,
        year = this.year,
        sem = this.sem
//        studentIds = this.students.mapNotNull { it.id }.toSet()
    )
}

fun CourseDtoTemp.toDto(): CourseDto {
    return CourseDto(
        id = this.id,
        title = this.title,
        duration = this.duration,
        credits = this.credicts,
        facultyId = this.facultyId,
        year = this.year,
        sem = this.sem
//        studentIds = this.students.mapNotNull { it.id }.toSet()
    )
}

fun CourseInputDto.toEntity(
    faculty: UsersEntity?,
): CourseEntity {
    return CourseEntity(
        title = this.title,
        duration = this.duration,
        credicts = this.credits,
        faculty = faculty,
        year = this.year,
        sem = this.sem
    )
}
