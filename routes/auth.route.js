const express = require("express");

const {
  registerUser,
  loginUser,
  verifyEmail
} = require("../controllers/auth.controller");

const { registerValidation, loginValidation } = require('../validators/auth.validator')
const validate = require('../middlewares/validation.middleware')

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

router.post(
  "/verifyEmail",
  verifyEmail
);

module.exports = router;