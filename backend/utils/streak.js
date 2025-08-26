// helper to update streak when user creates a post
// Accepts user doc, postDate (Date object), and returns updated fields {streak, lastPostDate}
const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear()
      && d1.getMonth() === d2.getMonth()
      && d1.getDate() === d2.getDate();
  };
  
  const isYesterday = (lastDate, nowDate) => {
    if (!lastDate) return false;
    const yesterday = new Date(nowDate);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(yesterday, lastDate);
  };
  
  export function computeUpdatedStreak(user, postDate = new Date()) {
    // user.lastPostDate may be null initially
    const last = user.lastPostDate ? new Date(user.lastPostDate) : null;
    let streak = user.streak || 0;
  
    if (last && isSameDay(last, postDate)) {
      // already posted today - keep unchanged
      return { streak, lastPostDate: last };
    }
  
    if (last && isYesterday(last, postDate)) {
      streak = (streak || 0) + 1;
    } else {
      // either no last post or gap more than one day -> reset to 1
      streak = 1;
    }
  
    return { streak, lastPostDate: postDate };
  }
  
  