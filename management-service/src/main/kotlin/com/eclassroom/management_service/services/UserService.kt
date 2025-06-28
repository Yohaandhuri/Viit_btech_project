package com.eclassroom.management_service.services

import com.eclassroom.management_service.commonEnums.RoleEnum
import com.eclassroom.management_service.dto.*
import com.eclassroom.management_service.entities.CourseEntity
import com.eclassroom.management_service.entities.UsersEntity
import com.eclassroom.management_service.repositories.UserRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.apache.catalina.User
import org.hibernate.Hibernate
import org.springframework.stereotype.Service
import java.util.*
import kotlin.jvm.optionals.getOrElse
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.jvm.optionals.getOrNull

@Service
class UserService(
    private val userRepository: UserRepository
) {
    val passwordEncoder = Argon2PasswordEncoder(
        16,
        32,
        1,
        65536,
        3
    )

    interface Result{
        data class Success(val msg:String,var courses:List<CourseDto>?=null) : Result
        data class Error(val msg:String): Result
        data class NotFound(val msg:String): Result
        data class AlreadyExist(val msg:String): Result
        data class Unauthenticated(val msg:String): Result
    }

    interface LoginResult{
        data class Success(val user: UsersEntity): LoginResult
        data class NotFound(val msg:String): LoginResult
        data class Unauthenticated(val msg:String): LoginResult
    }


    fun getUserById(id: Long): UserDto{
        return userRepository.findById(id).getOrElse {
            throw EntityNotFoundException("User with id: ${id} does not exist")
        }.toUserDto()
    }

    fun resetPassword(resetPasswordInputDto:ResetPasswordInputDto):Result{
        val user = userRepository.findById(resetPasswordInputDto.userId).getOrNull() ?:
         return Result.NotFound("User with id: ${resetPasswordInputDto.userId} does not exist")
        val newPasswordHash: String? = resetPasswordInputDto.newPassword?.takeIf { it.isNotBlank() }
            ?.let { passwordEncoder.encode(it) }
        if(user.role!=RoleEnum.ADMIN && resetPasswordInputDto.role == RoleEnum.ADMIN && newPasswordHash!=null){
            userRepository.saveAndFlush(user.apply { this.passwordHash=newPasswordHash })
        }
        else{
            if (!passwordEncoder.matches(resetPasswordInputDto.oldPassword, user.passwordHash)) {
                return Result.Unauthenticated("Incorrect old password")
            }
            userRepository.saveAndFlush(user.apply { this.passwordHash = newPasswordHash })
        }
        return Result.Success("Password reset successful")
    }

    fun editUser(editUserInput: EditUserInputDto): Result{
        val user = userRepository.findById(editUserInput.id).getOrNull() ?:
            return Result.NotFound("User with id: ${editUserInput.id} does not exist")
        if (user.email!=editUserInput.email && userRepository.findByEmail(editUserInput.email)!=null)
            return Result.AlreadyExist("User with email:${editUserInput.email} already exists, use different email.")
        userRepository.save(user.apply {
            this.firstName = editUserInput.firstName
            this.lastName = editUserInput.lastName
            this.email = editUserInput.email
            this.dob = LocalDate.parse(editUserInput.dob, DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            this.phoneNumber = editUserInput.phoneNumber
            this.gender = editUserInput.gender
            this.updatedBy = editUserInput.updatedBy
        })
        return Result.Success("User information edited successfully")
    }


    fun getUsers():List<UsersEntity>{
        return userRepository.findAll()
    }

    @Transactional
    fun getUserCourses(userId:Long):Result{
        val user = userRepository.findById(userId).getOrNull()
        println("=====${user?.id}")
        if(user==null)
            return Result.NotFound("User with id:${userId} does not exist")
        val courses = userRepository.findCoursesByUserId(user.id)
        return Result.Success("Courses fetched successfully",courses.map { it.toDto() })
    }

    fun registerUser(userInput: UserInputDto):Result{
        try {
            if (userRepository.findByEmail(userInput.email)!=null)
                return Result.AlreadyExist("User with email:${userInput.email} already exists, use different email.")
            val passwordHash: String? = userInput.password?.takeIf { it.isNotBlank() }
                ?.let { passwordEncoder.encode(it) }
            userRepository.save(userInput.toEntity(passwordHash,generateUniqueRoleId()))
            return Result.Success("User registered successfully")
        } catch (e:Exception){
            return Result.Error("There was an error while registering the user: ${e.message} ${e.cause}")
        }
    }

    fun getUsersByRole(role: RoleEnum): List<UserDto> {
        return userRepository.findUserDtosByRole(role).map { it.toUserDto() } // create safe copy
    }

    private fun generateUniqueRoleId(): Int {
        var candidate: Int
        do {
            candidate = (10000..99999).random()
        } while (userRepository.existsByRoleNumber(candidate))
        return candidate
    }

    fun loginUser(email:String,password:String): LoginResult {
        val user = userRepository.findByEmail(email)
            ?: return LoginResult.NotFound(msg = "User with email:${email} does not exist")

        if (!passwordEncoder.matches(password, user.passwordHash)) {
            return LoginResult.Unauthenticated("Invalid credentials.")
        }

        return LoginResult.Success(user)
    }

}