const db = require('../database/connection');

const calculateAndStoreScores = async (req, res) => {
  try {
    const { quiz_id } = req.body;
    if (!quiz_id) {
      return res.status(400).json({ error: 'Quiz ID is required.' });
    }
    const query = `
      INSERT INTO quiz_results (student_id, quiz_id, score)
      SELECT
        sa.student_id,
        q.quiz_id,
        COUNT(*) AS score
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      WHERE sa.selected_answer = q.correct_answer
        AND q.quiz_id = ?
      GROUP BY sa.student_id, q.quiz_id
      ON DUPLICATE KEY UPDATE score = VALUES(score);
    `;

    await db.execute(query, [quiz_id]);

    res.status(200).json({ message: 'Scores calculated and stored successfully.' });
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getQuizResults = async (req, res) => {
    const { quiz_id } = req.params;
    
    try {
        const query = `
            SELECT * FROM quiz_results WHERE quiz_id = ?;
        `;
    
        const [results] = await db.execute(query, [quiz_id]);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { calculateAndStoreScores, getQuizResults };