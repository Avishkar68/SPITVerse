import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import axios from "axios";
import { Input } from "../components/ui/Input"; 

// --- Component Start ---

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);
  const [postType, setPostType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false); 
  const [showTypeSelectionModal, setShowTypeSelectionModal] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  
  const [openInteractionId, setOpenInteractionId] = useState(null); // Renamed state for clarity
  const [commentText, setCommentText] = useState(""); 
  
  const [postLikes, setPostLikes] = useState({}); 
  const [userLikes, setUserLikes] = useState(new Set()); 
  const [showAllUsersId, setShowAllUsersId] = useState(null); // Tracks "View All" for Comments/Interested

  const [projectContact, setProjectContact] = useState(""); 

  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation

  // Load user data from localStorage for authentication/identity
  const getAuthData = () => {
    const res = localStorage.getItem("data");
    return res ? JSON.parse(res) : {};
  };

  const data = getAuthData();
  const loggedInUserEmail = data?.user?.email;
  const loggedInUserId = data?.user?._id;

  // --- Data & API Functions ---

  const loadLocalData = () => {
    const res = localStorage.getItem("data");
    const data = res ? JSON.parse(res) : null;
    if (data) {
      const postsData = data?.appData?.posts || [];
      const usersData = data?.appData?.users || [];

      setPosts(postsData);
      setUsers(usersData);

      const initialLikes = {};
      const initialUserLikes = new Set();
      postsData.forEach(post => {
        initialLikes[post._id] = post.likes?.length || 0;
        if (post.likes?.includes(loggedInUserId)) {
          initialUserLikes.add(post._id);
        }
      });
      setPostLikes(initialLikes);
      setUserLikes(initialUserLikes);
    }
  };
  
  // Effect for initial data load and Dark Mode
  useEffect(() => {
    loadLocalData();
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, [loggedInUserId]);

  // Effect to handle direct modal opening from Navbar
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get('type');

    if (type === 'project' && !showModal && !showTypeSelectionModal) {
      setPostType('project');
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, showModal, showTypeSelectionModal]);


  const refreshDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/dashboard/full");
      if (res.status === 200) {
        const dashboardData = res.data;
        const existingData = getAuthData();
        const newData = { ...existingData, appData: dashboardData };
        
        localStorage.setItem("data", JSON.stringify(newData));
        loadLocalData(); 
      }
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUserEmail) {
        alert("Authentication failed. Please log in again.");
        return;
    }

    const payload = {
      authorEmail: loggedInUserEmail,
      type: postType,
      title: formData.title,
      content: formData.content || formData.projectAim || "",
    };

    if (postType === "poll") {
      payload.pollOptions = pollOptions.filter((o) => o.trim() !== "");
      if (payload.pollOptions.length < 2) {
        alert("Polls require at least 2 options.");
        return;
      }
    } else if (postType === "project") {
      payload.projectAim = formData.projectAim;
      payload.requirements = (formData.requirements || "")
        .split(",")
        .map((r) => r.trim())
        .filter(r => r !== "");
      payload.desiredPeople = Number(formData.desiredPeople);
      payload.projectContact = projectContact; 
    }

    try {
      const res = await axios.post("http://localhost:4000/api/posts", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        alert("Post created!");
        setFormData({});
        setPostType(null); 
        setPollOptions(["", ""]);
        setProjectContact(""); 
        setShowModal(false); 
        refreshDashboardData();
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post!");
    }
  };

  const handleVote = async (postId, optionIndex) => {
    if (!loggedInUserId) {
        alert("Please log in to vote.");
        return;
    }

    try {
        const apiEndpoint = `http://localhost:4000/api/posts/${postId}/vote`;
        const response = await axios.post(apiEndpoint, { 
            optionIndex: optionIndex,
            userId: loggedInUserId, 
        });

        if (response.status === 200) {
            alert("Vote registered!");
            refreshDashboardData();
        }
    } catch (err) {
        console.error("Error voting:", err);
        const message = err.response?.data?.message || "Failed to register vote. Server error or invalid post.";
        alert(message); 
    }
  };

  const handleLikeToggle = async (postId) => {
    if (!loggedInUserId) {
        alert("Please log in to like a post.");
        return;
    }

    try {
        const apiEndpoint = `http://localhost:4000/api/posts/${postId}/like`;
        const response = await axios.post(apiEndpoint, { 
            userId: loggedInUserId, 
        });

        const { likesCount, isLiked } = response.data;
        
        setUserLikes(prevLikes => {
            const newLikes = new Set(prevLikes);
            if (isLiked) {
                newLikes.add(postId);
            } else {
                newLikes.delete(postId);
            }
            return newLikes;
        });

        setPostLikes(prev => ({ ...prev, [postId]: likesCount }));

    } catch (error) {
       console.error("Like API failed:", error);
       alert("Failed to toggle like. Please try again.");
    }
  };


  // FIX: This now handles Interest for Projects and Comment Submission for others
  const handleInteractionSubmission = async (e, postId, isProject) => {
    e.preventDefault();
    if (!loggedInUserId) {
        alert("Please log in to submit.");
        return;
    }

    // PROJECT: Single click action to register interest
    if (isProject) {
        // Check if user is already interested
        const post = postsWithAuthors.find(p => p._id === postId);
        const alreadyInterested = post?.comments?.some(c => c.userEmail === loggedInUserEmail);

        if (alreadyInterested) {
            alert("You have already registered interest in this project.");
            return;
        }
        
        const payload = {
            userId: loggedInUserId,
            userEmail: loggedInUserEmail, 
            text: `Interested! ${data.user.name} is looking to join.` 
        };
        
        try {
            await axios.post(`http://localhost:4000/api/posts/${postId}/comments`, payload);
            alert("Interest registered! The creator has been notified.");
            refreshDashboardData(); 
        } catch (err) {
            console.error("Error submitting interest:", err);
            alert("Failed to register interest. Please try again.");
        }

    // NON-PROJECT: Comment submission
    } else {
        if (!commentText.trim()) {
            alert("Please write a comment.");
            return;
        }

        try {
            const payload = {
                userId: loggedInUserId,
                userEmail: loggedInUserEmail, 
                text: commentText.trim()
            };
            await axios.post(`http://localhost:4000/api/posts/${postId}/comments`, payload);

            setCommentText("");
            setOpenInteractionId(postId); 
            refreshDashboardData(); 
        } catch (err) {
            console.error("Error submitting comment:", err);
            alert("Failed to submit comment. Please try again.");
        }
    }
  };


  // FIX: This handler now toggles the LIST visibility only.
  const handleInteractionListToggle = (postId, isProject) => {
    // If clicking on 'Interested' or 'Comments', toggle the list
    if (openInteractionId === postId) {
        setOpenInteractionId(null);
    } else {
        setOpenInteractionId(postId);
    }
    // Reset "View All" state when toggling the list
    setShowAllUsersId(null); 
    setCommentText(""); // Clear comment input when toggling
  };
  
  const handlePostAction = (action, postId, authorContactLink = null) => {
    if (action === 'Contact' && authorContactLink) {
        window.open(authorContactLink, '_blank');
    } else if (action === 'Share') {
        alert(`Share Post ${postId} - feature coming soon!`);
    } else if (action === 'Create') {
        setShowTypeSelectionModal(true);
    }
  };
  
  const handleTypeSelection = (type) => {
      setPostType(type);
      setShowTypeSelectionModal(false); 
      setShowModal(true); 
  };


  // --- Helper Functions ---

  const postsWithAuthors = posts.map((post) => {
    const author = users.find((u) => u._id === post.author);
    return { 
        ...post, 
        author: author || {},
        likes: post.likes?.length || 0, 
        comments: post.comments || [], 
        projectContactLink: post.projectContact || post.author?.linkedinId || null,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
  
  // ... (Input/Poll handlers remain the same)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePollChange = (index, value) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleProfileRedirect = (author) => {
    setSelectedAuthor(null);
    navigate(`/profile/${author._id}`);
  };


  // --- Sub-Components (Modals) ---
  
  function ModalWrapper({ children, onClose }) {
      // ... (ModalWrapper JSX remains the same)
      return (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <div
                  className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-200 dark:border-gray-700 relative"
              >
                  {children}
                  <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
              </div>
          </div>
      );
  }

  function TypeSelectionModal() {
      // ... (TypeSelectionModal JSX remains the same)
      return (
          <ModalWrapper onClose={() => setShowTypeSelectionModal(false)}>
              <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 text-center">
                  What kind of post would you like to create?
              </h2>
              <div className="grid grid-cols-3 gap-4">
                  {[
                      { type: 'blog', title: 'Blog Post', icon: 'fas fa-newspaper', desc: 'Share your thoughts, articles, or notes.' },
                      { type: 'poll', title: 'Create Poll', icon: 'fas fa-poll', desc: 'Ask a question and gather community opinions.' },
                      { type: 'project', title: 'Start Project', icon: 'fas fa-lightbulb', desc: 'Find teammates and resources for your idea.' }
                  ].map(({ type, title, icon, desc }) => (
                      <button
                          key={type}
                          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all duration-200 text-center space-y-2"
                          onClick={() => handleTypeSelection(type)}
                      >
                          <i className={`${icon} text-3xl text-indigo-500`}></i>
                          <h3 className="font-semibold text-lg">{title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                      </button>
                  ))}
              </div>
          </ModalWrapper>
      );
  }

  function PostCreationModal() {
      // ... (PostCreationModal JSX remains the same)
      return (
          <ModalWrapper onClose={() => setShowModal(false)}>
              <h2 className="text-2xl font-bold mb-5 text-indigo-600 dark:text-indigo-400">
                  Create {postType?.charAt(0).toUpperCase() + postType?.slice(1) || 'Post'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                      type="text"
                      name="title"
                      placeholder="Title or Short Summary"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      required
                  />

                  {postType === "blog" && (
                      <textarea
                          name="content"
                          placeholder="Write your blog content here..."
                          value={formData.content || ""}
                          onChange={handleInputChange}
                          rows="6"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                          required
                      />
                  )}

                  {postType === "poll" && (
                      <div className="space-y-3 p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                              Poll Options (2-4 required)
                          </p>
                          {pollOptions.map((opt, idx) => (
                              <Input
                                  key={idx}
                                  type="text"
                                  placeholder={`Option ${idx + 1}`}
                                  value={opt}
                                  onChange={(e) => handlePollChange(idx, e.target.value)}
                                  required={idx < 2}
                              />
                          ))}
                          {pollOptions.length < 4 && (
                              <button
                                  type="button"
                                  onClick={addPollOption}
                                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400 rounded-full hover:bg-indigo-200 transition-colors duration-150 font-medium"
                              >
                                  + Add Option
                              </button>
                          )}
                      </div>
                  )}

                  {postType === "project" && (
                      <div className="space-y-3">
                          <Input
                              type="text"
                              name="projectAim"
                              placeholder="Project Aim (Required)"
                              value={formData.projectAim || ""}
                              onChange={handleInputChange}
                              required
                          />
                          <Input
                              type="text"
                              name="requirements"
                              placeholder="Skills Needed (e.g., React, Node, SQL - comma separated)"
                              value={formData.requirements || ""}
                              onChange={handleInputChange}
                              required
                          />
                          <Input
                              type="number"
                              name="desiredPeople"
                              placeholder="Number of People Needed"
                              value={formData.desiredPeople || ""}
                              onChange={handleInputChange}
                              min="1"
                              required
                          />
                          {/* NEW FIELD: Project Contact Link */}
                          <Input
                              type="url"
                              name="projectContact"
                              placeholder="LinkedIn or Contact Link (e.g., https://linkedin.com/in/user)"
                              value={projectContact || ""}
                              onChange={(e) => setProjectContact(e.target.value)}
                              required // Make contact mandatory for a project post
                          />
                      </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <button
                          type="button"
                          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                          onClick={() => setShowModal(false)}
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-md font-medium"
                      >
                          Post Project
                      </button>
                  </div>
              </form>
          </ModalWrapper>
      );
  }

  // --- Main Component JSX ---

  return (
    <div className={`${darkMode ? "dark" : ""} font-sans`}>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-[#121212] dark:text-gray-100">

        {/* 1. Fixed Left Sidebar (Navigation/User Card) */}
        <div className="hidden lg:block w-64 xl:w-72 h-[100vh-66px] border-r border-gray-900 dark:border-gray-800 p-4 shrink-0 overflow-y-auto bg-white dark:bg-[#1A1A1A]">
          
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">CollegeHub</h1>
          
          <div className="space-y-4">
            
            <div className="flex items-center space-x-3 p-3 rounded-lg text-indigo-400 font-semibold bg-gray-200/50 dark:bg-gray-800/70 transition-colors duration-150">
                <i className="fas fa-home"></i> <span>Feed</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors duration-150">
                <i className="fas fa-user-friends"></i> <span>Connections</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors duration-150">
                <i className="fas fa-lightbulb"></i> <span>Projects</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors duration-150">
                <i className="fas fa-cog"></i> <span>Settings</span>
            </div>
            
          </div>
          
          <button
              onClick={() => setDarkMode(p => !p)}
              className="mt-8 w-full flex items-center justify-center space-x-2 p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/70 text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>

        {/* 2. Scrollable Center Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-xl mx-auto">
            {/* Create Post Area */}
            <div className="relative mb-6 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-400 dark:bg-indigo-600 mr-3 flex items-center justify-center text-white text-lg font-semibold shrink-0">
                            {loggedInUserEmail?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">What's on your mind?</span>
                    </div>
                    <button
                        onClick={() => handlePostAction('Create')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                    >
                        Create Post 
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
                {postsWithAuthors.length === 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No posts yet. Be the first to post!
                    </div>
                )}
              {postsWithAuthors.map((post) => {
                const currentLikes = postLikes[post._id] !== undefined ? postLikes[post._id] : post.likes;
                const isLiked = userLikes.has(post._id);
                
                const isProject = post.type === 'project';
                
                const interactionList = post.comments || [];
                const itemsToShow = showAllUsersId === post._id 
                                        ? interactionList 
                                        : interactionList.slice().reverse().slice(0, 2); // Show 2 newest items
                const showViewAllButton = interactionList.length > 2 && showAllUsersId !== post._id;
                
                return (
                <div
                  key={post._id}
                  className="bg-white dark:bg-[#1A1A1A] shadow-lg rounded-xl p-5 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl"
                >
                  {/* Author Header */}
                  <div
                    className="flex items-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedAuthor(post.author)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-semibold text-gray-800 dark:text-white shrink-0">
                      {post.author?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-md leading-snug">{post.author?.name || "Unknown User"}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.author?.email} • {new Date(post.createdAt).toLocaleDateString()} 
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <h4 className="font-bold text-lg mb-2">{post.title}</h4>
                  <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>

                  {/* Type-Specific Content */}
                  {isProject && (
                    <div className="p-3 bg-indigo-50 dark:bg-gray-800/50 rounded-lg text-sm space-y-1">
                      <p className="font-bold text-indigo-700 dark:text-indigo-400">Project Call</p>
                      <p>
                        <strong className="font-semibold">Aim:</strong> {post.projectAim}
                      </p>
                      <p>
                        <strong className="font-semibold">Requirements:</strong> <span className="text-xs italic bg-indigo-100 dark:bg-gray-700/50 px-2 py-0.5 rounded">{post.requirements?.join(", ")}</span>
                      </p>
                      <p>
                        <strong className="font-semibold">People Needed:</strong> {post.desiredPeople}
                      </p>
                    </div>
                  )}

                  {post.type === "poll" && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cast your vote:</p>
                      {post.pollOptions.map((opt, idx) => (
                        <button
                          key={opt._id || idx}
                          onClick={() => handleVote(post._id, idx)} 
                          className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex justify-between items-center"
                        >
                          <span className="font-medium">{opt.optionText || opt}</span>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{opt.votes || 0} votes</span> 
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Footer Action Icons */}
                  <div className="flex justify-between mt-4 border-t pt-3 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                      
                      {/* LIKES FEATURE */}
                      <button 
                          className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                          onClick={() => handleLikeToggle(post._id)}
                      >
                          <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i> 
                          <span className="text-sm font-medium">Like {currentLikes}</span>
                      </button>
                      
                      {/* INTERACTION FEATURE */}
                      {isProject ? (
                        <>
                          {/* 1. Register Interest Button (API Call) */}
                          <button 
                              className={`flex items-center space-x-1 transition-colors hover:text-green-600`}
                              // NEW CORRECT CODE (Inside Feed.jsx JSX):
onClick={(e) => handleInteractionSubmission(e, post._id, true)}
                          >
                              <i className="fas fa-user-plus"></i>
                              <span className="text-sm font-medium">Interested</span>
                          </button>
                          {/* 2. View Interested List Button (Toggle List Visibility) */}
                          <button 
                              className={`flex items-center space-x-1 transition-colors ${openInteractionId === post._id ? 'text-green-600' : 'hover:text-green-600'}`}
                              onClick={() => handleInteractionListToggle(post._id, true)}
                          >
                              <i className="fas fa-users"></i>
                              <span className="text-sm font-medium">Interested Users ({interactionList.length || 0})</span>
                          </button>
                          {/* 3. Contact Button */}
                          <button 
                              className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                              onClick={() => handlePostAction('Contact', post._id, post.projectContactLink)}
                              disabled={!post.projectContactLink}
                          >
                              <i className="fab fa-linkedin"></i> <span className="text-sm">Contact</span>
                          </button>
                        </>
                      ) : (
                        /* Non-Project (Blog/Poll) Interaction */
                        <button 
                            className={`flex items-center space-x-1 transition-colors ${openInteractionId === post._id ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
                            onClick={() => handleInteractionListToggle(post._id, false)}
                        >
                            <i className={`fa-${openInteractionId === post._id ? 'solid' : 'regular'} fa-comment`}></i> 
                            <span className="text-sm font-medium">Comments {interactionList.length || 0}</span>
                        </button>
                      )}
                      
                      {/* SHARE (Only shown if NOT a Project, as Project has 3 buttons) */}
                      {!isProject && (
                        <button 
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                            onClick={() => handlePostAction('Share', post._id)}
                        >
                            <i className="fas fa-share-alt"></i> <span className="text-sm">Share</span>
                        </button>
                      )}
                  </div>

                  {/* Interaction Section (Comments/Interested List) */}
                  {openInteractionId === post._id && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">

                        {/* Comment Input Form (Only for non-project posts) */}
                        {!isProject && (
                            <form onSubmit={(e) => handleInteractionSubmission(e, post._id, false)} className="flex items-center space-x-2 mb-4">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows="1"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Post
                                </button>
                            </form>
                        )}
                        
                        {/* Display List */}
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {isProject ? 'Interested Users' : 'Comments'} ({interactionList.length || 0})
                            </h5>
                            {interactionList.length > 0 ? (
                                itemsToShow
                                    .map((item) => {
                                        const commenter = users.find(u => u.email === item.userEmail);
                                        const displayEmail = commenter?.name || item.userEmail || "Anonymous";

                                        return (
                                            <div key={item._id} className={`text-xs p-2 rounded-lg flex justify-between items-center ${isProject ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                  {isProject && <i className="fas fa-check-circle mr-1 text-green-600 dark:text-green-400"></i>}
                                                  {displayEmail}
                                                </div>
                                                {!isProject && <p className="text-gray-700 dark:text-gray-300 mt-0.5">{item.text}</p>}
                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No {isProject ? 'interest' : 'comments'} yet. Be the first!</p>
                            )}
                            
                            {/* VIEW ALL / HIDE BUTTON */}
                            {showViewAllButton && (
                                <button 
                                    className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline w-full text-center py-1"
                                    onClick={() => setShowAllUsersId(post._id)}
                                >
                                    View all {interactionList.length} {isProject ? 'interested users' : 'comments'}
                                </button>
                            )}
                            {showAllUsersId === post._id && (
                                <button 
                                    className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline w-full text-center py-1"
                                    onClick={() => setShowAllUsersId(null)}
                                >
                                    Hide recent list
                                </button>
                            )}
                        </div>
                    </div>
                  )}

                </div>
              );})
              }
            </div>
          </div>
        </div>

        {/* 3. Right Sidebar (Widgets/Selected Author Quick Profile) */}
        <div className="hidden lg:block w-72 h-full border-l border-gray-200 dark:border-gray-800 p-4 shrink-0 overflow-y-auto">
          {selectedAuthor ? (
            <div className="sticky top-4 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500 dark:bg-indigo-700 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {selectedAuthor.name?.charAt(0) || "?"}
                </div>
                <h2 className="xl font-bold truncate">{selectedAuthor.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{selectedAuthor.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic line-clamp-3">
                  {selectedAuthor.description || "No description provided."}
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                    onClick={() => handleProfileRedirect(selectedAuthor)}
                  >
                    View Full Profile
                  </button>
                  <button
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                    onClick={() => setSelectedAuthor(null)}
                  >
                    Close Quick View
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-4 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
                 <h3 className="font-bold mb-3 text-lg">Who to Follow</h3>
                 <div className="space-y-3">
                    {users.slice(0, 3).map(user => (
                         <div key={user._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-pink-200 dark:bg-pink-600 mr-2 flex items-center justify-center text-xs font-semibold text-white">
                                    {user.name?.charAt(0) || "?"}
                                </div>
                                <span className="text-sm font-medium truncate">{user.name}</span>
                            </div>
                            <button className="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-700 font-medium">Follow</button>
                        </div>
                    ))}
                 </div>
            </div>
          )}
        </div>

        {/* --- MODALS --- */}
        
        {/* NEW: Type Selection Modal */}
        {showTypeSelectionModal && <TypeSelectionModal />}

        {/* Specific Post Creation Modal */}
        {showModal && <PostCreationModal />}
      </div>
    </div>
  );
};

export default Feed;