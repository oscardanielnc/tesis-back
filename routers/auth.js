const express = require('express');
const AuthController = require("../controllers/auth");

const api = express.Router();

api.put("/sign-in", AuthController.signIn);
api.post("/sign-up", AuthController.signUp);
api.put("/profile", AuthController.updateProfile);

module.exports = api;