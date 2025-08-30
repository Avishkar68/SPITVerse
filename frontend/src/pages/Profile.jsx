// import React from 'react'
// const Profile = () => {
//   const res = localStorage.getItem("data")
//   const data = res ? JSON.parse(res) : null
//   const userData = data.user
//   console.log(userData);

//   return (
//     <div className='w-screen h-fit flex items-center justify-center pt-6 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 transition-colors duration-300'>
//       <div className='md:w-[900px] min-h-[600px] flex flex-col md:flex-row'>
//         <div className='w-fit md:w-[500px] m-2'>
//           <div className='p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl h-fit'>
//             <div className='w-full h-fit  flex flex-col justify-center items-center'>
//               <div className='w-[90px] h-[90px] rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//               </div>
//               <div className='text-3xl font-semibold mt-2'>{userData.name}</div>
//               <div className='text-sm text-black dark:text-[#ffffff69]'>Member since <span>{userData?.createdAt
//                 ? new Date(userData.createdAt).toLocaleString("en-IN", {
//                   timeZone: "Asia/Kolkata",
//                   day: "2-digit",
//                   month: "long",
//                   year: "numeric",

//                 })
//                 : "N/A"}</span></div>
//             </div>
//             <div>
//               <p className='text-xl font-semibold mt-2'>Social Links</p>
//               <div className='text-md mt-4'>
//                 {userData.linkedinId ? <a href={userData.linkedinId} className='flex items-center underline'>LinkedIn <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg></a> : <p>Not added yet</p>}
//               </div>
//               <div className='text-md mt-4'>
//                 {userData.github ? <a href={userData.github} className='flex items-center underline'>Github <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg></a> : <p>Not added yet</p>}
//               </div>
//               <div className='text-md mt-4'>
//                 <div></div>
//                 {userData.insta ? <a href={userData.insta} className='flex items-center underline'>Instagram <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg></a> : <p>Not added yet</p>}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='w-fit md:w-full h-fit '>
//           <div className='   m-2 mb-6 p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
//             <div className='text-xl font-semibold mt-2'>About me</div>
//             {userData.description ? <div>{userData.description}</div> : <p>Bio not added yet!</p>}
//           </div>
//           <div className='   m-2 mb-6 p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
//             <div className='text-xl font-semibold mt-2'>Skills & Technologies</div>
//             {userData.skills ? <div>{userData.skills}</div> : <p>No skills added yet!</p>}
//           </div>
//           <div className='   m-2 p-6 mb-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
//             <div className='text-xl font-semibold mt-2'>Activity stats</div>
//             <div className='w-full flex justify-center items-center  gap-20 '>
//               <div className='my-4 flex flex-col items-center justify-center '>
//                 <p className='text-3xl font-semibold text-[#1F5A96]'>{userData.postsCount}</p>
//                 <p>Posts</p>
//               </div>
//               <div className='my-4 flex flex-col items-center justify-center '>
//                 <p className='text-3xl font-semibold text-[#17914B]'>{userData.projectsCount}</p>
//                 <p>Projects</p>
//               </div>
//               <div className='my-4 flex flex-col items-center justify-center '>
//                 <p className='text-3xl font-semibold text-[#BB4DCD]'>{userData.streak}</p>
//                 <p>Streak</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile

import React from 'react'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const { id } = useParams();  // ✅ grab user id from URL
  const res = localStorage.getItem("data");
  const data = res ? JSON.parse(res) : null;
  const users = data?.appData?.users || []; // where all users are stored

  // ✅ find the correct user
  const userData = users.find((u) => u._id === id);

  if (!userData) {
    return <div className="p-6">User not found</div>;
  }

  return (
    <div className='w-screen h-fit flex items-center justify-center pt-6 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 transition-colors duration-300'>
      <div className='md:w-[900px] min-h-[600px] flex flex-col md:flex-row'>
        {/* left section */}
        <div className='w-fit md:w-[500px] m-2'>
          <div className='p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl h-fit'>
            <div className='w-full flex flex-col justify-center items-center'>
              {/* Avatar */}
              <div className='w-[90px] h-[90px] rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              {/* Name + join date */}
              <div className='text-3xl font-semibold mt-2'>{userData.name}</div>
              <div className='text-sm text-black dark:text-[#ffffff69]'>
                Member since{" "}
                <span>
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p className='text-xl font-semibold mt-2'>Social Links</p>
              <div className='text-md mt-4'>
                {userData.linkedinId ? (
                  <a href={userData.linkedinId} className='flex items-center underline' target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                ) : (
                  <p>Not added yet</p>
                )}
              </div>
              <div className='text-md mt-4'>
                {userData.github ? (
                  <a href={userData.github} className='flex items-center underline' target="_blank" rel="noreferrer">
                    Github ↗
                  </a>
                ) : (
                  <p>Not added yet</p>
                )}
              </div>
              <div className='text-md mt-4'>
                {userData.insta ? (
                  <a href={userData.insta} className='flex items-center underline' target="_blank" rel="noreferrer">
                    Instagram ↗
                  </a>
                ) : (
                  <p>Not added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className='w-fit md:w-full h-fit'>
          {/* About me */}
          <div className='m-2 mb-6 p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
            <div className='text-xl font-semibold mt-2'>About me</div>
            {userData.description ? <div>{userData.description}</div> : <p>Bio not added yet!</p>}
          </div>

          {/* Skills */}
          <div className='m-2 mb-6 p-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
            <div className='text-xl font-semibold mt-2'>Skills & Technologies</div>
            {userData.skills ? <div>{userData.skills}</div> : <p>No skills added yet!</p>}
          </div>

          {/* Activity stats */}
          <div className='m-2 p-6 mb-6 shadow-sm dark:shadow-[#ffffff26] rounded-xl'>
            <div className='text-xl font-semibold mt-2'>Activity stats</div>
            <div className='w-full flex justify-center items-center gap-20'>
              <div className='my-4 flex flex-col items-center justify-center'>
                <p className='text-3xl font-semibold text-[#1F5A96]'>{userData.postsCount}</p>
                <p>Posts</p>
              </div>
              <div className='my-4 flex flex-col items-center justify-center'>
                <p className='text-3xl font-semibold text-[#17914B]'>{userData.projectsCount}</p>
                <p>Projects</p>
              </div>
              <div className='my-4 flex flex-col items-center justify-center'>
                <p className='text-3xl font-semibold text-[#BB4DCD]'>{userData.streak}</p>
                <p>Streak</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Profile
