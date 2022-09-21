import mongoose from "mongoose";

export const DBConnect = async () => {
  const conn = await mongoose.connect(process.env.DB_URL);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
