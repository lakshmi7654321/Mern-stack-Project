import Contact from "../models/contactModel.js";


// ⭐ Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
      replied: false,
      replyText: "",
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};



// ⭐ Fetch all messages (latest first)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Fetch Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};



// ⭐ Delete a contact message
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};



// ⭐ Update contact (name, email, message, replyText, replied)
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Contact.findByIdAndUpdate(
      id,
      {
        ...req.body, // Can update replyText & replied also
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: "Message updated successfully.",
    });
  } catch (error) {
    console.error("Update Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
};



// ⭐ Special API: Reply to a contact message
export const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required.",
      });
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      {
        replyText,
        replied: true,
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: "Reply sent successfully.",
    });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply.",
    });
  }
};
