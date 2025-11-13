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
              className="h-8 sm:h-10 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base text-white hover:text-gray-200 font-semibold transition-all backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center relative pt-20 sm:pt-24 px-4 pb-8">
        {/* Desktop Background Images */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-40">
          <div className="absolute top-25 left-74 w-80 h-70 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_top2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-60 left-52 w-44 h-47 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_top1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-25 right-42 w-120 h-75 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.top_right}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-17 left-28 w-120 h-75 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.left_bottom}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-17 right-72 w-78 h-48 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.right_bottom}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-38 right-56 w-43 h-50 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={assets.right_bottom1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Enhanced Mobile Background Images - Seamless Transitions */}
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          {/* Top Hero Section - Extended Height for Smooth Transition */}
          <div className="absolute top-0 left-0 right-0 h-[350px] sm:h-[420px]">
            <div className="relative h-full w-full">
              {assets.top_right && (
                <img
                  src={assets.top_right}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-90"
                  loading="eager"
                  style={{ filter: "contrast(1.1) saturate(1.2)" }}
                />
              )}
              {/* Extended Gradient for Seamless Blend */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/40 to-black"></div>
            </div>
          </div>

          {/* Bottom Hero Section - Extended Height for Smooth Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-[350px] sm:h-[420px]">
            <div className="relative h-full w-full">
              {/* Extended Gradient for Seamless Blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-black/40 to-black z-10"></div>
              {assets.right_bottom && (
                <img
                  src={assets.right_bottom}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-90"
                  loading="lazy"
                  style={{ filter: "contrast(1.1) saturate(1.2)" }}
                />
              )}
            </div>
          </div>

          {/* Seamless Center Overlay - Covers Any Gaps */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)",
            }}
          ></div>

          {/* Unified Dark Overlay - No Visible Lines */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 z-[6]"></div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge - Increased Size for Mobile */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 sm:mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-sm sm:text-xs md:text-sm font-medium text-gray-200">
              Welcome to the Future of Social
            </span>
          </div>

          {/* Main Heading - Increased Size for Mobile */}
          <h1 className="text-5xl xs:text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-4 md:mb-6 leading-tight drop-shadow-2xl">
            SOCIAL MEDIA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
              EXPERIENCE
            </span>
          </h1>

          {/* Description - Increased Size for Mobile */}
          <p className="text-lg xs:text-xl sm:text-base md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 font-light leading-relaxed drop-shadow-lg">
            Connect, Share, Discover - Your Gateway to Global Community
          </p>
        </div>
      </main>

      {/* Sign In Modal - Enhanced */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSignIn(false)}
          />

          <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mt-4">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none p-0",
                    formButtonPrimary:
                      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-base font-semibold py-3 rounded-xl shadow-lg",
                    formFieldInput:
                      "text-base py-3 px-4 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
                    footerActionLink:
                      "text-indigo-600 hover:text-indigo-700 font-semibold",
                    identityPreviewText: "text-sm",
                    formFieldLabel: "text-sm font-medium text-gray-700",
                  },
                }}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSignUp(false)}
          />

          <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mt-4">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none p-0",
                    formButtonPrimary:
                      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-base font-semibold py-3 rounded-xl shadow-lg",
                    formFieldInput:
                      "text-base py-3 px-4 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
                    footerActionLink:
                      "text-indigo-600 hover:text-indigo-700 font-semibold",
                    identityPreviewText: "text-sm",
                    formFieldLabel: "text-sm font-medium text-gray-700",
                  },
                }}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignUp(false);
                    setShowSignIn(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
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
