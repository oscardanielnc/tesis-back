const express = require('express');
const JobController = require("../controllers/job");

const api = express.Router();

api.post("/jobs", JobController.getJobs);
api.post("/job", JobController.createJob);
api.put("/job", JobController.updateJob);
api.get("/job/:code", JobController.getJobByCode);
api.put("/apply-job", JobController.applyJob);

module.exports = api;