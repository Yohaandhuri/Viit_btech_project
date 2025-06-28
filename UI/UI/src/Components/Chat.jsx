import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";
import { useQuery } from "@apollo/client";
import { GET_USER } from "./Graphql/Queries"; // Assuming you have a query to get user info

 // Dynamically change based on user selection

function Chat({course, userId}) {
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const wsRef = useRef(null); // Holds WebSocket instance
  const chatMessagesRef = useRef(null); // For auto-scrolling
  const classroomId = course.id;
  const { data: userData } = useQuery(GET_USER, {
    variables: { id: userId }, // Hardcoded userId for now
  });
  console.log(userData);
  

  // 📌 Establish WebSocket Connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      socket.send(JSON.stringify({ type: "join", classroomId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Received message:", message);

      if (message.type === "pastComments") {
        setAllComments(message.data);
      } else if (message.type === "newComment") {
        setAllComments((prev) => {
          if (!prev.some((msg) => msg.id === message.data.id)) {
            return [message.data, ...prev];
          }
          return prev;
        });
      } else if (message.type === "deleteComment") {
        setAllComments(
          (prev) => prev.filter((msg) => msg.id !== message.id) // ✅ use `message.id`
        );
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    wsRef.current = socket;

    return () => socket.close();
  }, []);

  // 📌 Scroll to top when new comment is added
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = 0;
    }
  }, [allComments]);

  function handleChange(event) {
    setComment(event.target.value);
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " - " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  }

  function sendComment() {
    if (!comment.trim() || !wsRef.current) return;

    const newMessage = {
      type: "newComment",
      classroomId,
      sender: `${userData.getUser.firstName} ${userData.getUser.lastName}`, // Ideally dynamic, but fine for now
      comment,
    };

    wsRef.current.send(JSON.stringify(newMessage));
    setComment("");
  }

  function deleteComment(id) {
    if (!wsRef.current) return;

    setAllComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );

    wsRef.current.send(
      JSON.stringify({ type: "deleteComment", classroomId, id })
    );

    // Remove from UI immediately
    setAllComments((prev) => prev.filter((msg) => msg.id !== id));
  }

  return (
    <div className="chat-container">
      {/* ✅ Chat Messages (Scrollable) */}
      <div className="chat-messages" ref={chatMessagesRef}>
        {allComments.map((msg, index) => (
          <div key={msg.id || index} className="chat-message">
            <div className="chat-header">
              <strong>{msg.sender}</strong>
              <span className="chat-time">{formatDateTime(msg.time)}</span>
            </div>
            <div className="chat-text">{msg.comment}</div>
            {userData.getUser.role == "ADMIN" && <button
              className="delete-button"
              onClick={() => deleteComment(msg.id)}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>}
          </div>
        ))}
      </div>

      {/* ✅ Chat Input (Fixed at Bottom) */}
      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={comment}
            onChange={handleChange}
          />
          <button className="send-button" onClick={sendComment}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
