import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

function groupStoriesByUser(stories) {
  const map = {};
  stories.forEach((story) => {
    const uid = story.user._id;
    if (!map[uid]) {
      map[uid] = {
        user: story.user,
        stories: [],
      };
    }
    map[uid].stories.push(story);
  });
  return Object.values(map);
}

const StoriesBar = () => {
  const { getToken, user } = useAuth();
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewUserStories, setViewUserStories] = useState(null); // {user, stories, startIndex}

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/story/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setStories(data.stories);
        } else {
          toast(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchStories();
  }, [getToken]);

  //   const fetchStories = async () => {
  //     setStories(dummyStoriesData);
  //   };

  //   useEffect(() => {
  //     fetchStories();
  //   });

  // Group stories by user
  const grouped = groupStoriesByUser(stories);

  // Find your own group
  const myGroup = grouped.find((g) => g.user._id === user?.id);
  const otherGroups = grouped.filter((g) => g.user._id !== user?.id);

  return (
    <div className="w-full max-w-full lg:max-w-2xl no-scrollbar overflow-x-auto px-1">
      <div className="flex gap-6 pb-5">
        {/* Your Story */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div
              onClick={() =>
                myGroup
                  ? setViewUserStories({ ...myGroup, startIndex: 0 })
                  : setShowModal(true)
              }
              className="w-28 h-28 rounded-full bg-linear-to-tr from-purple-500 via-pink-400 to-indigo-500 p-1 cursor-pointer transition-all duration-200"
            >
              <div
                className={`w-full h-full rounded-full bg-black flex items-center justify-center`}
              >
                {/* Show latest story media if exists, else profile image */}
                {myGroup && myGroup.stories.length > 0 ? (
                  (() => {
                    const story = myGroup.stories[myGroup.stories.length - 1];
                    if (story.media_type !== "text") {
                      return (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {story.media_type === "image" ? (
                            <img
                              src={story.media_url}
                              alt=""
                              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80 rounded-full"
                            />
                          ) : (
                            <video
                              src={story.media_url}
                              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80 rounded-full"
                              controls
                            />
                          )}
                        </div>
                      );
                    }
                    return (
                      <img
                        src={
                          user?.profile_image_url ||
                          user?.profile_picture ||
                          assets.default_profile
                        }
                        alt="Your story"
                        className="w-full h-full object-cover rounded-full"
                      />
                    );
                  })()
                ) : (
                  <img
                    src={
                      user?.profile_image_url ||
                      user?.profile_picture ||
                      assets.default_profile
                    }
                    alt="Your story"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              {/* Plus icon on edge if you have a story */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className={`absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-8 h-8 bg-indigo-500 border-4 border-black rounded-full flex items-center justify-center cursor-pointer shadow-lg ${
                  myGroup ? "" : "hidden"
                }`}
                tabIndex={-1}
                aria-label="Add story"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <p className="text-white text-sm mt-2 text-center max-w-24 truncate">
            Your story
          </p>
        </div>

        {/* Other Users' Stories */}
        {otherGroups.map((group) => (
          <div key={group.user._id} className="flex flex-col items-center">
            <div
              onClick={() => setViewUserStories({ ...group, startIndex: 0 })}
              className="w-28 h-28 rounded-full bg-linear-to-tr from-purple-500 via-pink-400 to-indigo-500 p-1 cursor-pointer transition-all duration-200"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                {/* Show latest story media if exists, else profile image */}
                {group.stories.length > 0 ? (
                  (() => {
                    const story = group.stories[group.stories.length - 1];
                    if (story.media_type !== "text") {
                      return (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {story.media_type === "image" ? (
                            <img
                              src={story.media_url}
                              alt=""
                              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80 rounded-full"
                            />
                          ) : (
                            <video
                              src={story.media_url}
                              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80 rounded-full"
                              controls
                            />
                          )}
                        </div>
                      );
                    }
                    return (
                      <img
                        src={group.user.profile_picture}
                        alt={group.user.username || "User"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    );
                  })()
                ) : (
                  <img
                    src={group.user.profile_picture}
                    alt={group.user.username || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
            </div>
            <p className="text-white text-sm mt-2 text-center max-w-24 truncate">
              {group.user.username || group.user.name || "User"}
            </p>
          </div>
        ))}
      </div>

      {/* Add Story Modal */}
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={() => {}} />
      )}
      {/* View Story Modal */}
      {viewUserStories && (
        <StoryViewer
          user={viewUserStories.user}
          stories={viewUserStories.stories}
          startIndex={viewUserStories.startIndex}
          setViewStory={() => setViewUserStories(null)}
        />
      )}
    </div>
  );
};

export default StoriesBar;
