package com.eclassroom.management_service.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "courses")
data class CourseEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Long = 0L,

    @Column
    val title: String,

    @Column
    val duration: String, // in hours

    @Column
    val credicts: String,

    @Column
    val year: String,

    @Column
    val sem:Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id") // foreign key in courses table
    var faculty: UsersEntity? = null,

    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    val students: MutableSet<UsersEntity> = mutableSetOf()
)