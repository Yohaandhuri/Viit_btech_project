import React, { useState, useEffect } from "react";
import "./Questions.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER } from "./Graphql/Queries";
import FacultyNavbar from "./Faculty/FacultyNavbar";

function Questions() {
    const [showModal, setShowModal] = useState(false);
    const [fetchedQuestions, setFetchedQuestions] = useState([]);
    const [quizName, setQuizName] = useState("");
    const [quizTime, setQuizTime] = useState({ start: null, end: null });
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null); // in seconds
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId, userId } = useParams();
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState({});

    const [newQuestions, setNewQuestions] = useState([
        {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            quiz_id: quizId
        }
    ]);

    function formatDateTimeInIST(utcDateTimeStr) {
        const utcDate = new Date(utcDateTimeStr);
        return utcDate.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
            hour12: true,
        });
    }

    const { data: userData } = useQuery(GET_USER, {
        variables: { id: userId },
    });

    const now = new Date();
    const isQuizOpen = quizTime.start && quizTime.end
        ? now >= new Date(quizTime.start) && now <= new Date(quizTime.end)
        : false;

    const isQuizNotStarted = quizTime.start && now < new Date(quizTime.start);
    const isQuizEnded = quizTime.end && now > new Date(quizTime.end);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/quiz/questions/${quizId}`);
            if (!res.ok) throw new Error("Failed to fetch questions");

            const data = await res.json();
            console.log("Fetched Questions:", data); // Log the response to see if questions are fetched

            const transformed = data.map(q => ({
                ...q,
                options: [q.option1, q.option2, q.option3, q.option4]
            }));

            setFetchedQuestions(transformed); // Update state with transformed questions
            console.log("Updated Fetched Questions:", transformed); // Log the updated state
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const fetchQuizData = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/quiz/name/${quizId}`);
            if (!res.ok) throw new Error("Failed to fetch quiz data");

            const data = await res.json();
            setQuizName(data.name);
            setQuizTime({
                start: data.start_time,
                end: data.end_time
            });

            if (data.timer) {
                setTimeLeft(data.timer);
            }


        } catch (err) {
            console.error("Error fetching quiz data:", err);
            setQuizName("Error fetching name");
        }
    };

    useEffect(() => {
        const checkAnswers = async () => {
            const results = {};

            await Promise.all(
                fetchedQuestions.map(async (q) => {
                    try {
                        const response = await fetch(`http://localhost:3000/api/quiz/question/submission/${q.id}`);
                        const data = await response.json();
                        results[q.id] = data.length > 0;
                    } catch (err) {
                        console.error("Failed to fetch student answers", err);
                        results[q.id] = false; // fallback
                    }
                })
            );

            setQuestionsWithAnswers(results);
        };

        if (fetchedQuestions.length > 0) {
            checkAnswers();
        }
    }, [fetchedQuestions]);


    useEffect(() => {
        fetchQuizData();
        fetchQuestions();
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === null || !isQuizOpen || userData?.getUser.role !== "STUDENT") return;

        if (timeLeft === 0) {
            submitStudentAnswers();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isQuizOpen, userData]);


    const handleChange = (index, field, value) => {
        const updatedQuestions = [...newQuestions];
        if (field === "question") {
            updatedQuestions[index].question = value;
        } else if (field.startsWith("option")) {
            const optionIndex = parseInt(field.slice(-1), 10);
            updatedQuestions[index].options[optionIndex] = value;
        } else if (field === "correctAnswer") {
            updatedQuestions[index].correctAnswer = parseInt(value, 10);
        }
        setNewQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setNewQuestions([
            ...newQuestions,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                quiz_id: quizId
            }
        ]);
    };

    const handleSubmit = async () => {
        setShowModal(false);
        try {
            const response = await fetch('http://localhost:3000/api/quiz/add/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: newQuestions }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("Server Response:", data);

            setNewQuestions([]);

            // ✅ Immediately refresh the questions list
            await fetchQuestions();
        } catch (error) {
            console.error("Failed to submit questions:", error);
        }
    };


    const submitStudentAnswers = async () => {
        if (!isQuizOpen) {
            alert("Quiz is not available at this time.");
            return;
        }

        const answers = Object.entries(selectedAnswers).map(([question_id, selected_answer]) => ({
            student_id: userId,
            question_id: parseInt(question_id),
            selected_answer
        }));

        const fullName = `${userData.getUser.firstName} ${userData.getUser.lastName}`;

        try {
            const response = await fetch("http://localhost:3000/api/quiz/submission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers,
                    quizId,
                    name: fullName  // Include full name here
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            console.log("Submission successful:", result);
            alert("Answers submitted successfully!");
            navigate(`/student/dashboard/${userId}`);
        } catch (error) {
            console.error("Failed to submit answers:", error);
            alert("Failed to submit answers");
        }
    };


    const handleDeleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/quiz/questions/delete/${questionId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            console.log("Question deleted:", result);
            alert("Question deleted successfully!");
            setFetchedQuestions(fetchedQuestions.filter(q => q.id !== questionId));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    const calculateScoresAndRoute = async () => {
        navigate(`/faculty/${userId}/quiz/${quizId}/score/`);
    };

    return (
        <div>
            {userData && userData.getUser.role === "TEACHER" && (
                <FacultyNavbar firstName={userData.getUser.firstName} lastName={userData.getUser.lastName} id={userId} />
            )}
            <h2>Quiz Questions for {quizName}</h2>

            {/* Display appropriate message if quiz hasn't started, only for STUDENT */}
            {userData && userData.getUser.role === "STUDENT" && isQuizNotStarted && (
                <p className="quiz-not-started-msg">⏳ Quiz has not started yet. It will begin at {formatDateTimeInIST(quizTime.start)}</p>
            )}

            {/* Display message if the quiz is ended */}
            {isQuizEnded && userData && userData.getUser.role === "STUDENT" && (
                <p className="quiz-ended-msg">❌ The quiz has ended. You can no longer submit answers.</p>
            )}

            {/* Teachers can always add questions */}
            {userData && userData.getUser.role === "TEACHER" && (
                <button className="open-modal-btn" onClick={() => setShowModal(true)}>
                    Add Questions
                </button>
            )}

            {/* Display Time Restriction Message for STUDENT */}
            {userData && userData.getUser.role === "STUDENT" && !isQuizOpen && !isQuizNotStarted && (
                <p className="quiz-locked-msg">🚫 Quiz is not available at this time.</p>
            )}

            {isQuizOpen && userData?.getUser.role === "STUDENT" && timeLeft !== null && (
                <div className="quiz-timer">
                    ⏱️ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </div>
            )}


            {/* Display Questions if the quiz is open */}
            {(userData && (userData.getUser.role === "TEACHER" || isQuizOpen)) && (
                <div className="fetched-questions">
                    {fetchedQuestions.map((q, index) => (
                        <div key={q.id} className="question-block">
                            <p><strong>{index + 1}. {q.question}</strong></p>
                            {q.options.map((opt, i) => (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={i + 1}
                                        checked={selectedAnswers[q.id] === i + 1}
                                        onChange={() =>
                                            setSelectedAnswers(prev => ({
                                                ...prev,
                                                [q.id]: i + 1
                                            }))
                                        }
                                    />
                                    {opt}
                                </label>
                            ))}
                            {userData && userData.getUser.role == "TEACHER" && <p><strong>Correct Option: {q.correct_answer}</strong></p>}
                            {userData && userData.getUser.role === "TEACHER" && (
                                !questionsWithAnswers[q.id] && (
                                    <button className="delete-btn" onClick={() => handleDeleteQuestion(q.id)}>
                                        Delete
                                    </button>
                                )
                            )}

                        </div>
                    ))}
                </div>
            )}

            <div className="quiz-buttons">
                {fetchedQuestions.length > 0 && userData && userData.getUser.role === "STUDENT" && isQuizOpen && (
                    <button className="submit-my-answers" onClick={submitStudentAnswers}>
                        Submit My Answers
                    </button>
                )}

                {fetchedQuestions.length > 0 && userData && userData.getUser.role === "TEACHER" && isQuizOpen && (
                    <button className="view-score-button" onClick={calculateScoresAndRoute}>View Scores</button>
                )}
            </div>

            {showModal && (
                <div className="modal">
                    <h2>Add Quiz Questions</h2>
                    {newQuestions.map((q, index) => (
                        <div key={index} className="question-block">
                            <input
                                type="text"
                                placeholder="Enter question"
                                value={q.question}
                                onChange={(e) => handleChange(index, "question", e.target.value)}
                            />
                            {q.options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleChange(index, `option${i}`, e.target.value)}
                                />
                            ))}
                            <select
                                value={q.correctAnswer}
                                onChange={(e) => handleChange(index, "correctAnswer", e.target.value)}
                            >
                                <option value={0}>Select correct option</option>
                                <option value={1}>Option 1</option>
                                <option value={2}>Option 2</option>
                                <option value={3}>Option 3</option>
                                <option value={4}>Option 4</option>
                            </select>
                        </div>
                    ))}
                    <button onClick={addQuestion}>+ Add Another Question</button>
                    <button onClick={handleSubmit}>Submit Questions</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Questions;
