import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creador: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
        default: [],
      }
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
