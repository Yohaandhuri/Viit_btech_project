const db = require("../database/connection");
const multer = require("multer");
const path = require("path");

// Set up multer storage for file uploads
const UPLOADS_DIR = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File upload middleware
const upload = multer({ storage });

const addAnnouncements = async (req, res) => {
  const { subject, description, classroom_id } = req.body;
  const attachment = req.file ? req.file.filename : null; // If no file, set to NULL

  try {
    await db.execute(
      "INSERT INTO announcements (subject, description, attachment, classroom_id) VALUES (?, ?, ?, ?)",
      [subject, description, attachment, classroom_id]
    );
    console.log("Announcement added successfully");
    return res.status(201).json({ message: "Announcement added successfully" });
  } catch (error) {
    console.error("Error adding announcement: ", error);
    return res.status(500).json({ error: "Error adding announcement" });
  }
};

const getAnnouncements = async (req, res) => {
  const { classroom_id } = req.params;

  try {
    const [announcements] = await db.execute(
      "SELECT * FROM announcements WHERE classroom_id = ?",
      [classroom_id]
    );
    console.log("Announcements fetched successfully");
    return res.status(201).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements: ", error);
    return res.status(500).json({ error: "Error fetching announcement" });
  }
};

const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { subject, description, classroom_id } = req.body;
  const attachment = req.file ? req.file.filename : null;

  try {
    if (attachment) {
      // If a new file is uploaded, update the attachment too
      await db.execute(
        "UPDATE announcements SET subject = ?, description = ?, attachment = ?, classroom_id = ? WHERE id = ?",
        [subject, description, attachment, classroom_id, id]
      );
    } else {
      // No new file uploaded, preserve the existing attachment
      await db.execute(
        "UPDATE announcements SET subject = ?, description = ?, classroom_id = ? WHERE id = ?",
        [subject, description, classroom_id, id]
      );
    }

    console.log(`📢 Announcement with ID ${id} updated successfully`);
    return res
      .status(200)
      .json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("❌ Error updating announcement: ", error);
    return res.status(500).json({ error: "Error updating announcement" });
  }
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM announcements WHERE id = ?", [id]);
    console.log(`Announcement with ID ${id} deleted successfully`);
    return res
      .status(200)
      .json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement: ", error);
    return res.status(500).json({ error: "Error deleting announcement" });
  }
};

module.exports = {
  addAnnouncements,
  upload,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
};
