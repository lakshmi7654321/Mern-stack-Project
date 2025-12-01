import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "North Indian",
        "South Indian",
        "Dessert",
        "Fast Foods",
        "Ice Cream",
        "Veg",
        "Non Veg"
      ],
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    ingredients: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    keyword: {
      type: String,
      enum: ["popular", "special", "regular", "common"],
      default: "common",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
