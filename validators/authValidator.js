import { body } from "express-validator";

export const emailValidation = [

  body("email")

    .trim()

    .notEmpty()

    .withMessage("Email is required.")

    .isEmail()

    .withMessage("Invalid email address.")

    

];
export const passwordValidation = [

  body("password")

    .notEmpty()

    .withMessage("Password is required.")

    .isLength({
      min: 8,
    })

    .withMessage(
      "Password must contain at least 8 characters."
    )

    .matches(/[A-Z]/)

    .withMessage(
      "Password must contain one uppercase letter."
    )

    .matches(/[a-z]/)

    .withMessage(
      "Password must contain one lowercase letter."
    )

    .matches(/[0-9]/)

    .withMessage(
      "Password must contain one number."
    )

    .matches(/[!@#$%^&*(),.?":{}|<>]/)

    .withMessage(
      "Password must contain one special character."
    ),

];
import { param } from "express-validator";

export const objectIdValidation = (
  field
) => [

  param(field)

    .isMongoId()

    .withMessage(
      `Invalid ${field}.`
    ),

];
