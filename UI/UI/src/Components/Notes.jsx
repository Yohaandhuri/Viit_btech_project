import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "./Graphql/Queries";
import "./Notes.css";

function Notes({course, userId}) {
    const [showModal, setShowModal] = useState(false);
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      const { data: userData } = useQuery(GET_USER, {
        variables: { id: userId }, // Hardcoded userId for now
      });
    console.log(userData);

    const classroomId = course.id;

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/notes/${classroomId}`
            );
            if (!response.ok) throw new Error("Failed to fetch announcements");
            const data = await response.json();
            setNotes(data);
            console.log("Course: ");
            console.log(course);

            console.log("Notes: " + data);

        } catch (error) {
            setError("Error fetching notes");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (attachment) => {
        const downloadUrl = `http://localhost:3000/api/download/${attachment}`;
        fetch(downloadUrl)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to download file.");
                return res.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = attachment;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch((err) => console.error("❌ Download error:", err));
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("description", description);
        formData.append("classroom_id", classroomId);
        if (file) formData.append("file", file);

        const endpoint = editingId
            ? `http://localhost:3000/api/notes/update/${editingId}`
            : "http://localhost:3000/api/notes/add";

        try {
            const response = await fetch(endpoint, {
                method: "POST", // Use POST for both add and update
                body: formData,
            });

            if (response.ok) {
                alert(
                    editingId ? "✅ Notes updated!" : "✅ Notes added!"
                );
                resetForm();
                fetchNotes();
            } else {
                alert("❌ Failed to submit notes");
            }
        } catch (error) {
            alert("❌ Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/notes/delete/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                alert("✅ Notes deleted");
                fetchAnnouncements();
            } else {
                alert("❌ Failed to delete");
            }
        } catch (err) {
            alert("❌ Server error");
        }
    };

    const handleEdit = (notes) => {
        setSubject(notes.subject);
        setDescription(notes.description);
        setEditingId(notes.id);
        setFile(null);
        setShowModal(true);
    };

    const resetForm = () => {
        setSubject("");
        setDescription("");
        setFile(null);
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div className="notes-container">
            <div className="note-header">
                <h2>Notes Section</h2>
            </div>
            <div className="add-note-button">
                {userData && userData.getUser.role == "TEACHER" && <button className="add-btn" onClick={() => setShowModal(true)}>
                    + Add Notes
                </button>}
            </div>

            {loading && <p>Loading notes...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && notes.length === 0 && (
                <p>No notes available.</p>
            )}

            <ul className="note-list">
                {notes.map((note) => (
                    <li key={note.id} className="note-item">
                        <h3>{note.subject}</h3>
                        <p>{note.description}</p>
                        <div className="note-actions">
                            {note.attachment && (
                                <button
                                    className="download-btn"
                                    onClick={() => handleDownload(note.attachment)}
                                >
                                    <span className="icon">📥</span>Download
                                </button>
                            )}
                            {userData && userData.getUser.role == "TEACHER" && <button
                                className="edit-btn"
                                onClick={() => handleEdit(note)}
                            >
                                ✏️ Edit
                            </button>}
                            {userData && userData.getUser.role == "TEACHER" && <button
                                className="delete-btn"
                                onClick={() => handleDelete(note.id)}
                            >
                                🗑️ Delete
                            </button>}
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingId ? "Edit Notes" : "Add Notes"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Subject:
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Attach File:
                                <input type="file" onChange={handleFileChange} />
                            </label>
                            <div className="modal-buttons">
                                <button className="submit-btn" type="submit">
                                    {editingId ? "Update" : "Submit"}
                                </button>
                                <button
                                    className="cancel-btn"
                                    type="button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notes;
