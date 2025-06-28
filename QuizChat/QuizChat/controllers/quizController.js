const db = require("../database/connection");

const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d)) throw new RangeError("Invalid time value");
    return d.toISOString().slice(0, 19).replace('T', ' ');
};


const addQuiz = async (req, res) => {
    const { name, description, course_id, start_time, end_time } = req.body;

    try {
        const formattedStart = formatDateTime(start_time);
        const formattedEnd = formatDateTime(end_time);

        const [result] = await db.execute(
            "INSERT INTO quizzes (name, description, course_id, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
            [name, description, course_id, formattedStart, formattedEnd]
        );

        res.status(201).json({ message: "✅ Quiz added successfully", quiz_id: result.insertId });
        return result;
    } catch (error) {
        console.error("❌ Error saving quiz:", error);
        res.status(500).json({ error: "Failed to save quiz" });
    }
};

const getQuizzes = async (req, res) => {
    const course_id = +req.params.course_id;

    try {
        const [result] = await db.execute(
            "SELECT * FROM quizzes WHERE course_id = ?", [course_id]);

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error fetching quizzes:", error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
}

const deleteQuiz = async (req, res) => {
    const quiz_id = req.params.id;
    console.log("Quiz ID:", quiz_id);

    if (!quiz_id) {
        return res.status(400).json({ error: "Missing quiz ID in request URL." });
    }

    try {
        const [result] = await db.execute(
            "DELETE FROM quizzes WHERE id = ?", [quiz_id]
        );

        return res.status(200).json({ message: "✅ Quiz deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting quiz:", error);
        return res.status(500).json({ error: "Failed to delete quiz" });
    }
};

const editQuiz = async (req, res) => {
    const quiz_id = req.params.id;
    console.log("Quiz ID:", quiz_id);
    
    let {name, description, course_id, start_time, end_time} = req.body;
    start_time = formatDateTime(start_time);
    end_time = formatDateTime(end_time);

    try {
        const [result] = await db.execute(
            "UPDATE quizzes SET name = ?, description = ?, start_time = ?, end_time = ? WHERE id = ?",
            [name, description, start_time, end_time, quiz_id]
        );

        if (result.affectedRows.length === 0) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        res.status(200).json({ message: "✅ Quiz updated successfully" });
    } catch (error) {
        console.error("❌ Error updating quiz:", error);
        res.status(500).json({ error: "Failed to update quiz" });
    }
}


module.exports = { addQuiz, getQuizzes, deleteQuiz, editQuiz };
