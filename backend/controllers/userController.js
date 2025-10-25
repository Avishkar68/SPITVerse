import User from '../models/User.js';
import Post from '../models/Post.js';

// Get a user profile (by userId or email) and include their posts
const getProfile = async (req, res) => {
  try {
    const { id, email } = req.query;
    let user;
    if (id) user = await User.findById(id).lean();
    else if (email) user = await User.findOne({ email }).lean();
    else return res.status(400).json({ message: 'Provide id or email' });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).lean();
    user.posts = posts;
    delete user.passwordHash;
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, email } = req.query;
    const update = req.body;
    if (!id && !email) return res.status(400).json({ message: 'Provide id or email to update' });

    const filter = id ? { _id: id } : { email };
    const allowedFields = ['name','linkedinId','insta','github','description','socials'];
    const sanitized = {};
    for (const k of allowedFields) if (update[k] !== undefined) sanitized[k] = update[k];

    const user = await User.findOneAndUpdate(filter, { $set: sanitized }, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    delete user.passwordHash;
    return res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAggregateDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const activeProjects = await Post.countDocuments({ type: 'project', isOpen: true });

    const windowDays = 30;
    const from = new Date();
    from.setDate(from.getDate() - windowDays);
    const activeUsers = await User.countDocuments({ lastPostDate: { $gte: from } });

    return res.json({
      totalUsers,
      totalPosts,
      activeProjects,
      activeUsers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getFullDB = async (req, res) => {
  try {
    const users = await User.find().lean();
    const posts = await Post.find().lean();
    const comments = [];

    posts.forEach(p => {
      if (p.comments && p.comments.length) {
        p.comments.forEach(c => {
          comments.push({ ...c, postId: p._id });
        });
      }
    });

    const safeUsers = users.map(u => {
      const uu = { ...u };
      delete uu.passwordHash;
      return uu;
    });

    return res.json({ users: safeUsers, posts, comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getTopRankers = async (req, res) => {
  try {
    const topRankers = await User.find({})
      .sort({ streak: -1, postsCount: -1 }) // Sort by streak descending, then postsCount descending
      .limit(5)
      .select('name email streak postsCount') // Select only necessary fields
      .lean();
    
    return res.json(topRankers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching rankers' });
  }
};



export default {
  getProfile,
  updateProfile,
  getAggregateDashboard,
  getFullDB,
  getTopRankers // Export the new function
};


