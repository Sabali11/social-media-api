import express from "express";
import { register, login } from "../controller/authController.js";

const router = express.Router();

/*
  Auth Routes for the Social Media API

  POST /api/auth/register
    - Registers a new user
    - Expects: username, email, password
    - Returns: user info and JWT token

  POST /api/auth/login
    - Logs in an existing user
    - Expects: email, password
    - Returns: user info and JWT token
*/

router.post("/register", register);
router.post("/login", login)


export default router;
