import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($userInput: UserInput) {
    registerUser(userInput: $userInput)
  }
`;

export const SAVE_COURSE = gql`
  mutation SaveCourse($course: CourseInput!) {
    saveCourse(course: $course)
  }
`;

export const ASSIGN_FACULTY_TO_COURSE = gql`
  mutation AssignFacultyToCourse($courseId: ID!, $facultyId: ID!) {
    assignFacultyToCourse(courseId: $courseId, facultyId: $facultyId)
  }
`;

export const ENROLL_STUDENTS_TO_COURSE = gql`
  mutation EnrollStudentToCourse($courseId: ID!, $studentIds: ID!) {
    enrollStudentToCourse(courseId: $courseId, studentIds: $studentIds)
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($editUserInput: EditUserInput!) {
    editUser(editUserInput: $editUserInput)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($resetPasswordInputDto: ResetPasswordInputDto!) {
    resetPassword(resetPasswordInputDto: $resetPasswordInputDto)
  }
`;