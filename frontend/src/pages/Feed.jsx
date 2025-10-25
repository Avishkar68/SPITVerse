import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaUser } from "react-icons/fa";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

// --- Utility Functions ---

// utils/auth.js equivalent
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Simplified and Professional Input Component ---

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <div className="group/input rounded-lg transition duration-300">
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 
           bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-black dark:text-white
           placeholder:text-gray-500 dark:placeholder:text-gray-400 
           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`,
          className
        )}
        ref={ref}
        {...props} 
      />
    </div>
  );
});
Input.displayName = "Input";

// ---------------------------------------------
// --- Global Helper Component: ModalWrapper ---
// ---------------------------------------------

function ModalWrapper({ children, onClose }) {
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------
// --- Extracted Component: TypeSelectionModal ---
// ---------------------------------------------

function TypeSelectionModal({ handleTypeSelection, setShowTypeSelectionModal }) {
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

// ---------------------------------------------
// --- Extracted Component: PostCreationModal ---
// ---------------------------------------------

function PostCreationModal({
    postType,
    formData,
    pollOptions,
    projectContact,
    handleInputChange,
    handlePollChange,
    addPollOption,
    handleSubmit,
    setProjectContact,
    setShowModal
}) {
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
                            required
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

// ---------------------------------------------
// --- Extracted Component: PostItem (Memoized) ---
// ---------------------------------------------

const PostItem = React.memo(function PostItem({
    post,
    currentLikes,
    isLiked,
    loggedInUserEmail,
    users,
    openInteractionId,
    commentText, // This state is for the *active* post comment input
    showAllUsersId,
    handleLikeToggle,
    handleInteractionListToggle,
    handleInteractionSubmission,
    handlePostAction,
    setSelectedAuthor,
    setCommentText, // The setter is passed down
    setShowAllUsersId,
    handleVote
}) {
    const isProject = post.type === 'project';
    const interactionList = post.comments || [];

    const itemsToShow = useMemo(() => {
        if (showAllUsersId === post._id) {
            return interactionList;
        }
        // Show 2 newest items (slice().reverse().slice(0, 2))
        return interactionList.slice().reverse().slice(0, 2);
    }, [interactionList, showAllUsersId, post._id]);

    const showViewAllButton = interactionList.length > 2 && showAllUsersId !== post._id;

    const loggedInUserIsInterested = isProject && interactionList.some(c => c.userEmail === loggedInUserEmail);

    return (
        <div
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
                    className={`flex items-center cursor-pointer space-x-1 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
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
                            className={`flex items-center cursor-pointer space-x-1 transition-colors ${loggedInUserIsInterested ? 'text-green-600/50' : 'hover:text-green-600'}`}
                            onClick={(e) => handleInteractionSubmission(e, post._id, true)}
                            disabled={loggedInUserIsInterested}
                        >
                            <i className="fas fa-user-plus"></i>
                            <span className="text-sm font-medium">{loggedInUserIsInterested ? 'Already Interested' : 'Interested'}</span>
                        </button>
                        {/* 2. View Interested List Button (Toggle List Visibility) */}
                        <button
                            className={`flex items-center cursor-pointer space-x-1 transition-colors ${openInteractionId === post._id ? 'text-green-600' : 'hover:text-green-600'}`}
                            onClick={() => handleInteractionListToggle(post._id, true)}
                        >
                            <i className="fas fa-users"></i>
                            <span className="text-sm  font-medium">Interested Users ({interactionList.length || 0})</span>
                        </button>
                        {/* 3. Contact Button */}
                        <button
                            className="flex items-center space-x-1 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => handlePostAction('Contact', post._id, post.projectContactLink)}
                            disabled={!post.projectContactLink}
                        >
                            <i className="fab fa-linkedin "></i> <span className="text-sm">Contact</span>
                        </button>
                    </>
                ) : (
                    /* Non-Project (Blog/Poll) Interaction */
                    <button
                        className={`flex items-center space-x-1 transition-colors ${openInteractionId === post._id ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
                        onClick={() => handleInteractionListToggle(post._id, false)}
                    >
                        <i className={`fa-${openInteractionId === post._id ? 'solid' : 'regular'} fa-comment`}></i>
                        <span className="text-sm font-medium cursor-pointer">Comments ({interactionList.length || 0})</span>
                    </button>
                )}

                {/* SHARE (Only shown if NOT a Project, as Project has 3 buttons) */}
                {!isProject && (
                    <button
                        className="flex items-center cursor-pointer space-x-1 hover:text-indigo-600 transition-colors"
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
                            {/* We use the standard HTML textarea here to ensure maximum focus stability */}
                            <textarea
                                // Only set the value if this is the actively open comment section
                                value={openInteractionId === post._id ? commentText : ''}
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
                                    const commenter = users.find(u => u._id === item.userId); 
                                    const displayEmail = commenter?.name || item.userEmail || "Anonymous";

                                    return (
                                        <div key={item._id} className={`text-xs p-2 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center ${isProject ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                {isProject && <i className="fas fa-check-circle mr-1 text-green-600 dark:text-green-400"></i>}
                                                {displayEmail}
                                                {!isProject && <p className="text-gray-700 dark:text-gray-300 mt-0.5 font-normal">{item.text}</p>}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-0">
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
    );
});

// ---------------------------------------------
// --- New Component: PostSkeleton ---
// ---------------------------------------------

function PostSkeleton() {
    return (
        <div 
            className="bg-white dark:bg-[#1A1A1A] shadow-lg rounded-xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse"
        >
            {/* Author Header Skeleton */}
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3 shrink-0"></div>
                <div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                </div>
                <div className="ml-auto w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>

            {/* Title Line Skeleton */}
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
            
            {/* Content Lines Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-11/12"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-10/12"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            </div>
            
            {/* Footer Action Icons Skeleton */}
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
            </div>
        </div>
    );
}

// ---------------------------------------------
// --- Main Component: Feed (State Management) ---
// ---------------------------------------------

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

    const [openInteractionId, setOpenInteractionId] = useState(null);
    const [commentText, setCommentText] = useState(""); 

    const [postLikes, setPostLikes] = useState({});
    const [userLikes, setUserLikes] = useState(new Set()); 
    const [showAllUsersId, setShowAllUsersId] = useState(null);
    
    // NEW: State for Top Rankers
    const [topRankers, setTopRankers] = useState([]);

    const [projectContact, setProjectContact] = useState("");

    const [feedFilter, setFeedFilter] = useState('all'); // 'all', 'project', 'blog', 'poll'
    
    // ADDED: Loading state for data fetching
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // --- Authentication & Identity ---
    const getAuthData = () => {
        const res = localStorage.getItem("data");
        return res ? JSON.parse(res) : {};
    };

    const data = getAuthData();
    const loggedInUserEmail = data?.user?.email;
    const loggedInUserId = data?.user?._id;
    const loggedInUserName = data?.user?.name || 'Profile';

    // --- Data Loading & Refresh ---
    
    /**
     * Loads base user data and initial likes from the main dashboard object in localStorage.
     */
    const loadInitialData = useCallback(() => {
        const res = localStorage.getItem("data");
        const data = res ? JSON.parse(res) : null;
        if (data) {
            const usersData = data?.appData?.users || [];
            setUsers(usersData);
            
            const initialPosts = data?.appData?.posts || [];

            const initialLikes = {};
            const initialUserLikes = new Set();
            initialPosts.forEach(post => {
                initialLikes[post._id] = post.likes?.length || 0;
                if (post.likes?.includes(loggedInUserId)) {
                    initialUserLikes.add(post._id);
                }
            });
            setPostLikes(initialLikes);
            setUserLikes(initialUserLikes); 
            setPosts(initialPosts);
        }
    }, [loggedInUserId]);

    /**
     * Loads filtered posts from their specific localStorage cache key (e.g., 'posts_project').
     */
    const loadFilteredData = useCallback((type) => {
        if (type === 'all') {
            loadInitialData(); 
            return;
        }

        const cacheKey = `posts_${type}`;
        const cachedPostsJson = localStorage.getItem(cacheKey);
        
        // Ensure users are loaded for mapping postsWithAuthors before attempting to load posts
        const res = localStorage.getItem("data");
        const data = res ? JSON.parse(res) : null;
        if (data) {
            setUsers(data?.appData?.users || []);
        }

        if (cachedPostsJson) {
            try {
                const postsReceived = JSON.parse(cachedPostsJson);
                setPosts(postsReceived);
                
                // Update likes for the current filtered view without triggering a loop
                setUserLikes(prevUserLikes => {
                    const newLikes = new Set(prevUserLikes);
                    const initialLikes = {};
                    
                    postsReceived.forEach(post => { 
                        initialLikes[post._id] = post.likes?.length || 0;
                        const isUserLiking = post.likes?.includes(loggedInUserId);
                        
                        if (isUserLiking) {
                            newLikes.add(post._id);
                        } else {
                            newLikes.delete(post._id);
                        }
                    });
                    
                    setPostLikes(prev => ({ ...prev, ...initialLikes }));
                    return newLikes; 
                });

            } catch (e) {
                console.error("Failed to parse cached posts for", type, e);
                setPosts([]);
            }
        } else {
            setPosts([]);
        }

    }, [loggedInUserId, loadInitialData]);
    
    /**
     * Fetches data from the API and stores it in localStorage.
     */
    const refreshDashboardData = useCallback(async (type = 'all') => {
        if (!loggedInUserId) return; 

        setLoading(true); // <--- START LOADING

        try {
            let apiEndpoint = "http://localhost:4000/api/users/dashboard/full";
            if (type !== 'all') {
                apiEndpoint = `http://localhost:4000/api/posts?type=${type}&page=1&limit=100`; 
            }
            
            const res = await axios.get(apiEndpoint);
            
            if (res.status === 200) {
                
                // FIX: Access posts array from the 'posts' key, which is present in both API structures
                const postsReceived = Array.isArray(res.data?.posts) ? res.data.posts : [];
                
                if (type === 'all') {
                    // 1. Update main dashboard object in localStorage
                    const dashboardData = res.data;
                    const existingData = getAuthData();
                    const newData = { ...existingData, appData: dashboardData };
                    localStorage.setItem("data", JSON.stringify(newData));
                    
                    // 2. Load the updated data via initial loader
                    loadInitialData(); 
                    
                } else {
                    
                    // 1. Store filtered data in its own localStorage key
                    const cacheKey = `posts_${type}`;
                    localStorage.setItem(cacheKey, JSON.stringify(postsReceived));

                    // 2. Load the newly cached data
                    loadFilteredData(type);
                }
            }
        } catch (err) {
            console.error(`Failed to refresh dashboard data for type ${type}:`, err);
            loadFilteredData(type); 
        } finally {
            setLoading(false); // <--- STOP LOADING
        }
    }, [loggedInUserId, loadInitialData, loadFilteredData]); 

    // NEW: Function to fetch top rankers
    const fetchTopRankers = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/users/top-rankers");
            if (res.status === 200) {
                // The API returns an array directly, not nested
                setTopRankers(res.data || []); 
            }
        } catch (err) {
            console.error("Failed to fetch top rankers:", err);
            setTopRankers([]);
        }
    }, []);

    // EFFECT 1: Initial Load, Dark Mode, and Rankers Fetch
    useEffect(() => {
        loadInitialData();
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        
        // Fetch top rankers on initial load
        fetchTopRankers();

        // Also run a fresh fetch for all data to warm the cache
        const timer = setTimeout(() => refreshDashboardData('all'), 50);
        return () => clearTimeout(timer);
    }, [refreshDashboardData, loadInitialData, fetchTopRankers]);

    // EFFECT 2: Load data whenever the feed filter changes (reads from cache)
    useEffect(() => {
        // Load data from cache first, then run a refresh (API call) in the background
        loadFilteredData(feedFilter); 
        // We delay the refresh slightly to ensure loadFilteredData has run first
        const timer = setTimeout(() => refreshDashboardData(feedFilter), 10);
        return () => clearTimeout(timer);
    }, [feedFilter, loadFilteredData, refreshDashboardData]); 

    // EFFECT 3: URL/Query Parameter Handling
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const type = query.get('type');

        if (type === 'project' && !showModal && !showTypeSelectionModal) {
            setPostType('project');
            setShowModal(true);
            navigate(location.pathname, { replace: true });
        }
    }, [location.search, navigate, showModal, showTypeSelectionModal]);

    // --- Handlers (Memoized for Stability) ---
    
    // NEW HANDLER: To switch the feed type
    const handleFeedFilterChange = useCallback((type) => {
        if (type !== feedFilter) { 
            setFeedFilter(type);
            setOpenInteractionId(null); 
            setShowAllUsersId(null); 
        }
    }, [feedFilter]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePollChange = useCallback((index, value) => {
        setPollOptions((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    }, []);

    const addPollOption = useCallback(() => {
        if (pollOptions.length < 4) {
            setPollOptions((prev) => [...prev, ""]);
        }
    }, [pollOptions]);

    const handleSubmit = useCallback(async (e) => {
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
                // After creating a post, immediately refresh the current feed via API
                refreshDashboardData(feedFilter); 
                fetchTopRankers(); // Refresh rankers list
            }
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Failed to create post!");
        }
    }, [loggedInUserEmail, postType, formData, pollOptions, projectContact, refreshDashboardData, feedFilter, fetchTopRankers]); 

    const handleVote = useCallback(async (postId, optionIndex) => {
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
                refreshDashboardData(feedFilter); 
            }
        } catch (err) {
            console.error("Error voting:", err);
            const message = err.response?.data?.message || "Failed to register vote. Server error or invalid post.";
            alert(message);
        }
    }, [loggedInUserId, refreshDashboardData, feedFilter]); 

    const handleLikeToggle = useCallback(async (postId) => {
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

            // Optimistic UI update combined with state update
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
    }, [loggedInUserId]);


    const handleInteractionSubmission = useCallback(async (e, postId, isProject) => {
        e.preventDefault();
        if (!loggedInUserId) {
            alert("Please log in to submit.");
            return;
        }

        if (isProject) {
            const post = posts.find(p => p._id === postId);
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
                refreshDashboardData(feedFilter); 
            } catch (err) {
                console.error("Error submitting interest:", err);
                alert("Failed to register interest. Please try again.");
            }
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
                refreshDashboardData(feedFilter); 
            } catch (err) {
                console.error("Error submitting comment:", err);
                alert("Failed to submit comment. Please try again.");
            }
        }
    }, [loggedInUserId, loggedInUserEmail, commentText, refreshDashboardData, posts, data.user.name, feedFilter]); 


    const handleInteractionListToggle = useCallback((postId) => {
        if (openInteractionId === postId) {
            setOpenInteractionId(null);
        } else {
            setOpenInteractionId(postId);
        }
        setShowAllUsersId(null);
        setCommentText(""); 
    }, [openInteractionId]);

    const handlePostAction = useCallback((action, postId, authorContactLink = null) => {
        if (action === 'Contact' && authorContactLink) {
            window.open(authorContactLink, '_blank');
        } else if (action === 'Share') {
            alert(`Share Post ${postId} - feature coming soon!`);
        } else if (action === 'Create') {
            setShowTypeSelectionModal(true);
        }
    }, []);

    const handleTypeSelection = useCallback((type) => {
        setPostType(type);
        setShowTypeSelectionModal(false);
        setShowModal(true);
    }, []);

    const handleProfileRedirect = useCallback((author) => {
        setSelectedAuthor(null);
        navigate(`/profile/${author._id}`);
    }, [navigate]);

    // NEW HANDLER: For navigation to self profile from sidebar
    const handleSelfProfileClick = useCallback(() => {
        if (loggedInUserId) {
            navigate(`/profile/${loggedInUserId}`);
        } else {
            alert("Please log in to view your profile.");
        }
    }, [loggedInUserId, navigate]);


    // --- Helper Data (Memoized) ---
    // This is now stable as both posts and users states are explicitly updated 
    // before loadFilteredData returns.
    const postsWithAuthors = useMemo(() => {
        return posts.map((post) => {
            const author = users.find((u) => u._id === post.author); 
            return {
                ...post,
                author: author || { name: 'Unknown', email: 'N/A' }, 
                likes: post.likes?.length || 0,
                comments: post.comments || [],
                projectContactLink: post.projectContact || post.author?.linkedinId || null,
            };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [posts, users]);


    // --- Navigation Links Data ---
    const navLinks = [
        { type: 'all', label: 'Feed', icon: 'fas fa-home' },
        { type: 'project', label: 'Projects', icon: 'fas fa-lightbulb' },
        { type: 'blog', label: 'Blogs', icon: 'fas fa-newspaper' },
        { type: 'poll', label: 'Polls', icon: 'fas fa-poll' },
    ];

    // --- Main Component JSX ---

    return (
        <div className={`${darkMode ? "dark" : ""} font-sans`}>
            <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-[#121212] dark:text-gray-100">

                {/* 1. Fixed Left Sidebar */}
                <div className="hidden lg:block w-64 xl:w-72 h-[100vh-66px] border-r border-gray-900 dark:border-gray-800 p-4 shrink-0 overflow-y-auto bg-white dark:bg-[#1A1A1A]">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">CollegeHub</h1>
                    <div className="space-y-2">
                        {navLinks.map(({ type, label, icon }) => (
                            <div 
                                key={type}
                                onClick={() => handleFeedFilterChange(type)}
                                className={cn(
                                    "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-150 font-semibold",
                                    feedFilter === type
                                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-800"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <i className={icon}></i> <span>{label}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* UPDATED: Profile Button & Dark Mode Toggle */}
                    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                        <button
                            onClick={handleSelfProfileClick}
                            className="w-full flex items-center cursor-pointer justify-start space-x-3 p-2 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
                        >
                            <FaUser />
                            <span className="truncate">{loggedInUserName}</span>
                        </button>

                        <button
                            onClick={() => setDarkMode(p => !p)}
                            className="w-full flex items-center justify-center space-x-2 p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/70 text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            {darkMode ? <MdOutlineLightMode/> : <MdOutlineDarkMode/>}
                            <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
                        </button>
                    </div>

                </div>

                {/* 2. Scrollable Center Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-xl mx-auto">
                        {/* Current Filter Title */}
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 capitalize">
                            {feedFilter === 'all' ? 'Feed' : `${feedFilter} Posts`}
                        </h2>
                        
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
                                    className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                                >
                                    Create Post
                                </button>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {loading ? (
                                // RENDER SKELETONS WHEN LOADING
                                <>
                                    <PostSkeleton />
                                    <PostSkeleton />
                                    <PostSkeleton />
                                </>
                            ) : postsWithAuthors.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    No {feedFilter !== 'all' ? `${feedFilter} ` : ''}posts yet. Be the first to post!
                                </div>
                            ) : (
                                postsWithAuthors.map((post) => (
                                    <PostItem
                                        key={post._id}
                                        post={post}
                                        currentLikes={postLikes[post._id] !== undefined ? postLikes[post._id] : post.likes}
                                        isLiked={userLikes.has(post._id)}
                                        loggedInUserEmail={loggedInUserEmail}
                                        users={users}
                                        openInteractionId={openInteractionId}
                                        commentText={commentText}
                                        showAllUsersId={showAllUsersId}
                                        // Stable Handlers
                                        handleLikeToggle={handleLikeToggle}
                                        handleInteractionListToggle={handleInteractionListToggle}
                                        handleInteractionSubmission={handleInteractionSubmission}
                                        handlePostAction={handlePostAction}
                                        setSelectedAuthor={setSelectedAuthor}
                                        handleVote={handleVote}
                                        // State Setters (stable)
                                        setCommentText={setCommentText}
                                        setShowAllUsersId={setShowAllUsersId}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Right Sidebar (Top Rankers) */}
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
                                        className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                                        onClick={() => handleProfileRedirect(selectedAuthor)}
                                    >
                                        View Full Profile
                                    </button>
                                    <button
                                        className="bg-gray-200 cursor-pointer dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                                        onClick={() => setSelectedAuthor(null)}
                                    >
                                        Close Quick View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sticky top-4 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold mb-4 text-lg text-indigo-600 dark:text-indigo-400">🔥 Top 5 Rankers</h3>
                            <div className="space-y-4">
                                {/* RANKERS SKELETON: Show simple loading state for rankers */}
                                {loading ? (
                                    Array(5).fill(0).map((_, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-xl font-extrabold w-6 shrink-0 text-center text-gray-300 dark:text-gray-700">#</div>
                                                <div className="flex flex-col leading-tight space-y-1">
                                                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 space-y-1">
                                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-10"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : topRankers.length === 0 ? (
                                     <p className="text-sm text-gray-500 dark:text-gray-400 italic">No rankers found.</p>
                                ) : (
                                    topRankers.map((user, index) => (
                                        <div 
                                            key={user._id} 
                                            onClick={() => setSelectedAuthor(user)}
                                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={cn(
                                                    "text-xl font-extrabold w-6 shrink-0 text-center",
                                                    index === 0 ? "text-yellow-500" : 
                                                    index === 1 ? "text-gray-400" :
                                                    index === 2 ? "text-yellow-700 dark:text-yellow-600" :
                                                    "text-indigo-500"
                                                )}>
                                                    #{index + 1}
                                                </div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-sm font-semibold truncate max-w-[120px]">{user.name || 'Anonymous'}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-sm font-bold text-green-600 dark:text-green-400">{user.streak || 0}d streak</span>
                                                <span className="block text-xs text-gray-500 dark:text-gray-400">{user.postsCount || 0} posts</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- MODALS --- */}

                {/* Type Selection Modal */}
                {showTypeSelectionModal && (
                    <TypeSelectionModal
                        handleTypeSelection={handleTypeSelection}
                        setShowTypeSelectionModal={setShowTypeSelectionModal}
                    />
                )}

                {/* Specific Post Creation Modal */}
                {showModal && (
                    <PostCreationModal
                        postType={postType}
                        formData={formData}
                        pollOptions={pollOptions}
                        projectContact={projectContact}
                        handleInputChange={handleInputChange}
                        handlePollChange={handlePollChange}
                        addPollOption={addPollOption}
                        handleSubmit={handleSubmit}
                        setProjectContact={setProjectContact}
                        setShowModal={setShowModal}
                    />
                )}
            </div>
        </div>
    );
};

export default Feed;