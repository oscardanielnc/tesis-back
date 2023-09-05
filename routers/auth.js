const express = require('express');
const AuthController = require("../controllers/auth");

const api = express.Router();

api.get("/sign-in/:attr/:value", AuthController.singIn);
api.post("/sign-up", AuthController.signUp);

module.exports = api;