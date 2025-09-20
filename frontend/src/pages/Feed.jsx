// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Feed = () => {
//   const res = localStorage.getItem("data");
//   const data = res ? JSON.parse(res) : null;

//   // safe fallbacks
//   const posts = data?.appData?.posts || [];
//   const users = data?.appData?.users || [];

//   // merge posts with author info
//   const postsWithAuthors = posts.map((post) => {
//     const author = users.find((u) => u._id === post.author);
//     return { ...post, author: author || {} };
//   });

//   const [selectedAuthor, setSelectedAuthor] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const navigate = useNavigate();

//   const handleProfileRedirect = (author) => {
//     localStorage.setItem("selectedAuthor", JSON.stringify(author));
//     navigate(`/profile/${author._id}`);
//   };

//   return (
//     <div className={`${darkMode ? "dark" : ""}`}>
//       <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
//         {/* Left Sidebar - Author info */}
//         {selectedAuthor && (
//           <div className="w-1/4 bg-white dark:bg-gray-800 shadow-lg p-4 border-r border-gray-200 dark:border-gray-700">
//             <div className="text-center">
//               <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
//                 {selectedAuthor.name?.charAt(0) || "?"}
//               </div>
//               <h2 className="text-lg font-semibold">{selectedAuthor.name}</h2>
//               <p className="text-gray-600 dark:text-gray-400">{selectedAuthor.email}</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                 {selectedAuthor.description}
//               </p>

//               {/* Buttons */}
//               <div className="flex flex-col gap-2 mt-4">
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
//                   onClick={() => handleProfileRedirect(selectedAuthor)}
//                 >
//                   View Full Profile
//                 </button>
//                 <button
//                   className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow"
//                   onClick={() => setSelectedAuthor(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Right Side - Posts */}
//         <div className="flex-1 p-6 overflow-y-auto">
         

//           {postsWithAuthors.map((post) => (
//             <div
//               key={post._id}
//               className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700"
//             >
//               {/* Post Header */}
//               <div
//                 className="flex items-center mb-3 cursor-pointer"
//                 onClick={() => setSelectedAuthor(post.author)}
//               >
//                 <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-bold text-white">
//                   {post.author?.name?.charAt(0) || "?"}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-800 dark:text-gray-200">
//                     {post.author?.name || "Unknown"}
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{post.author?.email}</p>
//                 </div>
//               </div>

//               {/* Post Content */}
//               <h4 className="font-semibold mb-1">{post.title}</h4>
//               <p className="mb-2">{post.content}</p>

//               {/* If project */}
//               {post.type === "project" && (
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   <p>
//                     <strong>Aim:</strong> {post.projectAim}
//                   </p>
//                   <p>
//                     <strong>Requirements:</strong> {post.requirements?.join(", ")}
//                   </p>
//                   <p>
//                     <strong>People Needed:</strong> {post.desiredPeople}
//                   </p>
//                 </div>
//               )}

//               {/* If poll */}
//               {post.type === "poll" && (
//                 <div className="mt-2">
//                   <p className="font-semibold">Poll Options:</p>
//                   {post.pollOptions.map((opt) => (
//                     <p key={opt._id} className="text-sm">
//                       {opt.optionText} ({opt.votes} votes)
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feed;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Feed = () => {
//   const res = localStorage.getItem("data");
//   const data = res ? JSON.parse(res) : null;

//   const posts = data?.appData?.posts || [];
//   const users = data?.appData?.users || [];

//   const postsWithAuthors = posts.map((post) => {
//     const author = users.find((u) => u._id === post.author);
//     return { ...post, author: author || {} };
//   });

//   const [selectedAuthor, setSelectedAuthor] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);

//   // post creation
//   const [postType, setPostType] = useState("");
//   const [formData, setFormData] = useState({});
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const navigate = useNavigate();

//   const handleProfileRedirect = (author) => {
//     localStorage.setItem("selectedAuthor", JSON.stringify(author));
//     navigate(`/profile/${author._id}`);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const payload = {
//   //     authorEmail: "test@spit.ac.in",
//   //     type: postType,
//   //     title: formData.title,
//   //   };

//   //   if (postType === "blog") payload.content = formData.content;
//   //   if (postType === "poll")
//   //     payload.pollOptions = formData.pollOptions.split(",").map((o) => o.trim());
//   //   if (postType === "project") {
//   //     payload.projectAim = formData.projectAim;
//   //     payload.requirements = formData.requirements.split(",").map((r) => r.trim());
//   //     payload.desiredPeople = Number(formData.desiredPeople);
//   //   }

//   //   try {
//   //     const res = await fetch("/api/posts", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });
//   //     if (res.ok) {
//   //       alert("Post created!");
//   //       setFormData({});
//   //       setPostType("");
//   //       setShowModal(false);
//   //       window.location.reload();
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
//     authorEmail: data?.user?.email, // <- use logged-in user from backend/localStorage
//     type: postType,
//     title: formData.title,
//   };

//   if (postType === "blog") payload.content = formData.content;
//   if (postType === "poll")
//     payload.pollOptions = formData.pollOptions.split(",").map((o) => o.trim());
//   if (postType === "project") {
//     payload.projectAim = formData.projectAim;
//     payload.requirements = formData.requirements.split(",").map((r) => r.trim());
//     payload.desiredPeople = Number(formData.desiredPeople);
//   }

//   try {
//     const res = await fetch("http://localhost:4000/api/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       const newPost = await res.json();
//       setPosts((prev) => [...prev, newPost]); // ✅ update feed dynamically
//       setFormData({});
//       setPostType("");
//       setShowModal(false);
//     }
//   } catch (err) {
//     console.error("Error creating post:", err);
//   }
// };


//   return (
//     <div className={`${darkMode ? "dark" : ""}`}>
//       <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
//         {/* Sidebar */}
//         {selectedAuthor && (
//           <div className="w-1/4 bg-white dark:bg-gray-800 shadow-lg p-4 border-r border-gray-200 dark:border-gray-700">
//             <div className="text-center">
//               <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
//                 {selectedAuthor.name?.charAt(0) || "?"}
//               </div>
//               <h2 className="text-lg font-semibold">{selectedAuthor.name}</h2>
//               <p className="text-gray-600 dark:text-gray-400">{selectedAuthor.email}</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                 {selectedAuthor.description}
//               </p>

//               <div className="flex flex-col gap-2 mt-4">
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
//                   onClick={() => handleProfileRedirect(selectedAuthor)}
//                 >
//                   View Full Profile
//                 </button>
//                 <button
//                   className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow"
//                   onClick={() => setSelectedAuthor(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Right Side */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {/* Create Post Dropdown */}
//           <div className="relative mb-6">
//             <button
//               onClick={() => setOpenDropdown((p) => !p)}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
//             >
//               Create Post ▾
//             </button>
//             {openDropdown && (
//               <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("blog");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Blog
//                 </button>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("poll");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Poll
//                 </button>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("project");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Project
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Modal for Post Form */}
//           {showModal && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
//               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
//                 <h2 className="text-xl font-bold mb-4">
//                   Create {postType.charAt(0).toUpperCase() + postType.slice(1)}
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-3">
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Title"
//                     value={formData.title || ""}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                     required
//                   />

//                   {postType === "blog" && (
//                     <textarea
//                       name="content"
//                       placeholder="Write your blog..."
//                       value={formData.content || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                       required
//                     />
//                   )}

//                   {postType === "poll" && (
//                     <input
//                       type="text"
//                       name="pollOptions"
//                       placeholder="Poll options (comma separated)"
//                       value={formData.pollOptions || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                       required
//                     />
//                   )}

//                   {postType === "project" && (
//                     <>
//                       <input
//                         type="text"
//                         name="projectAim"
//                         placeholder="Project Aim"
//                         value={formData.projectAim || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                       <input
//                         type="text"
//                         name="requirements"
//                         placeholder="Requirements (comma separated)"
//                         value={formData.requirements || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                       <input
//                         type="number"
//                         name="desiredPeople"
//                         placeholder="People Needed"
//                         value={formData.desiredPeople || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                     </>
//                   )}

//                   <div className="flex justify-end gap-2">
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Posts */}
//           {postsWithAuthors.map((post) => (
//             <div
//               key={post._id}
//               className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700"
//             >
//               <div
//                 className="flex items-center mb-3 cursor-pointer"
//                 onClick={() => setSelectedAuthor(post.author)}
//               >
//                 <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-bold text-white">
//                   {post.author?.name?.charAt(0) || "?"}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">{post.author?.name || "Unknown"}</h3>
//                   <p className="text-sm text-gray-500">{post.author?.email}</p>
//                 </div>
//               </div>
//               <h4 className="font-semibold mb-1">{post.title}</h4>
//               <p className="mb-2">{post.content}</p>

//               {post.type === "project" && (
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   <p><strong>Aim:</strong> {post.projectAim}</p>
//                   <p><strong>Requirements:</strong> {post.requirements?.join(", ")}</p>
//                   <p><strong>People Needed:</strong> {post.desiredPeople}</p>
//                 </div>
//               )}

//               {post.type === "poll" && (
//                 <div className="mt-2">
//                   <p className="font-semibold">Poll Options:</p>
//                   {post.pollOptions.map((opt) => (
//                     <p key={opt._id || opt}>{opt.optionText || opt} ({opt.votes || 0} votes)</p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feed;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Feed = () => {
//   const res = localStorage.getItem("data");
//   const data = res ? JSON.parse(res) : null;

//   const posts = data?.appData?.posts || [];
//   const users = data?.appData?.users || [];

//   const postsWithAuthors = posts.map((post) => {
//     const author = users.find((u) => u._id === post.author);
//     return { ...post, author: author || {} };
//   });

//   const [selectedAuthor, setSelectedAuthor] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);

//   // post creation
//   const [postType, setPostType] = useState("");
//   const [formData, setFormData] = useState({});
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   // polls: dynamic options (start with 2)
//   const [pollOptions, setPollOptions] = useState(["", ""]);

//   const navigate = useNavigate();

//   const handleProfileRedirect = (author) => {
//     localStorage.setItem("selectedAuthor", JSON.stringify(author));
//     navigate(`/profile/${author._id}`);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePollChange = (index, value) => {
//     setPollOptions((prev) => {
//       const updated = [...prev];
//       updated[index] = value;
//       return updated;
//     });
//   };

//   const addPollOption = () => {
//     if (pollOptions.length < 4) {
//       setPollOptions([...pollOptions, ""]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       authorEmail: data?.user?.email,
//       type: postType,
//       title: formData.title,
//     };

//     if (postType === "blog") payload.content = formData.content;
//     if (postType === "poll") {
//       payload.pollOptions = pollOptions.filter((o) => o.trim() !== "");
//     }
//     if (postType === "project") {
//       payload.projectAim = formData.projectAim;
//       payload.requirements = formData.requirements
//         .split(",")
//         .map((r) => r.trim());
//       payload.desiredPeople = Number(formData.desiredPeople);
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const newPost = await res.json();
//         // TODO: fetch updated posts dynamically from API instead of reload
//         alert("Post created!");
//         setFormData({});
//         setPostType("");
//         setPollOptions(["", ""]); // reset poll options
//         setShowModal(false);
//       }
//     } catch (err) {
//       console.error("Error creating post:", err);
//     }
//   };

//   return (
//     <div className={`${darkMode ? "dark" : ""}`}>
//       <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
//         {/* Sidebar */}
//         {selectedAuthor && (
//           <div className="w-1/4 bg-white dark:bg-gray-800 shadow-lg p-4 border-r border-gray-200 dark:border-gray-700">
//             <div className="text-center">
//               <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
//                 {selectedAuthor.name?.charAt(0) || "?"}
//               </div>
//               <h2 className="text-lg font-semibold">{selectedAuthor.name}</h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {selectedAuthor.email}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                 {selectedAuthor.description}
//               </p>

//               <div className="flex flex-col gap-2 mt-4">
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
//                   onClick={() => handleProfileRedirect(selectedAuthor)}
//                 >
//                   View Full Profile
//                 </button>
//                 <button
//                   className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow"
//                   onClick={() => setSelectedAuthor(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Right Side */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {/* Create Post Dropdown */}
//           <div className="relative mb-6">
//             <button
//               onClick={() => setOpenDropdown((p) => !p)}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
//             >
//               Create Post ▾
//             </button>
//             {openDropdown && (
//               <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("blog");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Blog
//                 </button>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("poll");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Poll
//                 </button>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setPostType("project");
//                     setShowModal(true);
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Project
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Modal for Post Form */}
//           {showModal && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
//               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
//                 <h2 className="text-xl font-bold mb-4">
//                   Create {postType.charAt(0).toUpperCase() + postType.slice(1)}
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-3">
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Title"
//                     value={formData.title || ""}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                     required
//                   />

//                   {postType === "blog" && (
//                     <textarea
//                       name="content"
//                       placeholder="Write your blog..."
//                       value={formData.content || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                       required
//                     />
//                   )}

//                   {postType === "poll" && (
//                     <div className="space-y-2">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Poll Options (max 4)
//                       </p>
//                       {pollOptions.map((opt, idx) => (
//                         <input
//                           key={idx}
//                           type="text"
//                           placeholder={`Option ${idx + 1}`}
//                           value={opt}
//                           onChange={(e) => handlePollChange(idx, e.target.value)}
//                           className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         />
//                       ))}
//                       {pollOptions.length < 4 && (
//                         <button
//                           type="button"
//                           onClick={addPollOption}
//                           className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded"
//                         >
//                           + Add Option
//                         </button>
//                       )}
//                     </div>
//                   )}

//                   {postType === "project" && (
//                     <>
//                       <input
//                         type="text"
//                         name="projectAim"
//                         placeholder="Project Aim"
//                         value={formData.projectAim || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                       <input
//                         type="text"
//                         name="requirements"
//                         placeholder="Requirements (comma separated)"
//                         value={formData.requirements || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                       <input
//                         type="number"
//                         name="desiredPeople"
//                         placeholder="People Needed"
//                         value={formData.desiredPeople || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
//                         required
//                       />
//                     </>
//                   )}

//                   <div className="flex justify-end gap-2">
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Posts */}
//           {postsWithAuthors.map((post) => (
//             <div
//               key={post._id}
//               className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700"
//             >
//               <div
//                 className="flex items-center mb-3 cursor-pointer"
//                 onClick={() => setSelectedAuthor(post.author)}
//               >
//                 <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-bold text-white">
//                   {post.author?.name?.charAt(0) || "?"}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">{post.author?.name || "Unknown"}</h3>
//                   <p className="text-sm text-gray-500">{post.author?.email}</p>
//                 </div>
//               </div>
//               <h4 className="font-semibold mb-1">{post.title}</h4>
//               <p className="mb-2">{post.content}</p>

//               {post.type === "project" && (
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   <p><strong>Aim:</strong> {post.projectAim}</p>
//                   <p><strong>Requirements:</strong> {post.requirements?.join(", ")}</p>
//                   <p><strong>People Needed:</strong> {post.desiredPeople}</p>
//                 </div>
//               )}

//               {post.type === "poll" && (
//                 <div className="mt-2">
//                   <p className="font-semibold">Poll Options:</p>
//                   {post.pollOptions.map((opt) => (
//                     <p key={opt._id || opt}>
//                       {opt.optionText || opt} ({opt.votes || 0} votes)
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feed;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Feed = () => {
//   const res = localStorage.getItem("data");
//   const data = res ? JSON.parse(res) : null;

//   const [posts, setPosts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedAuthor, setSelectedAuthor] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);

//   // post creation
//   const [postType, setPostType] = useState("");
//   const [formData, setFormData] = useState({});
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [pollOptions, setPollOptions] = useState(["", ""]);

//   const navigate = useNavigate();

//   // Fetch posts and users dynamically on component mount
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/posts");
//         const postsData = response.data.posts || [];
//         const usersData = response.data.users || [];
//         setPosts(postsData);
//         setUsers(usersData);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const postsWithAuthors = posts.map((post) => {
//     const author = users.find((u) => u._id === post.author);
//     return { ...post, author: author || {} };
//   });

//   const handleProfileRedirect = (author) => {
//     localStorage.setItem("selectedAuthor", JSON.stringify(author));
//     navigate(`/profile/${author._id}`);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePollChange = (index, value) => {
//     setPollOptions((prev) => {
//       const updated = [...prev];
//       updated[index] = value;
//       return updated;
//     });
//   };

//   const addPollOption = () => {
//     if (pollOptions.length < 4) {
//       setPollOptions([...pollOptions, ""]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       authorEmail: data?.user?.email,
//       type: postType,
//       title: formData.title,
//     };

//     if (postType === "blog") payload.content = formData.content;
//     if (postType === "poll") {
//       payload.pollOptions = pollOptions.filter((o) => o.trim() !== "");
//     }
//     if (postType === "project") {
//       payload.projectAim = formData.projectAim;
//       payload.requirements = formData.requirements
//         .split(",")
//         .map((r) => r.trim());
//       payload.desiredPeople = Number(formData.desiredPeople);
//     }

//     try {
//       const res = await axios.post("http://localhost:4000/api/posts", payload, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.status === 200 || res.status === 201) {
//         alert("Post created!");
//         setFormData({});
//         setPostType("");
//         setPollOptions(["", ""]);
//         setShowModal(false);

//         // Append new post to the posts state dynamically
//         setPosts((prev) => [...prev, res.data]);
//       }
//     } catch (err) {
//       console.error("Error creating post:", err);
//       alert("Failed to create post!");
//     }
//   };

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [postType, setPostType] = useState("");
  const [formData, setFormData] = useState({});
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const navigate = useNavigate();

  // Fetch data from localStorage initially
  const loadLocalData = () => {
   const res = localStorage.getItem("data");
  const data = res ? JSON.parse(res) : null; 
     if (res) {
      const data = JSON.parse(res);
      setPosts(data?.appData?.posts || []);
      setUsers(data?.appData?.users || []);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  // Function to refresh dashboard data from API
  const refreshDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/dashboard/full");
      if (res.status === 200) {
        const dashboardData = res.data;

        // Store in localStorage in your format
        localStorage.setItem("data", JSON.stringify(dashboardData));

        // Update state
        setPosts(dashboardData?.appData?.posts || []);
        setUsers(dashboardData?.appData?.users || []);

        // Optionally refresh the page
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);
    }
  };

  // Call refreshDashboardData after post creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      authorEmail: data?.user?.email,
      type: postType,
      title: formData.title,
    };
    if (postType === "blog") payload.content = formData.content;
    if (postType === "poll") payload.pollOptions = pollOptions.filter((o) => o.trim() !== "");
    if (postType === "project") {
      payload.projectAim = formData.projectAim;
      payload.requirements = formData.requirements.split(",").map((r) => r.trim());
      payload.desiredPeople = Number(formData.desiredPeople);
    }

    try {
      const res = await axios.post("http://localhost:4000/api/posts", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Post created!");
        setFormData({});
        setPostType("");
        setPollOptions(["", ""]);
        setShowModal(false);

        // Refresh the entire dashboard
        refreshDashboardData();
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post!");
    }
  };

  const postsWithAuthors = posts.map((post) => {
    const author = users.find((u) => u._id === post.author);
    return { ...post, author: author || {} };
  });

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
    localStorage.setItem("selectedAuthor", JSON.stringify(author));
    navigate(`/profile/${author._id}`);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        {selectedAuthor && (
          <div className="w-1/4 bg-white dark:bg-gray-800 shadow-lg p-4 border-r border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                {selectedAuthor.name?.charAt(0) || "?"}
              </div>
              <h2 className="text-lg font-semibold">{selectedAuthor.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{selectedAuthor.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{selectedAuthor.description}</p>

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

        {/* Right Side */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Create Post Dropdown */}
          <div className="relative mb-6">
            <button
              onClick={() => setOpenDropdown((p) => !p)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Create Post ▾
            </button>
            {openDropdown && (
              <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {["blog", "poll", "project"].map((type) => (
                  <button
                    key={type}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setPostType(type);
                      setShowModal(true);
                      setOpenDropdown(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal for Post Form */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">
                  Create {postType.charAt(0).toUpperCase() + postType.slice(1)}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    required
                  />

                  {postType === "blog" && (
                    <textarea
                      name="content"
                      placeholder="Write your blog..."
                      value={formData.content || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      required
                    />
                  )}

                  {postType === "poll" && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Poll Options (max 4)
                      </p>
                      {pollOptions.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => handlePollChange(idx, e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                        />
                      ))}
                      {pollOptions.length < 4 && (
                        <button
                          type="button"
                          onClick={addPollOption}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded"
                        >
                          + Add Option
                        </button>
                      )}
                    </div>
                  )}

                  {postType === "project" && (
                    <>
                      <input
                        type="text"
                        name="projectAim"
                        placeholder="Project Aim"
                        value={formData.projectAim || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        name="requirements"
                        placeholder="Requirements (comma separated)"
                        value={formData.requirements || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="number"
                        name="desiredPeople"
                        placeholder="People Needed"
                        value={formData.desiredPeople || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Posts */}
          {postsWithAuthors.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700"
            >
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={() => setSelectedAuthor(post.author)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center text-lg font-bold text-white">
                  {post.author?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="font-semibold">{post.author?.name || "Unknown"}</h3>
                  <p className="text-sm text-gray-500">{post.author?.email}</p>
                </div>
              </div>
              <h4 className="font-semibold mb-1">{post.title}</h4>
              <p className="mb-2">{post.content}</p>

              {post.type === "project" && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Aim:</strong> {post.projectAim}</p>
                  <p><strong>Requirements:</strong> {post.requirements?.join(", ")}</p>
                  <p><strong>People Needed:</strong> {post.desiredPeople}</p>
                </div>
              )}

              {post.type === "poll" && (
                <div className="mt-2">
                  <p className="font-semibold">Poll Options:</p>
                  {post.pollOptions.map((opt) => (
                    <p key={opt._id || opt}>
                      {opt.optionText || opt} ({opt.votes || 0} votes)
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
