import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FaGoogle, FaCommentAlt, FaQuestionCircle } from "react-icons/fa";
import { MdSchool, MdContactSupport } from "react-icons/md";
import { SiAcademia } from "react-icons/si";

import logo from "../assets/academicpal.jpg";

const Auth = ({ setUser }: { setUser: (user: any) => void }) => {
  const [text, setText] = useState(""); // Initial state
  const welcomeMessage = "Welcome to Academic Pal! Your Ultimate Academic Companion";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setText(""); // Ensure the text state is cleared before starting
    const intervalId = setInterval(() => {
      if (index < welcomeMessage.length) {
        setText((prev) => prev + welcomeMessage[index]); // Add one character at a time
        index++;
      } else {
        clearInterval(intervalId); // Stop interval when done
      }
    }, 100);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Google Sign-In
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set authenticated user
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 bg-transparent shadow-md">
        {/* Logo */}
        <img
          src={logo}
          alt="Academic Pal Logo"
          className="w-24 h-auto md:w-36 rounded-full shadow-lg" // Smaller logo for mobile
        />

        {/* Sign-In Button */}
        <button
          onClick={signIn}
          className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-transform transform hover:scale-105"
        >
          <FaGoogle className="mr-2 md:mr-3" />
          Sign in with Google
        </button>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-center justify-center text-center px-4 md:px-6">
        <div className="max-w-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 animate-text">
              {text}
            </span>
          </h1>
          <p className="text-sm md:text-lg mb-6 md:mb-8">
            Connect, collaborate, and access valuable academic resources effortlessly.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="flex items-center justify-center bg-green-500 px-4 py-2 md:px-5 md:py-3 text-white text-sm md:text-base rounded-lg hover:bg-green-600 shadow-md transition-transform transform hover:scale-105">
              <FaCommentAlt className="mr-2" />
              Start Chat
            </button>
            <button className="flex items-center justify-center bg-blue-500 px-4 py-2 md:px-5 md:py-3 text-white text-sm md:text-base rounded-lg hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105">
              <FaQuestionCircle className="mr-2" />
              Ask a Question
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://hariharanath.is-cod.in/" className="text-yellow-500 hover:text-yellow-600">
            <MdSchool className="text-xl md:text-2xl" />
          </a>
          <a href="" className="text-blue-500 hover:text-blue-600">
            <SiAcademia className="text-xl md:text-2xl" />
          </a>
          <a
            href="https://hariharanath.is-cod.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-600"
          >
            <MdContactSupport className="text-xl md:text-2xl" />
          </a>
        </div>
        <p className="text-sm md:text-base mb-2">
          Designed and Developed by{" "}
          <a
            href="https://hariharanath.is-cod.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            Hari
          </a>
        </p>
        <p className="text-xs md:text-sm">© 2024 Academic Pal | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Auth;
