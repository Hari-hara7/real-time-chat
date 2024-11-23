import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { FaRegSmile, FaPaperclip, FaUserCircle } from "react-icons/fa";
import io from "socket.io-client";
import { motion } from "framer-motion";
import logo from "../assets/academicpal.jpg"; // Import the logo

const socket = io("http://localhost:4000");

interface Message {
  user: string;
  text: string;
  timestamp: string;
  avatar: string;
  isBot: boolean;
  file?: string;
}

const Chat = ({ user }: { user: any }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data() as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  // Send message to Firestore and emit to Socket.io
  const sendMessage = async () => {
    if (message.trim() || file) {
      const messageData = {
        user: user.displayName,
        text: message,
        avatar: user.photoURL || FaUserCircle, // Default avatar
        timestamp: new Date().toISOString(),
        isBot: false,
        file: file ? await uploadFile(file) : null,
      };

      // Add message to Firestore
      await addDoc(collection(db, "messages"), messageData);

      // Emit message to Socket.io for real-time updates
      socket.emit("send_message", messageData);

      setMessage(""); // Reset message input
      setFile(null); // Reset file input
    }
  };

  // Handle file upload
  const uploadFile = async (file: File) => {
    const fileUrl = "https://path.to.uploaded/file";
    return fileUrl;
  };

  // Handle chat bot reply (simulating response)
  const sendBotReply = (message: string) => {
    setIsBotTyping(true);
    setTimeout(() => {
      const botMessage = {
        user: "Academic Pal Bot",
        text: `You asked about: "${message}" - Here is the information...`,
        avatar: "https://path.to/bot/avatar",
        timestamp: new Date().toISOString(),
        isBot: true,
      };
      addDoc(collection(db, "messages"), botMessage);
      socket.emit("send_message", botMessage);
      setIsBotTyping(false);
    }, 1500);
  };

  // Handle message submission and bot detection
  const handleSubmit = () => {
    sendMessage();
    if (message.toLowerCase().includes("syllabus") || message.toLowerCase().includes("notes")) {
      sendBotReply(message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      {/* Header with Logo and Glassmorphism */}
      <div className="flex items-center p-4 bg-opacity-60 backdrop-blur-md rounded-xl shadow-lg">
        <img src={logo} alt="Academic Pal Logo" className="w-16 h-16 mr-4 rounded-full shadow-lg" />
        <h1 className="text-2xl font-semibold">Academic Pal Chat</h1>
      </div>

      {/* Messages Section with Animations */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-xl shadow-lg ${
              msg.isBot ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={msg.avatar} alt="avatar" className="w-12 h-12 rounded-full ring-4 ring-indigo-500 shadow-lg" />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">{msg.user}</div>
              <div>{msg.text}</div>
              {msg.file && (
                <a href={msg.file} className="text-blue-300 hover:underline">
                  View File
                </a>
              )}
            </div>
          </motion.div>
        ))}
        {isBotTyping && (
          <div className="flex items-start space-x-3 p-2 rounded-lg bg-gray-700 animate-pulse">
            <img src="https://path.to/bot/avatar" alt="bot" className="w-12 h-12 rounded-full ring-4 ring-blue-300" />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">Academic Pal Bot</div>
              <div>Typing...</div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area with Sleek Design */}
      <div className="flex items-center p-4 bg-opacity-60 backdrop-blur-md border-t border-gray-700 rounded-xl shadow-lg">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="border-none rounded-2xl p-4 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask me anything..."
          />
          <div className="absolute right-4 top-2 flex items-center space-x-2">
            <FaRegSmile className="cursor-pointer text-gray-300 hover:text-indigo-500" />
            <FaPaperclip
              className="cursor-pointer text-gray-300 hover:text-indigo-500"
              onClick={() => document.getElementById("fileInput")?.click()}
            />
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="ml-4 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-200 ease-in-out"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
