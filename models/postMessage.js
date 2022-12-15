import mongoose from "mongoose";

// Every post request will bring along all these param automatically
const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: [String],
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const targetDb = mongoose.connection.useDb("DB1");
// const targetDb = mongoose.connection.useDb("test");
const PostMessage = targetDb.model("PostMessage", postSchema);
export default PostMessage;
