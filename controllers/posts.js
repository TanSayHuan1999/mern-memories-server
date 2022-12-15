import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 3;
    const SKIP = (Number(page) - 1) * LIMIT || 0;

    const totalPosts = await PostMessage.countDocuments({});

    // order by createdAt DESC
    const posts = await PostMessage.find().sort({ createdAt: -1 }).skip(SKIP).limit(LIMIT);

    res.status(200).json({ posts, totalPosts, currentPage: Number(page), totalPage: Math.ceil(totalPosts / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// QUERY -> /posts?page=1&search=aaa
// PARAMS -> /posts/:id (123)

export const searchPost = async (req, res) => {
  console.log("in search post");
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i"); // "Test", "tEst" == test
    // const title = searchQuery; // "Test", "tEst" == test
    // find all the post that match either "title" or "tags"
    console.log("title behind : ", title);
    const posts = await PostMessage.find({
      $or: [{ title: { $regex: title } }, { tags: { $in: tags.split(",") } }],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(409).json(error);
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) res.status(404).send("No post matched with given id");
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post matched with given id");
  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post matched with given id");

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    // like the post
    post.likes.push(req.userId);
  } else {
    // dislike the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post matched with given id");

  const post = await PostMessage.findById(id);
  post.comments.push(comment);
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.status(200).json(updatedPost);
}
