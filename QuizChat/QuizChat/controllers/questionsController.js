const db = require("../database/connection");

const addQuestions = async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: "Invalid or empty questions array" });
    }

    const insertPromises = questions.map((q, index) => {
        const query = `
            INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            parseInt(q.quiz_id, 10),
            q.question,
            q.options[0],
            q.options[1],
            q.options[2],
            q.options[3],
            parseInt(q.correctAnswer, 10)
        ];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error(`Error inserting question ${index + 1}:`, err);
                    return reject(err);
                }
                console.log(`✅ Question ${index + 1} inserted`, result);
                resolve(result);
            });
        });
    });

    try {
        await Promise.all(insertPromises);
        console.log("All questions inserted successfully");
        res.status(200).json({ message: "All questions inserted successfully" });
    } catch (error) {
        console.error("Database insert error:", error);
        res.status(500).json({ message: "Failed to insert questions", error });
    }
};

const getQuestions = async (req, res) => {
    const quiz_id = +req.params.quiz_id;

    try {
        const [result] = await db.execute(
            "SELECT id, question, option1, option2, option3, option4 FROM questions WHERE quiz_id = ?", [quiz_id]);

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
}

const deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        const result = await db.execute("DELETE FROM questions WHERE id = ?", [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting question:", error);
        res.status(500).json({ error: "Failed to delete question" });
    }
}

module.exports = { addQuestions, getQuestions, deleteQuestion };
