import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

export default mongoose.model("session", sessionSchema);
