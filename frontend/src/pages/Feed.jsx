import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const res = localStorage.getItem("data");
  const data = res ? JSON.parse(res) : null;

  // safe fallbacks
  const posts = data?.appData?.posts || [];
  const users = data?.appData?.users || [];

  // merge posts with author info
  const postsWithAuthors = posts.map((post) => {
    const author = users.find((u) => u._id === post.author);
    return { ...post, author: author || {} };
  });

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleProfileRedirect = (author) => {
    localStorage.setItem("selectedAuthor", JSON.stringify(author));
    navigate(`/profile/${author._id}`);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {/* Left Sidebar - Author info */}
        {selectedAuthor && (
          <div className="w-1/4 bg-white dark:bg-gray-800 shadow-lg p-4 border-r border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                {selectedAuthor.name?.charAt(0) || "?"}
              </div>
              <h2 className="text-lg font-semibold">{selectedAuthor.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{selectedAuthor.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {selectedAuthor.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                  onClick={() => handleProfileRedirect(selectedAuthor)}
                >
                  View Full Profile
                </button>
                <button
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow"
                  onClick={() => setSelectedAuthor(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Posts */}
        <div className="flex-1 p-6 overflow-y-auto">
         

          {postsWithAuthors.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700"
            >
              {/* Post Header */}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={() => setSelectedAuthor(post.author)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-bold text-white">
                  {post.author?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {post.author?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.author?.email}</p>
                </div>
              </div>

              {/* Post Content */}
              <h4 className="font-semibold mb-1">{post.title}</h4>
              <p className="mb-2">{post.content}</p>

              {/* If project */}
              {post.type === "project" && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Aim:</strong> {post.projectAim}
                  </p>
                  <p>
                    <strong>Requirements:</strong> {post.requirements?.join(", ")}
                  </p>
                  <p>
                    <strong>People Needed:</strong> {post.desiredPeople}
                  </p>
                </div>
              )}

              {/* If poll */}
              {post.type === "poll" && (
                <div className="mt-2">
                  <p className="font-semibold">Poll Options:</p>
                  {post.pollOptions.map((opt) => (
                    <p key={opt._id} className="text-sm">
                      {opt.optionText} ({opt.votes} votes)
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
