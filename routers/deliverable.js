const express = require('express');
const DeliverableController = require("../controllers/deliverable");

const api = express.Router();

api.get("/deliv/docs/:cycle/:specialty", DeliverableController.getDocumentsCycle);
api.get("/deliv/assessment/:cycle/:specialty/:student", DeliverableController.getAssessmentsCycle);
api.delete("/deliv/doc", DeliverableController.deleteDocumentCycle);
api.post("/deliv/assessment", DeliverableController.createAssessmentsCycle);
api.post("/deliv/comment", DeliverableController.insertCommentDeliv);
api.post("/deliv/assessment-data", DeliverableController.getAssessmentData);

module.exports = api;