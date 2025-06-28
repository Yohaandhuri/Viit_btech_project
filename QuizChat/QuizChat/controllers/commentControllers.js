const db = require("../database/connection");

// saves comment to database
const saveComment = async (classroom_id, sender, comment) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO classroom_comments (classroom_id, sender, comment) VALUES (?, ?, ?)",
      [classroom_id, sender, comment]
    );

    const insertedId = result.insertId;

    const [rows] = await db.query(
      "SELECT * FROM classroom_comments WHERE id = ?",
      [insertedId]
    );

    return rows[0]; // Return the full comment including id, sender, comment, time, etc.
  } catch (error) {
    console.error("❌ Error saving comment:", error);
    throw new Error("Failed to save comment");
  }
};

// retrieves comments from database based on classroom_id
const getComments = async (classroomId) => {
  if (!classroomId) {
    throw new Error("classroom_id is required");
  }

  try {
    console.log("Fetching comments for classroom_id:", classroomId);
    const [comments] = await db.query(
      "SELECT * FROM classroom_comments WHERE classroom_id = ? ORDER BY time DESC",
      [classroomId]
    );
    return comments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to fetch comments");
  }
};

const deleteComment = async (commentId) => {
  try {
    await db.query("DELETE FROM classroom_comments WHERE id = ?", [commentId]);
    console.log(`Comment ${commentId} deleted`);
  } catch (err) {
    console.error("Error deleting comment", err);
    throw err;
  }
};

module.exports = { saveComment, getComments, deleteComment };
