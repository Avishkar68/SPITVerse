import Post from '../models/Post.js';
import User from '../models/User.js';
import { computeUpdatedStreak } from '../utils/streak.js';

// Create a post (any type). Requires authorEmail and type
const createPost = async (req, res) => {
  try {
    const { authorEmail, type } = req.body;
    if (!authorEmail || !type) {
      return res.status(400).json({ message: 'authorEmail and type required' });
    }

    const user = await User.findOne({ email: authorEmail });
    if (!user) {
      return res.status(404).json({ message: 'Author not found. Ask them to login first.' });
    }

    const postData = {
      author: user._id,
      authorEmail,
      type,
      title: req.body.title || '',
      content: req.body.content || ''
    };

    if (type === 'poll') {
      const options = req.body.pollOptions || [];
      if (!Array.isArray(options) || options.length < 2 || options.length > 4) {
        return res.status(400).json({ message: 'Poll must have 2 to 4 options' });
      }
      postData.pollOptions = options.map(opt => ({ optionText: opt }));
    } else if (type === 'project') {
      postData.projectAim = req.body.projectAim || '';
      postData.requirements = req.body.requirements || [];
      postData.desiredPeople = req.body.desiredPeople || 0;
      postData.currentPeople = req.body.currentPeople || 0;
      postData.isOpen = true;
    }

    const post = new Post(postData);
    await post.save();

    // update user stats
    user.posts.push(post._id);
    user.postsCount = (user.postsCount || 0) + 1;
    if (type === 'project') {
      user.projectsCount = (user.projectsCount || 0) + 1;
    }

    // streak update
    const { streak, lastPostDate } = computeUpdatedStreak(user, new Date());
    user.streak = streak;
    user.lastPostDate = lastPostDate;

    await user.save();

    return res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Fetch posts paginated
const getPosts = async (req, res) => {
  try {
    const { type, authorEmail, isOpen, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (authorEmail) filter.authorEmail = authorEmail;
    if (isOpen !== undefined) filter.isOpen = isOpen === 'true';

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Post.countDocuments(filter);

    return res.json({ posts, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userEmail, text } = req.body;
    if (!postId || !userId || !text) {
      return res.status(400).json({ message: 'postId, userId and text required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, userEmail, text, createdAt: new Date() });
    post.updatedAt = new Date();
    await post.save();

    return res.json({
      message: 'Comment added',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Vote in poll
const votePoll = async (req, res) => {
  try {
    const { postId } = req.params;
    const { optionIndex } = req.body;
    if (optionIndex === undefined) {
      return res.status(400).json({ message: 'optionIndex required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.type !== 'poll') return res.status(400).json({ message: 'Not a poll' });

    if (optionIndex < 0 || optionIndex >= post.pollOptions.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    post.pollOptions[optionIndex].votes =
      (post.pollOptions[optionIndex].votes || 0) + 1;
    post.updatedAt = new Date();
    await post.save();

    return res.json({ message: 'Voted', pollOptions: post.pollOptions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Close project
const closeProject = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.type !== 'project') {
      return res.status(400).json({ message: 'Not a project post' });
    }

    post.isOpen = false;
    post.updatedAt = new Date();
    await post.save();

    const user = await User.findById(post.author);
    if (user) {
      user.projectsCount = Math.max(0, (user.projectsCount || 1) - 1);
      await user.save();
    }

    return res.json({ message: 'Project closed', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export { createPost, getPosts, addComment, votePoll, closeProject };
