import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProfileModal from "../components/ProfileModal";
import StoryViewer from "../components/StoryViewer";
import PostCard from "../components/PostCard";
import { useAuth, useClerk } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Grid3x3, Bookmark, Menu, X, Settings, LogOut } from "lucide-react";
import profileIcon from "../assets/icons/Profile.png";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { signOut, openUserProfile } = useClerk();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewUserStories, setViewUserStories] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Check if viewing own profile
  const isOwnProfile = !profileId || profileId === currentUser?._id;

  const fetchUser = async (userId) => {
    const token = await getToken();
    try {
      setLoading(true);
      const { data } = await api.post(
        `/api/user/profiles`,
        { profileId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setUser(data.profile);
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get(`/api/post/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setSavedPosts(data.savedPosts);
        setSavedPostIds(data.savedPosts.map((p) => p._id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch saved posts"
      );
    }
  };

  const fetchUserStories = async (userId) => {
    try {
      setStoryLoading(true);
      const token = await getToken();

      // Add timeout for story loading
      const timeoutId = setTimeout(() => {
        if (storyLoading) {
          setViewUserStories(null);
          setStoryLoading(false);
          toast.error("No stories available for this user");
        }
      }, 2000); // 2 second timeout

      const { data } = await api.get("/api/story/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear timeout if request completes
      clearTimeout(timeoutId);

      if (data.success) {
        const filteredStories = data.stories.filter(
          (story) => story.user._id === userId
        );

        if (filteredStories.length > 0) {
          setUserStories(filteredStories);
          setViewUserStories({
            user: user,
            stories: filteredStories,
            startIndex: 0,
          });
        } else {
          setViewUserStories(null);
          toast.error("No stories available for this user");
        }
      } else {
        setViewUserStories(null);
        toast.error(data.message);
      }
    } catch (error) {
      setViewUserStories(null);
      toast.error(error?.message || "Failed to fetch stories");
    } finally {
      setStoryLoading(false);
    }
  };

  const handleProfileImageClick = () => {
    if (user) {
      setViewUserStories({ user: user, stories: null, startIndex: 0 });
      fetchUserStories(user._id);
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user._id}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleManageAccount = () => {
    openUserProfile();
    setShowMenu(false);
  };

  const handleLogout = () => {
    signOut();
    setShowMenu(false);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setSavedPosts(savedPosts.filter((post) => post._id !== postId));
    setSavedPostIds(savedPostIds.filter((id) => id !== postId));
    handleClosePostModal();
  };

  const handlePostSaved = (postId, isSaved) => {
    if (isSaved) {
      fetchSavedPosts();
      if (!savedPostIds.includes(postId)) {
        setSavedPostIds([...savedPostIds, postId]);
      }
    } else {
      setSavedPosts(savedPosts.filter((post) => post._id !== postId));
      setSavedPostIds(savedPostIds.filter((id) => id !== postId));
    }
  };

  // Enhanced story loader close handler
  const handleCloseStoryLoader = () => {
    setViewUserStories(null);
    setStoryLoading(false);
  };

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else if (currentUser?._id) {
      fetchUser(currentUser._id);
    }
  }, [profileId, currentUser]);

  useEffect(() => {
    if (activeTab === "saved" && isOwnProfile) {
      fetchSavedPosts();
    }
  }, [activeTab, isOwnProfile]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const tabs = [
    { id: "posts", label: "Posts" },
    ...(isOwnProfile ? [{ id: "saved", label: "Saved" }] : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return user ? (
    <div className="min-h-screen bg-black">
      {/* ...existing code for mobile header, desktop header, mobile menu... */}
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-4 md:hidden border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
            <img
              src={profileIcon}
              alt="Profile"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white leading-tight">
              Profile
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              View and edit your profile
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Header Section */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={profileIcon}
                alt="Profile"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">Profile</h1>
              <p className="text-sm text-gray-400 mt-1">
                View and edit your profile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button - Only show on own profile */}
      {isOwnProfile && (
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 bg-zinc-900 rounded-xl shadow-lg border border-white/10 active:scale-95 transition-transform"
          >
            {showMenu ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {showMenu && isOwnProfile && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-20 right-4 z-40 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-64 md:hidden overflow-hidden">
            <div className="py-2">
              <button
                onClick={handleManageAccount}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-white">Manage Account</span>
              </button>
              <div className="border-t border-zinc-800 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-400">Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="max-w-4xl mx-auto">
        {/* ...existing profile header code... */}
        {/* Profile Header */}
        <div className="px-4 py-8">
          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-start gap-4 mb-6 w-full">
              <div className="flex-shrink-0">
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  onClick={handleProfileImageClick}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-gradient-to-r from-purple-500 to-pink-500 cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-white mb-4 truncate px-6">
                  {user.full_name}
                </h1>
                <div className="flex gap-6 text-center w-full">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">
                      {posts.length}
                    </p>
                    <p className="text-sm text-gray-400">posts</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">
                      {user.followers?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">followers</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">
                      {user.following?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">following</p>
                  </div>
                </div>
              </div>
            </div>

            {user.bio && (
              <div className="mb-4">
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-base text-white flex items-center gap-1">
                <span className="text-gray-400">@</span>
                {user.username}
              </p>
            </div>

            {isOwnProfile && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setShowEdit(true)}
                  className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleShareProfile}
                  className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Share profile
                </button>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="flex gap-8 items-start mb-8">
              <div className="flex-shrink-0">
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  onClick={handleProfileImageClick}
                  className="w-36 h-36 rounded-full object-cover ring-2 ring-gradient-to-r from-purple-500 to-pink-500 cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h1 className="text-xl text-white font-normal">
                    {user.username}
                  </h1>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEdit(true)}
                      className="px-6 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="flex gap-8 mb-6 text-white">
                  <div>
                    <span className="font-semibold">{posts.length}</span>{" "}
                    <span className="text-gray-400 font-normal">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      {user.followers?.length || 0}
                    </span>{" "}
                    <span className="text-gray-400 font-normal">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      {user.following?.length || 0}
                    </span>{" "}
                    <span className="text-gray-400 font-normal">following</span>
                  </div>
                </div>
                <div className="text-white">
                  <p className="font-semibold mb-1">{user.full_name}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-300 whitespace-pre-line font-normal">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800">
          <div className="flex justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 relative font-medium text-sm md:text-base ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                } transition-colors`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ...existing content grid code... */}
        {/* Content Grid */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1">
            {posts.length > 0 ? (
              posts.map((post) =>
                post.image_urls.map((image, index) => (
                  <div
                    key={`${post._id}-${index}`}
                    className="aspect-square bg-zinc-900 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handlePostClick(post)}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <Grid3x3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-normal text-white mb-2">
                  Share photos
                </h3>
                <p className="text-sm text-gray-400 font-normal">
                  When you share photos, they will appear on your profile.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && isOwnProfile && (
          <div className="grid grid-cols-3 gap-1">
            {savedPosts.length > 0 ? (
              savedPosts.map((post) =>
                post.image_urls.map((image, index) => (
                  <div
                    key={`${post._id}-${index}`}
                    className="aspect-square bg-zinc-900 cursor-pointer hover:opacity-90 transition-opacity relative group"
                    onClick={() => handlePostClick(post)}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bookmark className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
                  <Bookmark className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-normal text-white mb-2">
                  Save
                </h3>
                <p className="text-sm text-gray-400 text-center max-w-sm font-normal">
                  Save photos and videos that you want to see again. No one is
                  notified, and only you can see what you've saved.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}

      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={handleClosePostModal}
            className="fixed top-4 right-4 z-[70] p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="w-full max-w-md mx-auto my-8 relative z-[65]">
            <PostCard
              post={selectedPost}
              onClose={handleClosePostModal}
              onPostDeleted={handlePostDeleted}
              onPostSaved={handlePostSaved}
              initialIsSaved={savedPostIds.includes(selectedPost._id)}
            />
          </div>
        </div>
      )}

      {/* Enhanced Story Viewer with Timeout */}
      {viewUserStories && (
        <>
          {viewUserStories.stories === null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-white"></div>
                <div className="text-sm text-white font-medium">
                  Loading stories...
                </div>
                <button
                  className="mt-2 px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
                  onClick={handleCloseStoryLoader}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {viewUserStories.stories && (
            <StoryViewer
              user={viewUserStories.user}
              stories={viewUserStories.stories}
              startIndex={viewUserStories.startIndex}
              setViewStory={() => setViewUserStories(null)}
            />
          )}
        </>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
