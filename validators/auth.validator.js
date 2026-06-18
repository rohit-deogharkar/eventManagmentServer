const { body } = require("express-validator");

exports.loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

exports.registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];