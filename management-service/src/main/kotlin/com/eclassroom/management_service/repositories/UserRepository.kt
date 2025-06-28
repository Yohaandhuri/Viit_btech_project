package com.eclassroom.management_service.repositories

import com.eclassroom.management_service.commonEnums.RoleEnum
import com.eclassroom.management_service.dto.CourseDto
import com.eclassroom.management_service.dto.CourseDtoTemp
import com.eclassroom.management_service.dto.UserDto
import com.eclassroom.management_service.dto.UserDtoTemp
import com.eclassroom.management_service.entities.CourseEntity
import com.eclassroom.management_service.entities.UsersEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface UserRepository : JpaRepository<UsersEntity,Long> {
    fun findByEmail(email:String): UsersEntity?
    fun existsByRoleNumber(roleId: Int): Boolean
//    fun findByRole(role:RoleEnum): List<UsersEntity>

    @Query("""
        SELECT new com.eclassroom.management_service.dto.CourseDtoTemp(
            c.id, c.title, c.duration, c.credicts, c.faculty.id, c.year, c.sem
        )
        FROM CourseEntity c
        WHERE c.faculty.id = :userId OR :userId IN (SELECT s.id FROM c.students s)
    """)
    fun findCoursesByUserId(@Param("userId") userId: Long): List<CourseDtoTemp>

    @Query("""
    SELECT new com.eclassroom.management_service.dto.UserDtoTemp(
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.dob,
        u.phoneNumber,
        u.status,
        u.role,
        u.gender,
        u.createdBy,
        u.roleNumber,
        u.sem
    )
    FROM UsersEntity u
    WHERE u.role = :role
""")
    fun findUserDtosByRole(@Param("role") role: RoleEnum): List<UserDtoTemp>
}
