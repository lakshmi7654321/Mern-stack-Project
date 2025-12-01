import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
}, { timestamps: true });

const Partner = mongoose.model("Partner", partnerSchema);
export default Partner;
