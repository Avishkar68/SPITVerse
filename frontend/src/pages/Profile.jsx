import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Linkedin, Github, Instagram, Edit2, X, Check } from 'lucide-react'; 

// Placeholder for Input component (copied for completeness)
const Input = ({ type = 'text', value, onChange, placeholder, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-black dark:text-white
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none
                transition-colors duration-200 ${className}`}
  />
);


// --- Component: EditableSocials ---
const EditableSocials = React.memo(({ userData, updateProfileData, isSelf }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        linkedinId: userData.linkedinId || '',
        github: userData.github || '',
        insta: userData.insta || '',
    });

    useEffect(() => {
        // Re-sync form state when userData changes from outside
        setForm({
            linkedinId: userData.linkedinId || '',
            github: userData.github || '',
            insta: userData.insta || '',
        });
    }, [userData]);

    const handleSave = useCallback(() => {
        // Only submit the social fields
        updateProfileData(form);
        setIsEditing(false);
    }, [form, updateProfileData]);

    const socialLinks = [
        { key: 'linkedinId', name: 'LinkedIn', Icon: Linkedin, color: 'text-blue-600', placeholder: 'https://linkedin.com/in/user' },
        { key: 'github', name: 'Github', Icon: Github, color: 'text-gray-800 dark:text-gray-200', placeholder: 'https://github.com/user' },
        { key: 'insta', name: 'Instagram', Icon: Instagram, color: 'text-pink-500', placeholder: 'https://instagram.com/user' },
    ];

    return (
        <div className='mt-6 border-t pt-4 border-gray-100 dark:border-gray-800'>
            <div className='flex justify-between items-center mb-3'>
                <p className='text-lg font-semibold'>Connect</p>
                {isSelf && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="p-1 rounded-full text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    </button>
                )}
            </div>
            
            <div className='space-y-3'>
                {socialLinks.map(({ key, name, Icon, color, placeholder }) => (
                    <div key={key} className='flex flex-col'>
                        <div className='flex items-center space-x-2 mb-1'>
                            <Icon size={20} className={color} />
                            <span className='font-medium'>{name}</span>
                        </div>
                        {isEditing ? (
                            <Input
                                type="url"
                                placeholder={placeholder}
                                value={form[key]}
                                onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                            />
                        ) : (
                            userData[key] ? (
                                <a 
                                    href={userData[key]} 
                                    className={`text-sm underline hover:opacity-80 transition-opacity ${color} truncate`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                >
                                    {userData[key]} ↗
                                </a>
                            ) : (
                                <p className='text-sm text-gray-400 dark:text-gray-600 italic'>Not added</p>
                            )
                        )}
                    </div>
                ))}
                {isEditing && (
                    <button 
                        onClick={() => { 
                            setIsEditing(false); 
                            setForm({
                                linkedinId: userData.linkedinId || '', 
                                github: userData.github || '', 
                                insta: userData.insta || ''
                            }); 
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={16} className='inline mr-1' /> Cancel
                    </button>
                )}
            </div>
        </div>
    );
});


// --- Component: EditableBio ---
const EditableBio = React.memo(({ userData, updateProfileData, headerClasses, cardClasses, isSelf }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(userData.description || '');

    useEffect(() => {
        setBio(userData.description || '');
    }, [userData]);

    const handleSave = useCallback(() => {
        updateProfileData({ description: bio });
        setIsEditing(false);
    }, [bio, updateProfileData]);

    return (
        <div className={cardClasses}>
            <div className='flex justify-between items-center'>
                <div className={headerClasses}>About Me</div>
                {isSelf && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="p-1 rounded-full text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio here..."
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                />
            ) : (
                userData.description ? 
                <div className='whitespace-pre-line text-gray-700 dark:text-gray-300'>{userData.description}</div> 
                : <p className='text-gray-500 dark:text-gray-400 italic'>Bio not added yet. Say something about yourself!</p>
            )}

            {isEditing && (
                <button 
                    onClick={() => { setIsEditing(false); setBio(userData.description || ''); }}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
                >
                    <X size={16} className='inline mr-1' /> Cancel
                </button>
            )}
        </div>
    );
});


// --- Component: EditableSkills ---
const EditableSkills = React.memo(({ userData, updateProfileData, headerClasses, cardClasses, isSelf }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [skillString, setSkillString] = useState(userData.skills || ''); 

    useEffect(() => {
        setSkillString(userData.skills || '');
    }, [userData]);

    // Parse the skill string for display
    const skillsArray = skillString 
        ? skillString.split(',').map(s => s.trim()).filter(s => s !== "") 
        : [];

    const handleSave = useCallback(() => {
        updateProfileData({ skills: skillString });
        setIsEditing(false);
    }, [skillString, updateProfileData]);

    return (
        <div className={cardClasses}>
          
            <div className='flex justify-between items-center'>
                <div className={headerClasses}>Skills & Technologies  
                    {isSelf && (
                        <span className='text-sm text-white/20 font-thin px-2'> Add skills using , in between</span>
                    )}
                </div> 
                {isSelf && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="p-1 rounded-full text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    </button>
                )}
            </div>
         
            {isEditing ? (
                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder="Add skills separated by commas (e.g., React, Node, MongoDB)"
                        value={skillString}
                        onChange={(e) => setSkillString(e.target.value)}
                    />
                    <button 
                        onClick={() => { setIsEditing(false); setSkillString(userData.skills || ''); }}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={16} className='inline mr-1' /> Cancel
                    </button>
                </div>
            ) : skillsArray.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {skillsArray.map((skill, index) => (
                        <span 
                            key={index} 
                            className='px-3 py-1 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-medium rounded-full'
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 dark:text-gray-400 italic'>No skills added yet! Add some to collaborate better.</p>
            )}
        </div>
    );
});


// --- Component: InteractiveProfilePostCard (Handles local state and interactions) ---
const InteractiveProfilePostCard = ({ post: initialPost, loggedInUserId, fetchUserProfile, postAuthorName }) => {
    // Use local state to manage the post's dynamic data (likes, comments)
    const [post, setPost] = useState(initialPost);
    const [commentText, setCommentText] = useState('');
    // State to toggle visibility of comments/interest list
    const [showInteractionList, setShowInteractionList] = useState(false); 
    
    const isProject = post.type === 'project';
    const postDate = new Date(post.createdAt).toLocaleDateString();

    // Determine if the logged-in user has liked this specific post
    const isLiked = post.likes?.includes(loggedInUserId);
    // Determine if the logged-in user is interested in this specific project
    const loggedInUserIsInterested = isProject && post.comments?.some(c => c.user === loggedInUserId);
    
    // Sync local state when initialPost changes from parent fetch
    useEffect(() => {
        setPost(initialPost);
    }, [initialPost]);

    // Memoize comments/interest list for stable rendering
    const interactionList = useMemo(() => post.comments || [], [post.comments]);

    const handleLikeToggle = useCallback(async () => {
        if (!loggedInUserId) {
            alert("Please log in to like a post.");
            return;
        }

        try {
            const apiEndpoint = `http://localhost:4000/api/posts/${post._id}/like`;
            const response = await axios.post(apiEndpoint, { userId: loggedInUserId });

            // Update local post state immediately for quick feedback
            const { isLiked } = response.data;
            setPost(prevPost => {
                const newLikes = new Set(prevPost.likes || []);
                const updatedLikesArray = Array.from(newLikes);
                
                if (isLiked) {
                    updatedLikesArray.push(loggedInUserId);
                } else {
                    const index = updatedLikesArray.indexOf(loggedInUserId);
                    if (index > -1) updatedLikesArray.splice(index, 1);
                }
                
                return { ...prevPost, likes: updatedLikesArray };
            });
            
            // Re-fetch the full profile data to update user stats/counts
            fetchUserProfile();

        } catch (error) {
            console.error("Like API failed:", error);
            alert("Failed to toggle like. Please try again.");
        }
    }, [post._id, loggedInUserId, fetchUserProfile]);


    const handleInteractionSubmission = useCallback(async (e) => {
        e.preventDefault();
        if (!loggedInUserId) {
            alert("Please log in to submit.");
            return;
        }

        if (isProject) {
            if (loggedInUserIsInterested) return;

            try {
                const payload = {
                    userId: loggedInUserId,
                    userEmail: post.authorEmail, 
                    text: `Interested! ${postAuthorName || 'A user'} is looking to join.` 
                };
                await axios.post(`http://localhost:4000/api/posts/${post._id}/comments`, payload);
                alert("Interest registered! The creator has been notified.");
                setShowInteractionList(true); // Show list after registering interest

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
                    userEmail: post.authorEmail, 
                    text: commentText.trim()
                };
                await axios.post(`http://localhost:4000/api/posts/${post._id}/comments`, payload);
                alert("Comment posted!");
                setCommentText("");
                setShowInteractionList(true); // Show comments after posting
            } catch (err) {
                console.error("Error submitting comment:", err);
                alert("Failed to submit comment. Please try again.");
            }
        }
        // Always re-fetch user profile after successful interaction to update comment/interest counts
        fetchUserProfile(); 
    }, [post._id, loggedInUserId, isProject, loggedInUserIsInterested, commentText, fetchUserProfile, post.authorEmail, postAuthorName]);
    
    return (
        <div className="bg-white dark:bg-[#1A1A1A] shadow-lg rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            {/* Header / Type */}
            <div className='flex items-center justify-between mb-2'>
                <span className='text-xs font-medium text-indigo-500 dark:text-indigo-400 capitalize px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-gray-700'>
                    {post.type}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>{postDate}</span>
            </div>

            {/* Title and Content */}
            <h4 className='font-bold text-lg mb-2'>{post.title}</h4>
            
            {isProject ? (
                <div className="p-2 bg-indigo-50 dark:bg-gray-800/50 rounded-lg text-sm space-y-1">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400">Project Call</p>
                    <p>
                        <strong className="font-semibold">Aim:</strong> {post.projectAim}
                    </p>
                    <p>
                        <strong className="font-semibold">Requirements:</strong> <span className="text-xs italic bg-indigo-100 dark:bg-gray-700/50 px-2 py-0.5 rounded">{post.requirements?.join(", ")}</span>
                    </p>
                    <p>
                        <strong className="font-semibold">Status:</strong> {post.isOpen ? 'Open' : 'Closed'}
                    </p>
                </div>
            ) : (
                <p className='mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-3'>
                    {post.content || "No content provided."}
                </p>
            )}
            
            {/* Poll Options Display (simplified for profile) */}
            {post.type === "poll" && post.pollOptions?.length > 0 && (
                <div className="mt-3 space-y-2">
                    <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Poll Summary:</p>
                    {post.pollOptions.map((opt, idx) => (
                        <div
                            key={opt._id || idx}
                            className="w-full text-left p-2 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-800"
                        >
                            <span className="font-medium text-sm">{opt.optionText || opt}</span>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{opt.votes || 0} votes</span>
                        </div>
                    ))}
                </div>
            )}


            {/* Footer Action Bar (Interactive) */}
            <div className="flex justify-start space-x-6 mt-4 border-t pt-3 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                {/* Likes */}
                <button
                    className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                    onClick={handleLikeToggle}
                >
                    <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                    <span className="text-sm font-medium">{post.likes?.length || 0} Likes</span>
                </button>

                {/* Comments/Interest Toggle */}
                {isProject ? (
                    <>
                     <button
                        className={`flex items-center space-x-1 transition-colors ${loggedInUserIsInterested ? 'text-green-600/50' : 'hover:text-green-600'}`}
                        onClick={handleInteractionSubmission}
                        disabled={loggedInUserIsInterested}
                    >
                        <i className="fas fa-user-plus"></i>
                        <span className="text-sm font-medium">{loggedInUserIsInterested ? 'Interested' : 'Register Interest'}</span>
                    </button>
                    {/* NEW: Button to view Interested Users List */}
                    <button 
                        className={`flex items-center space-x-1 transition-colors ${showInteractionList ? 'text-green-600' : 'hover:text-green-600'}`}
                        onClick={() => setShowInteractionList(p => !p)} 
                    >
                        <i className="fas fa-users"></i>
                        <span className="text-sm font-medium">{interactionList.length} Interested</span>
                    </button>
                    </>
                ) : (
                    <button 
                        className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                        onClick={() => setShowInteractionList(p => !p)} // TOGGLE COMMENTS/INTEREST LIST VISIBILITY
                    >
                        <i className="fas fa-comment text-indigo-500"></i>
                        <span className="text-sm font-medium">{interactionList.length} Comments</span>
                    </button>
                )}
            </div>
            
            {/* Comment Input (Non-Project only) */}
            {!isProject && (
                <form onSubmit={handleInteractionSubmission} className="flex items-center space-x-2 pt-3">
                    <Input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-grow h-8"
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </form>
            )}

            {/* NEW: Interaction List Display Section (Comments or Interested Users) */}
            {showInteractionList && interactionList.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3 max-h-48 overflow-y-auto">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {isProject ? 'Interested Users' : 'Recent Comments'} ({interactionList.length})
                    </h5>
                    {interactionList.slice().reverse().map((item, index) => (
                        <div 
                            key={item._id || index} 
                            className={`text-xs p-2 rounded-lg ${isProject ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                        >
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {isProject && <i className="fas fa-check-circle mr-1 text-green-600 dark:text-green-400"></i>}
                                {item.userEmail || "Anonymous"}
                            </div>
                            {!isProject && (
                                <p className="text-gray-700 dark:text-gray-300 mt-0.5 font-normal whitespace-pre-line">
                                    {item.text}
                                </p>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// ------------------------------------------------
// --- NEW Component: ProfileSkeleton ---
// ------------------------------------------------
const ProfileSkeleton = ({ cardClasses }) => (
    <div className='w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-6 animate-pulse'>
        
        {/* Left Column Skeleton */}
        <div className='lg:w-1/3 shrink-0 space-y-6'>
            <div className={`${cardClasses} lg:sticky lg:top-10`}> 
                {/* Avatar & Name Skeleton */}
                <div className='w-full flex flex-col justify-center items-center text-center'>
                    <div className='w-[100px] h-[100px] rounded-full bg-gray-300 dark:bg-gray-700 shadow-xl mb-4'></div>
                    <div className='h-7 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-2'></div>
                    <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-28 mb-3'></div>
                    <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-48'></div>
                </div>

                {/* Social Links Skeleton */}
                <div className='mt-6 border-t pt-4 border-gray-100 dark:border-gray-800 space-y-3'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-3'></div>
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className='space-y-1'>
                            <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-24'></div>
                            <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded w-full'></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column Skeleton */}
        <div className='lg:w-2/3 space-y-6'>
            
            {/* Activity Stats Skeleton */}
            <div className={`${cardClasses} p-6`}>
                <div className='h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4 border-b pb-2 border-gray-100 dark:border-gray-800'></div>
                <div className='grid grid-cols-3 gap-4 text-center'>
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className={`py-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm space-y-2`}>
                            <div className='h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto'></div>
                            <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto'></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* About me Skeleton */}
            <div className={cardClasses}>
                <div className='h-5 bg-gray-300 dark:bg-gray-700 rounded w-28 mb-4 border-b pb-2 border-gray-100 dark:border-gray-800'></div>
                <div className='space-y-2'>
                    <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-full'></div>
                    <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-11/12'></div>
                    <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6'></div>
                    <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-full'></div>
                </div>
            </div>
          
            {/* Skills Skeleton */}
            <div className={cardClasses}>
                <div className='h-5 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4 border-b pb-2 border-gray-100 dark:border-gray-800'></div>
                <div className='flex flex-wrap gap-2'>
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className='h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
                    ))}
                </div>
            </div>

            {/* Posts Container Skeleton (3 post cards) */}
            <div className={cardClasses}>
                <div className='h-5 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4 border-b pb-2 border-gray-100 dark:border-gray-800'></div>
                <div className='space-y-4 max-h-[500px] overflow-y-hidden pr-2'> 
                    {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 shadow-lg rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
                            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4'></div>
                            <div className='h-5 bg-gray-300 dark:bg-gray-700 rounded w-full'></div>
                            <div className='h-3 bg-gray-200 dark:bg-gray-800 rounded w-full'></div>
                            <div className='h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2'></div>
                            <div className='flex space-x-4 pt-2'>
                                <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/5'></div>
                                <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


// ------------------------------------------------
// --- Main Component: Profile ---
// ------------------------------------------------

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false);

  // --- Utility Functions ---
  const getAuthData = () => {
    const res = localStorage.getItem("data");
    return res ? JSON.parse(res) : null;
  };

  // --- Data Fetching ---
  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    const authData = getAuthData();
    const loggedInUserId = authData?.user?._id;

    const selfCheck = id === loggedInUserId;
    setIsSelf(selfCheck);

    try {
      // API call to fetch user profile by ID
      const res = await axios.get(`http://localhost:4000/api/users/profile?id=${id}`);
      if (res.status === 200) {
        setUserData(res.data.user);
        
        // Optimistically update local storage users list 
        if (authData && authData.appData && authData.appData.users) {
          const updatedUsers = authData.appData.users.map(u => 
            u._id === res.data.user._id ? res.data.user : u
          );
          const newAuthData = { ...authData, appData: { ...authData.appData, users: updatedUsers } };
          localStorage.setItem("data", JSON.stringify(newAuthData));
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // --- Profile Update Handler ---
  const updateProfileData = useCallback(async (updates) => {
    // Only allow update if this is the self-profile view
    if (!isSelf || !userData) return;

    try {
      // Sanitize updates: only send non-empty updates, but allow clearing description/skills
      const sanitizedUpdates = Object.keys(updates).reduce((acc, key) => {
          if (updates[key] !== undefined) {
              acc[key] = updates[key];
          }
          return acc;
      }, {});
      
      // Use ID for update if available, fall back to email if necessary, though ID is preferred
      const queryParam = userData._id ? `id=${userData._id}` : `email=${userData.email}`;
      
      const res = await axios.put(`http://localhost:4000/api/users/profile?${queryParam}`, sanitizedUpdates);

      if (res.status === 200) {
        alert("Profile updated successfully!");
        // Update local state and trigger re-render
        setUserData(res.data.user);
        
        // Re-fetch the full profile to ensure all related data is current
        fetchUserProfile(); 
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  }, [userData, isSelf, fetchUserProfile]);


  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);


  const cardClasses = 'bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-shadow duration-300';
  const headerClasses = 'text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800 text-indigo-600 dark:text-indigo-400';
  
  if (isLoading) {
    // RENDER PROFILE SKELETON DURING LOADING
    return (
        <div className='min-h-screen flex items-start justify-center pt-10 pb-10 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 font-sans'>
            <ProfileSkeleton cardClasses={cardClasses} />
        </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 p-6 text-xl">
        User not found.
      </div>
    );
  }

  const memberSinceDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  
  // Prepare user data for display/editing
  const displayUserData = {
      ...userData,
      skills: userData.skills || "", // Ensure skills is a string
      posts: userData.posts || [] // Ensure posts is an array
  };

  const authData = getAuthData();
  const loggedInUser = authData?.user;


  return (
    <div className='min-h-screen flex items-start justify-center pt-10 pb-10 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 font-sans'>
      {/* Centered Main Container */}
      <div className='w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-6'>
        
        {/* Left Column (Profile Info) */}
        <div className='lg:w-1/3 shrink-0 space-y-6'>
          <div className={`${cardClasses} lg:sticky lg:top-10`}> 
            {/* Avatar & Name */}
            <div className='w-full flex flex-col justify-center items-center text-center'>
              <div className='w-[100px] h-[100px] rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl mb-4'>
                <User size={50} color="white" strokeWidth={1.5} />
              </div>
              <div className='text-3xl font-extrabold'>{displayUserData.name}</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Member since <span>{memberSinceDate}</span>
              </div>
              <div className='text-md font-medium text-indigo-600 dark:text-indigo-400 mt-2'>{displayUserData.email}</div>
            </div>

            {/* Social Links (Editable) */}
            <EditableSocials 
                userData={displayUserData} 
                updateProfileData={updateProfileData}
                isSelf={isSelf} 
            />
            
          </div>
        </div>

        {/* Right Column (Details) */}
        <div className='lg:w-2/3 space-y-6'>
          
          {/* Activity Stats */}
          <div className={`${cardClasses} p-6`}>
            <div className={headerClasses}>Activity Summary</div>
            <div className='grid grid-cols-3 gap-4 text-center'>
              {
                [
                  { count: displayUserData.postsCount || 0, label: 'Posts', color: 'text-indigo-600 dark:text-indigo-400' },
                  { count: displayUserData.projectsCount || 0, label: 'Projects', color: 'text-green-600 dark:text-green-400' },
                  { count: displayUserData.streak || 0, label: 'Streak', color: 'text-pink-600 dark:text-pink-400' },
                ].map((stat) => (
                  <div key={stat.label} className={`py-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm`}>
                    <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.count}</p>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>{stat.label}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* About me (Editable) */}
          <EditableBio 
            userData={displayUserData} 
            updateProfileData={updateProfileData}
            headerClasses={headerClasses}
            cardClasses={cardClasses}
            isSelf={isSelf}
          />
        
          {/* Skills (Editable) */}
          <EditableSkills 
            userData={displayUserData} 
            updateProfileData={updateProfileData}
            headerClasses={headerClasses}
            cardClasses={cardClasses}
            isSelf={isSelf}
          />

          {/* Posts Container (All posts displayed here) */}
          <div className={cardClasses}>
            <div className={headerClasses}>{displayUserData.name}'s Posts ({displayUserData.posts.length})</div>
            
            {displayUserData.posts.length > 0 ? (
                // Display posts in a vertical stack (space-y-4) within the card
                <div className='space-y-4 max-h-[500px] overflow-y-auto pr-2'> 
                    {displayUserData.posts.map((post) => (
                        // Using the new InteractiveProfilePostCard
                        <InteractiveProfilePostCard 
                            key={post._id} 
                            post={post} 
                            loggedInUserId={loggedInUser?._id}
                            fetchUserProfile={fetchUserProfile}
                            postAuthorName={displayUserData.name} // Pass the author's name for comment context
                        />
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 dark:text-gray-400 italic'>This user has not created any posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;