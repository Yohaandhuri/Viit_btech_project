import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      firstName
      lastName
      email
      roleId
      dob
      phoneNumber
      status
      role
      sem
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      firstName
      lastName
      email
      roleId
      dob
      phoneNumber
      status
      role
      sem
      gender
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    getAllCourses {
      id
      title
      duration
      credits
      facultyId
      sem
      year
    }
  }
`;

export const GET_ALL_COURSES_BY_SEM = gql`
  query GetAllCoursesBySem($sem: Int!) {
    getAllCoursesBySem(sem: $sem) {
      id
      title
      duration
      credits
      year
      sem
      facultyId
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($id: UUID!) {
    getCourseById(id: $id) {
      id
      title
      duration
      credits
      facultyId
      sem
      year
    }
  }
`;

export const GET_USERS_SPECIFIC = gql`
  query GetUsersSpecific($role: RoleEnum!) {
    getUsersSpecific(role: $role) {
      id
      firstName
      lastName
      email
      roleId
      dob
      phoneNumber
      status
      role
      gender
      creatorId
      sem
    }
  }
`;

export const GET_USER_COURSES = gql`
  query GetUserCourses($userId: ID) {
    getUserCourses(userId: $userId) {
      id
      title
      duration
      credits
      facultyId
      sem
      year
    }
  }
`;

export const LOGIN_USER = gql`
  query LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput)
  }
`;


export const GET_FACULTY_COURSES = gql`
  query GetFacultyCourses($facultyId: ID!) {
    getFacultyCourses(facultyId: $facultyId) {
      id
      title
      duration
      credits
      year
      sem
    }
  }
`;

export const GET_COURSE_STUDENTS = gql`
  query GetCourseStudents($courseId: ID!) {
    getCourseStudents(courseId: $courseId) {
      id
      firstName
      lastName
      email
      roleId
      dob
      phoneNumber
      status
      role
      gender
      creatorId
      sem
    }
  }
`;
