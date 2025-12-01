import Partner from "../models/partnerModel.js";

// CREATE Partner
export const createPartner = async (req, res) => {
  try {
    const { name, role, description, image } = req.body;

    if (!name || !role || !image) {
      return res
        .status(400)
        .json({ message: "Name, role, and image are required." });
    }

    const partner = await Partner.create({
      name,
      role,
      description,
      image,
    });

    res.status(201).json(partner); // return object directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create partner." });
  }
};

// GET All Partners
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    res.status(200).json(partners); // return array directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch partners." });
  }
};

// UPDATE Partner
export const updatePartner = async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Partner not found." });
    }

    res.status(200).json(updated); // return updated object
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update partner." });
  }
};

// DELETE Partner
export const deletePartner = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Partner not found." });
    }

    res.status(200).json({ message: "Partner deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete partner." });
  }
};
