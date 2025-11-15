import React, { useState } from "react";
import { assets } from "../assets/assets";
import { X, Sparkles } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Login = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-indigo-900/50"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Header with Logo and Auth Buttons */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={assets.logo}
              alt="Vynce"
              className="h-7 sm:h-10 w-auto object-contain drop-shadow-2xl lg:h-10"
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setShowSignIn(true)}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-base text-white hover:text-gray-200 font-semibold transition-all backdrop-blur-md bg-white/10 rounded-lg sm:rounded-xl border border-white/20 hover:bg-white/15 active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-4 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center relative pt-20 sm:pt-24 px-4 pb-8">
        {/* Desktop Background Images - Lighter */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-100">
          <div className="absolute top-25 left-74 w-80 h-70 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_top2}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>

          <div className="absolute top-60 left-52 w-44 h-47 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_top1}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>

          <div className="absolute top-25 right-42 w-120 h-75 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.top_right}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>

          <div className="absolute bottom-17 left-28 w-120 h-75 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_bottom}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>

          <div className="absolute bottom-17 right-72 w-78 h-48 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.right_bottom}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>

          <div className="absolute bottom-38 right-56 w-43 h-50 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.right_bottom1}
              alt=""
              className="w-full h-full object-cover brightness-110"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
          </div>
        </div>

        {/* Optimized Mobile Background - Single Fullscreen Hero Image */}
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          {/* Top Hero Image - Extended for better visual */}
          <div className="absolute top-0 left-0 right-0 h-[60vh] min-h-[340px]">
            <div className="relative h-full w-full overflow-hidden">
              {assets.top_right && (
                <img
                  src={assets.top_right}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="eager"
                  style={{
                    filter: "contrast(1.15) saturate(1.25) brightness(1.05)",
                    opacity: "0.75",
                  }}
                />
              )}
              {/* Smoother gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black"></div>
            </div>
          </div>

          {/* Bottom Hero Image - Extended for better visual */}
          <div className="absolute bottom-0 left-0 right-0 h-[48vh] min-h-[340px]">
            <div className="relative h-full w-full overflow-hidden">
              {/* Gradient overlay first for proper layering */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/50 to-black z-10"></div>
              {assets.right_bottom && (
                <img
                  src={assets.right_bottom}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="lazy"
                  style={{
                    filter: "contrast(1.15) saturate(1.25) brightness(1.05)",
                    opacity: "0.75",
                  }}
                />
              )}
            </div>
          </div>

          {/* Enhanced center vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
            }}
          ></div>
        </div>

        {/* Central Content - Optimized spacing */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-3">
          {/* Badge - Better mobile sizing */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 mb-6 sm:mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-xs sm:text-xs md:text-sm font-medium text-white">
              Welcome to the Future of Social
            </span>
          </div>

          {/* Main Heading - Better mobile proportions */}
          <h1 className="text-[2.5rem] leading-[1.15] xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-5 sm:mb-4 md:mb-6 drop-shadow-2xl">
            <span className="block mb-1">SOCIAL MEDIA</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
              EXPERIENCE
            </span>
          </h1>

          {/* Description - Better readability */}
          <p className="text-base leading-relaxed xs:text-lg sm:text-base md:text-xl lg:text-2xl text-gray-100 mb-8 sm:mb-12 max-w-xl mx-auto px-2 font-light drop-shadow-xl">
            Connect, Share, Discover - Your Gateway to Global Community
          </p>
        </div>
      </main>

      {/* Sign In Modal - Enhanced */}
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

      {/* Sign Up Modal - Enhanced */}
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

      {/* Add custom animation styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-in {
          animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
