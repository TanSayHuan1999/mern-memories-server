import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SECRET = "test";
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

    // second param is secret key that should be put inside the .env
    const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, SECRET, { expiresIn: "1h" });

    res.status(200).json({ userProfile: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const googleSignIn = async (req, res) => {
  const { accessToken } = req.body;
  try {
    let resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      method: "get",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    let userProfile = await resp.json();
    userProfile._id = userProfile.sub;

    const token = jwt.sign({ email: userProfile.email, id: userProfile.sub }, SECRET, { expiresIn: "1h" });
    res.status(200).json({ userProfile, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist." });
    }

    if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET, { expiresIn: "1h" });

    res.status(200).json({ userProfile: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
