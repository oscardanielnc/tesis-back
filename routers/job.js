const express = require('express');
const JobController = require("../controllers/job");

const api = express.Router();

api.get("/job", JobController.getJobs);

module.exports = api;