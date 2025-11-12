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
      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="PingUp"
            className="h-6 sm:h-8 w-auto object-contain"
          />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowSignIn(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-white hover:text-gray-300 font-medium transition-colors backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowSignUp(true)}
            className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center relative pt-16 sm:pt-20 px-4">
        {/* Background Images - Hidden on mobile, visible on larger screens */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {/* Top Left - Small portrait image */}
          <div className="absolute top-25 left-74 w-80 h-70 overflow-hidden">
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

        {/* Mobile Background Images Grid - Visible only on mobile */}
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div className="grid grid-cols-2 gap-2 h-full p-4 opacity-30">
            <div className="overflow-hidden rounded-lg">
              <img
                src={assets.left_top2}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src={assets.top_right}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src={assets.left_bottom}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src={assets.right_bottom}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
            SOCIAL MEDIA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              EXPERIENCE
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Connect, Share, Discover - Your Gateway to Global Community
          </p>
        </div>
      </main>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignIn(false)}
          />

          <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>

            <div className="mt-2">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                    formButtonPrimary: "text-sm sm:text-base",
                    formFieldInput: "text-sm sm:text-base",
                    footerActionLink: "text-sm",
                  },
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignUp(false)}
          />

          <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>

            <div className="mt-2">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                    formButtonPrimary: "text-sm sm:text-base",
                    formFieldInput: "text-sm sm:text-base",
                    footerActionLink: "text-sm",
                  },
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
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
