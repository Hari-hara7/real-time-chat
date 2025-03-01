import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { FaRegSmile, FaPaperclip, FaUserCircle } from "react-icons/fa";
import io from "socket.io-client";
import { motion } from "framer-motion";
import logo from "../assets/academicpal.jpg"; 

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

  const sendMessage = async () => {
    if (message.trim() || file) {
      const messageData = {
        user: user.displayName,
        text: message,
        avatar: user.photoURL || FaUserCircle,
        timestamp: new Date().toISOString(),
        isBot: false,
        file: file ? await uploadFile(file) : null,
      };

      await addDoc(collection(db, "messages"), messageData);
      socket.emit("send_message", messageData);

      setMessage("");
      setFile(null);
    }
  };

  const uploadFile = async (file: File) => {
    const fileUrl = "https://path.to.uploaded/file";
    return fileUrl;
  };

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

  const handleSubmit = () => {
    sendMessage();
    if (message.toLowerCase().includes("syllabus") || message.toLowerCase().includes("notes")) {
      sendBotReply(message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      
      <div className="flex items-center p-4 border-b border-gray-700">
        <img src={logo} alt="Academic Pal Logo" className="w-16 h-16 mr-4 rounded-full" />
        <h1 className="text-2xl font-semibold">Academic Pal Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.user === user.displayName ? "bg-blue-600 ml-auto text-right" : "bg-gray-900 mr-auto text-left"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="flex flex-col">
                <div className="text-sm font-semibold">{msg.user} <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span></div>
                <div>{msg.text}</div>
                {msg.file && (
                  <a href={msg.file} className="text-blue-300 hover:underline">
                    View File
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isBotTyping && (
          <div className="p-3 rounded-lg bg-gray-800 max-w-xs mr-auto text-left animate-pulse">
            <div className="flex items-start space-x-3">
              <img
                src="https://path.to/bot/avatar"
                alt="bot"
                className="w-12 h-12 rounded-full border-2 border-blue-300"
              />
              <div className="flex flex-col">
                <div className="text-sm font-semibold">Academic Pal Bot</div>
                <div>Typing...</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center p-4 border-t border-gray-700">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="border-none rounded-lg p-4 w-full bg-gray-800 text-white focus:outline-none"
            placeholder="Type your message..."
          />
          <div className="absolute right-4 top-2 flex items-center space-x-2">
            <FaRegSmile className="cursor-pointer text-gray-300 hover:text-blue-500" />
            <FaPaperclip
              className="cursor-pointer text-gray-300 hover:text-blue-500"
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
          className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;