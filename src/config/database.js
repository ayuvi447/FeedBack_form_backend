import mongoose from "mongoose";

export const connect_db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('DATABASE CONNECTED SUCCESSFULLY. 😋');
  } catch (error) {
    console.log("Error in connecting db.");
  }
};
