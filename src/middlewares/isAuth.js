import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuth = async (req, res, next) => {
  const cookie = req.cookies;
  const { token } = cookie;

  try {
    const decodedMsg = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedMsg);
    
    const { _id } = decodedMsg;
    console.log("loggedinUser id", _id);
    
    const user = await User.findById({
      _id,
    });
    console.log("user", user);
    
    if (!user) {
      throw new Error("User is not valid.");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in isAuth unauthorise access is asked.");
    console.log(error);
  }
};
