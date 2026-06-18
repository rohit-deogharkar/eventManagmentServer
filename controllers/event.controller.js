const Event = require("../models/event.model");
const sendEmail = require("../utils/sendEmail.util");
const User = require("../models/user.model");

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log("createEvent error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";

    const filter = {
      title: {
        $regex: search,
        $options: "i",
      },
    };

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.log("getEvents error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log("getEventById error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log("updateEvent error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("deleteEvent error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updateEvent = await Event.findOneAndUpdate(
      {
        _id: id,
        attendees: { $ne: userId },
      },
      {
        $addToSet: {
          attendees: userId,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!updateEvent) {
      return res.status(400).json({
        success: false,
        message: "Event not found or already registered",
      });
    }

    const user = await User.findById(userId);

    await sendEmail(
      user.email,
      `Event Registration Successful - ${event.title}`,
      `
        <h2>Event Registration Successful 🎉</h2>
        <p>Hello ${user.name},</p>
        <p>You have successfully registered for the following event:</p>
        <ul>
          <li><strong>Event:</strong> ${event.title}</li>
          <li><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</li>
          <li><strong>Location:</strong> ${event.location}</li>
        </ul>
        <p>We look forward to seeing you!</p>
      `,
    );

    res.json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    console.log("registerForEvent error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const unRegisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updateEvent = await Event.findOneAndUpdate(
      {
        _id: id,
        attendees: userId,
      },
      {
        $pull: {
          attendees: userId,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!updateEvent) {
      return res.status(400).json({
        success: false,
        message: "Event not found or user not registered",
      });
    }

    const user = await User.findById(userId);

    await sendEmail(
      user.email,
      `Event Registration Cancelled - ${event.title}`,
      `
        <h2>Registration Cancelled</h2>
        <p>Hello ${user.name},</p>
        <p>You have successfully cancelled your registration for:</p>
        <h3>${event.title}</h3>
        <p>We hope to see you at future events.</p>
      `,
    );

    res.status(200).json({
      success: true,
      message: "Successfully unregistered from event",
    });
  } catch (error) {
    console.log("unRegisterFromEvent error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unRegisterFromEvent,
};
