const { body } =
  require("express-validator");

exports.createEventValidation = [
  body("title")
    .notEmpty()
    .withMessage(
      "Title is required"
    ),

  body("description")
    .notEmpty()
    .withMessage(
      "Description is required"
    ),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid date format")
    .bail()
    .custom((value) => {
      const eventDate = new Date(value);
      const now = new Date();

      if (eventDate <= now) {
        throw new Error(
          "Event must be scheduled in the future"
        );
      }

      return true;
    }),

  body("location")
    .notEmpty()
    .withMessage(
      "Location is required"
    ),
];

exports.updateEventValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("location")
    .optional()
    .notEmpty()
    .withMessage("Location cannot be empty"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error(
          "Event date cannot be in the past"
        );
      }

      return true;
    })
]