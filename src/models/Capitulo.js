import mongoose from "mongoose";

const CapituloSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    actual: {
      type: String,
    },
    user: {
      type: String,
      required: true,
    },
    idHistoria: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    estado: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Capitulo", CapituloSchema);
