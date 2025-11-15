import React, { useEffect, useState } from "react";
import { TrendingUp, Users, Menu } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

// Import Flaticon PNG images
import discoverPeopleIcon from "../assets/icons/discoverpeople.png";
import searchIcon from "../assets/icons/search.png";

// --- UserCardWithLoading: Wraps UserCard to provide loading state for connect button ---
const UserCardWithLoading = ({ user }) => {
  const [connectLoading, setConnectLoading] = useState(false);

  return (
    <UserCard
      user={user}
      connectLoading={connectLoading}
      setConnectLoading={setConnectLoading}
    />
  );
};

const Discover = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        setUsers([]);
        setLoading(true);
        const { data } = await api.post(
          "/api/user/discover",
          { input },
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }
        );
        data.success ? setUsers(data.users) : toast.error(data.message);
        setLoading(false);
        setInput("");
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-y-auto pb-[50px]">
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-4 sm:hidden border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={discoverPeopleIcon}
                alt="Discover People"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white leading-tight">
                Discover People
              </h1>
              <p className="text-sm text-gray-400 mt-1">Find connections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header Section */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <div className="flex items-center gap-4 mb-3">
            {/* Icon with white background */}
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={discoverPeopleIcon}
                alt="Discover People"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">
                Discover People
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Find and connect with amazing people around the world
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-10">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="relative">
              {/* Search icon with white background */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/90 rounded-lg flex items-center justify-center p-1">
                <img
                  src={searchIcon}
                  alt="Search"
                  className="w-full h-full object-contain"
                />
              </div>
              <input
                type="text"
                placeholder="Search by name, username, bio, or location..."
                className="pl-14 pr-4 py-4 w-full border border-zinc-700 rounded-xl bg-zinc-950 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-base"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
              <span>Press Enter to search</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {!loading && users.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-pink-500" />
              <h2 className="text-base font-semibold text-white">
                Search Results
              </h2>
              <span className="text-sm text-gray-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                {users.length} {users.length === 1 ? "user" : "users"} found
              </span>
            </div>
          </div>
        )}

        {/* Users Grid - Updated for 2 cards per row on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {users.map((user) => (
            <UserCardWithLoading user={user} key={user._id} />
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
              {/* Search icon with white background in loading state */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/95 rounded-lg flex items-center justify-center p-2 shadow-lg">
                  <img
                    src={searchIcon}
                    alt="Searching"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-400 mt-6 font-medium text-sm">
              Searching for people...
            </p>
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!loading && users.length === 0 && input === "" && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8">
              {/* Main icon container with white background */}
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-600/10 rounded-3xl flex items-center justify-center border border-pink-500/20 shadow-2xl backdrop-blur-sm">
                <div className="w-24 h-24 bg-white/95 rounded-2xl flex items-center justify-center p-4 shadow-xl">
                  <img
                    src={searchIcon}
                    alt="Search"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              {/* Badge icon with white background */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse ring-4 ring-black">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1.5">
                  <img
                    src={discoverPeopleIcon}
                    alt="Discover"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-3 text-center">
              Start Discovering
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-8 leading-relaxed text-sm px-4">
              Use the search bar above to find people by their name, username,
              bio, or location
            </p>
          </div>
        )}

        {/* Empty State - No Results */}
        {!loading && users.length === 0 && input !== "" && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            {/* Icon with white background in no results state */}
            <div className="w-28 h-28 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl flex items-center justify-center mb-8 border border-zinc-700 shadow-2xl">
              <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center p-3 shadow-lg">
                <img
                  src={searchIcon}
                  alt="No results"
                  className="w-full h-full object-contain opacity-40"
                />
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-3 text-center">
              No Results Found
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-8 leading-relaxed text-sm px-4">
              We couldn't find any users matching your search. Try different
              keywords or browse suggested connections.
            </p>

            <button
              onClick={() => setInput("")}
              className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-xl active:scale-95 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 text-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
