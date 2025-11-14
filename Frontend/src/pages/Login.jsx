import React, { useState } from "react";
import { assets } from "../assets/assets";
import { X, ArrowDown } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Login = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/45 via-black to-indigo-900/45"></div>

      {/* Header with Logo and Auth Buttons */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="PingUp"
            className="h-8 md:h-10 object-contain"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowSignIn(true)}
            className="px-4 py-2 text-white hover:text-gray-300 font-medium transition-colors backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowSignUp(true)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center relative pt-20">
        {/* Background Images positioned around the text */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left - Small portrait image */}
          <div className="absolute top-25 left-74 w-80 h-70 overflow-hidden ">
            <img
              src={assets.left_top2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Left Corner - Small square image */}
          <div className="absolute top-60 left-52 w-44 h-47 overflow-hidden">
            <img
              src={assets.left_top1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Right - Large cityscape image */}
          <div className="absolute top-25 right-42 w-120 h-75 overflow-hidden">
            <img
              src={assets.top_right}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Left - Architecture/house image */}
          <div className="absolute bottom-17 left-28 w-120 h-75 overflow-hidden">
            <img
              src={assets.left_bottom}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Right - Portrait image */}
          <div className="absolute bottom-17 right-72 w-78 h-48 overflow-hidden">
            <img
              src={assets.right_bottom}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Right Corner - Small square image */}
          <div className="absolute bottom-38 right-56 w-43 h-50 overflow-hidden">
            <img
              src={assets.right_bottom1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-none">
            SOCIAL MEDIA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              EXPERIENCE
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect, Share, Discover - Your Gateway to Global Community
          </p>
        </div>
      </main>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignIn(false)}
          />

          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mt-2">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                  },
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignUp(false)}
          />

          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mt-2">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                  },
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignUp(false);
                    setShowSignIn(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
