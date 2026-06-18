const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unRegisterFromEvent
} = require("../controllers/event.controller");

const auth = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const { createEventValidation, updateEventValidation } = require('../validators/event.validator')
const validate = require('../middlewares/validation.middleware')

const router = express.Router();

router.get(
  "/",
  getEvents
);

router.post(
  "/",
  auth,
  adminOnly,
  createEventValidation,
  validate,
  createEvent
);

router.get(
  "/:id",
  getEventById
);

router.put(
  "/:id",
  auth,
  adminOnly,
  updateEventValidation,
  validate,
  updateEvent
);

router.delete(
  "/:id",
  auth,
  adminOnly,
  deleteEvent
);

router.post(
  "/register/:id",
  auth,
  registerForEvent
);

router.post(
  "/unRegister/:id",
  auth,
  unRegisterFromEvent
);

module.exports = router;