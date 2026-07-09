import express from "express";

import { auth } from "../middlewares/authMiddleware.js";

import { isAdmin } from "../middlewares/roleMiddleware.js";

import {

  getAllUsersController,

  getUserByIdController,

  updateUserController,

} from "../controllers/adminController.js";
const router =
express.Router();
router.get(

  "/users",

  auth,

  isAdmin,

  getAllUsersController

);

router.get(

  "/users/:userId",

  auth,

  isAdmin,

  getUserByIdController

);

router.put(

  "/users/:userId",

  auth,

  isAdmin,

  updateUserController

);

export default router;
