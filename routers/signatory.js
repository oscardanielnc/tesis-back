const express = require('express');
const SignatoryController = require("../controllers/signatory");

const api = express.Router();

api.post("/signatory", SignatoryController.addSignatory);
api.put("/signatory", SignatoryController.updateSignatory);
api.post("/signatories", SignatoryController.getSignatories);

module.exports = api;
