const express = require('express');
const DeliverableController = require("../controllers/deliverable");

const api = express.Router();

api.get("/deliv/docs/:cycle/:specialty", DeliverableController.getDocumentsCycle);
api.get("/deliv/assessment/:cycle/:specialty/:student", DeliverableController.getAssessmentsCycle);
api.delete("/deliv/doc", DeliverableController.deleteDocumentCycle);
api.post("/deliv/assessment", DeliverableController.createAssessmentsCycle);
api.post("/deliv/comment", DeliverableController.insertCommentDeliv);
api.post("/deliv/assessment-data", DeliverableController.getAssessmentData);
api.post("/deliv/enterprise-form", DeliverableController.registerEnterpriseForm);
api.post("/deliv/opinions-form", DeliverableController.getFormOpinions);
api.post("/deliv/my-form", DeliverableController.getMyFormOpinion);
api.post("/deliv/survey", DeliverableController.sendSurvey);

module.exports = api;