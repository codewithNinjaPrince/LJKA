import ContactModel from "../models/contactModel.js";

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();
    const trimmedSubject = subject?.trim();
    const trimmedMessage = message?.trim();

    // Required fields
    if (
      !trimmedName ||
      !trimmedSubject ||
      !trimmedMessage
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // At least one contact method is required
    if (!trimmedEmail && !trimmedPhone) {
      return res.status(400).json({
        success: false,
        message: "Please provide either an email address or mobile number",
      });
    }

    // Validate email only if provided
    if (
      trimmedEmail &&
      !/^\S+@\S+\.\S+$/.test(trimmedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Validate phone only if provided
    if (
      trimmedPhone &&
      !/^[6-9]\d{9}$/.test(trimmedPhone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    const contact = await ContactModel.create({
      name: trimmedName,
      email: trimmedEmail || "",
      phone: trimmedPhone || "",
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send your message",
    });
  }
};

export { submitContactForm };