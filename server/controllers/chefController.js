import Chef from "../models/chefModel.js";

// CREATE Chef
export const createChef = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name || !image || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const chef = await Chef.create({ name, image, description });
    res.status(201).json(chef); // return object directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create chef." });
  }
};

// GET All Chefs
export const getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ createdAt: -1 });
    res.status(200).json(chefs); // return array directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch chefs." });
  }
};

// UPDATE Chef
export const updateChef = async (req, res) => {
  try {
    const updated = await Chef.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Chef not found." });
    }

    res.status(200).json(updated); // return updated object
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update chef." });
  }
};

// DELETE Chef
export const deleteChef = async (req, res) => {
  try {
    const deleted = await Chef.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Chef not found." });
    }

    res.status(200).json({ message: "Chef deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete chef." });
  }
};
