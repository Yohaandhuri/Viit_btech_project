import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { GET_USER } from "./Graphql/Queries";
import { useQuery } from "@apollo/client";
import "./Score.css"; // Make sure this import matches your file structure
import FacultyNavbar from "./Faculty/FacultyNavbar";

function Score() {
    const navigate = useNavigate();
    const location = useLocation();
    const [results, setResults] = useState([]);
    const { quizId, userId } = useParams();
    console.log("Quiz ID:", quizId);
    console.log("User ID:", userId);
    const { data: userData } = useQuery(GET_USER, {
        variables: { id: userId }, // Hardcoded userId for now
      });


    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/quiz/results/${quizId}`);
                const data = await response.json();
                console.log("Quiz Results:", data);
                setResults(data);
            } catch (error) {
                console.error("Error fetching quiz results:", error);
            }
        };

        fetchResults();
    }, [quizId]);

    return (
        <div className="score-page">
            {userData && <FacultyNavbar firstName={userData.getUser.firstName} lastName={userData.getUser.lastName} id={userId}/>}
            <h2 className="score-title">📘 Quiz Results</h2>
            {results.length === 0 ? (
                <p className="loading-text">Loading results...</p>
            ) : (
                <div className="table-container">
                    <table className="score-table">
                        <thead>
                            <tr>
                                <th>👤 Name</th>
                                <th>📝 Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.name}</td>
                                    <td>{result.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Score;
