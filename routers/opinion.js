const express = require('express');
const OpinionController = require("../controllers/opinion");

const api = express.Router();

api.post("/opinion", OpinionController.setMyOpinion);
api.put("/opinion", OpinionController.updateMyOpinion);

module.exports = api;