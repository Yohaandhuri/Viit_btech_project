import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './Components/Admin/AdminDashboard';
import FacultyDashboard from './Components/Faculty/FacultyDashboard';
import StudentDashboard from './Components/Student/StudentDashboard';
import StudentCoursePage from "./Components/Student/StudentCoursePage";
import FacultyCoursePage from "./Components/Faculty/FacultyCoursePage";
import AdminStudent from './Components/Admin/AdminStudent';
import AdminFaculty from './Components/Admin/AdminFaculty';
import CoursePage from "./Components/Course/CoursePage";
import Login from './Components/Login';
import Home from './Components/Home';
import Questions from "./Components/Questions";
import Score from "./Components/Score";
import Notes from "./Components/Notes";
import QueryBox from "./Components/QueryBox";

// Optional GraphQL error handler
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      alert(`GraphQL Error: ${message}`);
    });
  }
  if (networkError) {
    alert(`Network Error: ${networkError.message}`);
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:8080/graphql" }), // Change this to your Spring Boot endpoint
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login role="Admin" />} />
          <Route path="/admin/dashboard/:userId" element={<AdminDashboard />} />
          <Route path="/admin/:id/students" element={<AdminStudent />} />
          <Route path="/admin/:id/faculty" element={<AdminFaculty />} />
          <Route path="/admin/:id/courses" element={<CoursePage />} />


          {/* Faculty Routes */}
          <Route path="/faculty/login" element={<Login role="Faculty" />} />
          <Route path="/faculty/dashboard/:userId" element={<FacultyDashboard />} />
          <Route path="/faculty/:facultyId/course/:courseId" element={<FacultyCoursePage/>} />
          <Route path="/faculty/:userId/quiz/:quizId" element={<Questions />} />

          {/* Student Routes */}
          <Route path="/student/login" element={<Login role="Student" />} />
          <Route path="/student/dashboard/:userId" element={<StudentDashboard />} />
          <Route path="/student/:studentId/course/:courseId" element={<StudentCoursePage />} />
          <Route path="/student/:userId/quiz/:quizId" element={<Questions />} />

          <Route path="/faculty/:userId/quiz/:quizId/score" element={<Score />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
