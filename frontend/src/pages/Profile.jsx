import React from 'react'
import { useParams } from 'react-router-dom'
import { User, Linkedin, Github, Instagram } from 'lucide-react'; 

const Profile = () => {
  const { id } = useParams();
  const res = localStorage.getItem("data");
  const data = res ? JSON.parse(res) : null;
  const users = data?.appData?.users || [];

  // Find the correct user from local data (optimistic client-side render)
  const userData = users.find((u) => u._id === id);

  if (!userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 p-6 text-xl">
        User not found.
      </div>
    );
  }

  const cardClasses = 'bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-shadow duration-300';
  const headerClasses = 'text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800 text-indigo-600 dark:text-indigo-400';
  
  const memberSinceDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const skillsArray = userData.skills 
    ? userData.skills.split(',').map(s => s.trim()).filter(s => s !== "") 
    : [];

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
              <div className='text-3xl font-extrabold'>{userData.name}</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Member since <span>{memberSinceDate}</span>
              </div>
              <div className='text-md font-medium text-indigo-600 dark:text-indigo-400 mt-2'>{userData.email}</div>
            </div>

            {/* Social Links */}
            <div className='mt-6 border-t pt-4 border-gray-100 dark:border-gray-800'>
              <p className='text-lg font-semibold mb-3'>Connect</p>
              <div className='space-y-3'>
                {
                  [
                    { id: userData.linkedinId, name: 'LinkedIn', Icon: Linkedin, color: 'text-blue-600' },
                    { id: userData.github, name: 'Github', Icon: Github, color: 'text-gray-800 dark:text-gray-200' },
                    { id: userData.insta, name: 'Instagram', Icon: Instagram, color: 'text-pink-500' },
                  ].map(({ id: linkId, name, Icon, color }) => (
                    <div key={name} className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <Icon size={20} className={color} />
                            <span className='font-medium'>{name}</span>
                        </div>
                        {linkId ? (
                            <a href={linkId} className={`text-sm underline hover:opacity-80 transition-opacity ${color}`} target="_blank" rel="noreferrer">
                                View Profile ↗
                            </a>
                        ) : (
                            <p className='text-sm text-gray-400 dark:text-gray-600 italic'>Not added</p>
                        )}
                    </div>
                  ))
                }
              </div>
            </div>
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
                  { count: userData.postsCount || 0, label: 'Posts', color: 'text-indigo-600 dark:text-indigo-400' },
                  { count: userData.projectsCount || 0, label: 'Projects', color: 'text-green-600 dark:text-green-400' },
                  { count: userData.streak || 0, label: 'Streak', color: 'text-pink-600 dark:text-pink-400' },
                ].map((stat) => (
                  <div key={stat.label} className={`py-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm`}>
                    <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.count}</p>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>{stat.label}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* About me */}
          <div className={cardClasses}>
            <div className={headerClasses}>About Me</div>
            {userData.description ? <div className='whitespace-pre-line text-gray-700 dark:text-gray-300'>{userData.description}</div> : <p className='text-gray-500 dark:text-gray-400 italic'>Bio not added yet. Say something about yourself!</p>}
          </div>

          {/* Skills */}
          <div className={cardClasses}>
            <div className={headerClasses}>Skills & Technologies</div>
            {skillsArray.length > 0 ? (
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
          
          <div className={cardClasses}>
             <div className={headerClasses}>Recent Activity</div>
             <p className='text-gray-500 dark:text-gray-400 italic'>Future section for the user's latest posts or comments.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;