import { BadgeCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const StoryViewer = ({ user, stories, startIndex = 0, setViewStory }) => {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    let timer, progressInterval;
    setProgress(0);

    if (stories[current].media_type !== "video") {
      const duration = 10000; // 10 seconds
      const setTime = 100;
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += setTime;
        setProgress((elapsed / duration) * 100);
      }, setTime);

      timer = setTimeout(() => {
        if (current < stories.length - 1) {
          setCurrent(current + 1);
        } else {
          setViewStory(null);
        }
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [current, stories, setViewStory]);

  const handleClose = () => setViewStory(null);

  const handleNext = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
    } else {
      setViewStory(null);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleTap = (e) => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    // If click is on left 1/3 of screen, go previous
    if (clickX < screenWidth / 3) {
      handlePrev();
    }
    // If click is on right 2/3 of screen, go next
    else if (clickX > screenWidth / 3) {
      handleNext();
    }
  };

  const renderContent = () => {
    const story = stories[current];
    switch (story.media_type) {
      case "image":
        return (
          <img
            src={story.media_url}
            alt=""
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        );
      case "video":
        return (
          <video
            onEnded={() => {
              if (current < stories.length - 1) setCurrent(current + 1);
              else setViewStory(null);
            }}
            src={story.media_url}
            className="max-w-full h-full object-cover"
            controls
            autoPlay
          />
        );
      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-3xl font-medium text-center">
            {story.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black/95 backdrop-blur-sm z-110 flex items-center justify-center animate-in fade-in duration-200"
      style={{
        backgroundColor:
          stories[current].media_type === "text"
            ? stories[current].background_color
            : "rgba(0, 0, 0, 0.95)",
      }}
      onClick={handleTap}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full flex gap-2 p-3 z-50">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="h-1 rounded-full transition-all duration-100 overflow-hidden bg-white/30"
            style={{
              width: `${100 / stories.length}%`,
            }}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width:
                  idx < current
                    ? "100%"
                    : idx === current
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* User Info - Top Left */}
      <div
        className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={user?.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span className="text-sm">{user?.full_name}</span>
          {user?.is_verified && (
            <BadgeCheck size={16} className="text-blue-400" />
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all duration-200 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content Wrapper */}
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        {renderContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
