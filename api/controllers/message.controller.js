import { Message } from "../models/Message"; // Adjust the import path accordingly
import HttpStatusCodes from "../constants/HttpStatusCodes";
import responses from "../constants/responses";

// Get all messages for a user
export const getMessages = async (req, res) => {
  try {
    const { user } = req.body;

    const messages = await Message.find({
      $or: [{ sender_id: user.id }, { receiver_id: user.id }],
    })
      .populate("sender_id receiver_id", "username email") // Populating sender and receiver details
      .sort({ createdAt: -1 });

    res.status(HttpStatusCodes.OK).send({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: error.message,
    });
  }
};

// Add a new message
export const addMessage = async (req, res) => {
  const { user, content, receiver_id } = req.body;

  try {
    const message = new Message({
      sender_id: user.id,
      receiver_id: receiver_id,
      content: content,
    });

    await message.save();

    res.status(HttpStatusCodes.CREATED).send({
      success: true,
      message: responses.MESSAGE_ADDED,
      data: message,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
};

// Update message (e.g., marking as read)
export const updateMessage = async (req, res) => {
  const { user } = req.body;
  const { id } = req.params; // Message ID

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(HttpStatusCodes.NOT_FOUND).send({
        success: false,
        message: responses.MESSAGE_NOT_FOUND,
      });
    }

    // Ensure that the user is either the sender or receiver of the message
    if (
      ![message.sender_id.toString(), message.receiver_id.toString()].includes(
        user.id
      )
    ) {
      return res.status(HttpStatusCodes.FORBIDDEN).send({
        success: false,
        message: responses.FORBIDDEN_ACCESS,
      });
    }

    // Example: Marking the message as read
    message.read = true;
    await message.save();

    res.status(HttpStatusCodes.OK).send({
      success: true,
      message: responses.MESSAGE_UPDATED,
      data: message,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
};

// Delete message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params; // Message ID

  try {
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(HttpStatusCodes.NOT_FOUND).send({
        success: false,
        message: responses.MESSAGE_NOT_FOUND,
      });
    }

    res.status(HttpStatusCodes.OK).send({
      success: true,
      message: responses.SUCCESS_DELETE,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
};
