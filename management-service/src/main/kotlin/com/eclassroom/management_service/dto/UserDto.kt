package com.eclassroom.management_service.dto

import com.eclassroom.management_service.commonEnums.GenderEnum
import com.eclassroom.management_service.commonEnums.RoleEnum
import com.eclassroom.management_service.commonEnums.StatusEnum
import com.eclassroom.management_service.entities.UsersEntity
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class UserDto (
    val id: Long,
    val creatorId: Long? = null,
    val firstName: String,
    val lastName: String,
    val email: String,
    val dob: String? = null,
    val phoneNumber: String? = null,
    val status: StatusEnum,
    val role: RoleEnum,
    val gender: GenderEnum?,
    val password: String? = null,
    val roleId: Int? = null,
    val sem: Int? = null
)

data class UserInputDto (
    val creatorId: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val dob: String? = null,
    val phoneNumber: String? = null,
    val status: StatusEnum,
    val role: RoleEnum,
    val gender: GenderEnum?,
    val password: String? = null,
    val sem: Int? = null
)

data class EditUserInputDto (
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val dob: String? = null,
    val phoneNumber: String? = null,
    val gender: GenderEnum?,
    val updatedBy: Long? = null
)

data class ResetPasswordInputDto(
    val userId:Long,
    val role: RoleEnum,
    val editedBy: Long,
    val oldPassword: String? = null,
    val newPassword:String
)

data class UserDtoTemp(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val dob: LocalDate,
    val phoneNumber: String,
    val status: StatusEnum,
    val role: RoleEnum,
    val gender:GenderEnum,
    val createdBy: Long,
    val roleNumber:Int? = null,
    val sem: Int? = null
)


fun UserInputDto.toEntity(password:String?,roleId:Int): UsersEntity =
    UsersEntity(
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        dob = this.dob?.let {
            LocalDate.parse(it, DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        },
        phoneNumber = this.phoneNumber,
        status = this.status,
        passwordHash = password,
        role = this.role,
        gender = this.gender,
        roleNumber = roleId,
        sem = this.sem
    ).apply {
        this.createdBy = creatorId
//        this.createdAt = LocalDateTime.now() // already in PrePersist
    }

fun UsersEntity.toUserDto() : UserDto = UserDto(
    id = this.id,
    firstName = this.firstName,
    lastName = this.lastName,
    email = this.email,
    dob = this.dob.toString(),
    phoneNumber = this.phoneNumber,
    status = this.status,
    role = this.role,
    gender = this.gender,
    creatorId = this.createdBy,
    roleId = this.roleNumber,
    sem = this.sem
)

fun UserDtoTemp.toUserDto(): UserDto = UserDto (
        id = this.id,
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        dob = this.dob.toString(),
        phoneNumber = this.phoneNumber,
        status = this.status,
        role = this.role,
        gender = this.gender,
        creatorId = this.createdBy,
        roleId = this.roleNumber,
        sem = this.sem
)
