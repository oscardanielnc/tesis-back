const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express()
const { API_VERSION } = require('./config');

// Load routings
const authRoutes =  require('./routers/auth');
const studentRoutes =  require('./routers/student');
const enterpriseRoutes =  require('./routers/enterprise');
const employedRoutes =  require('./routers/employed');
const specialtyRoutes =  require('./routers/specialty');
const sysDataRoutes =  require('./routers/sysData');
const jobRoutes =  require('./routers/job');
const agreementRoutes =  require('./routers/agreement');
const opinionRoutes =  require('./routers/opinion');
const signatoryRoutes =  require('./routers/signatory');
const professorRoutes =  require('./routers/professor');
const docRoutes =  require('./routers/doc');
const delivRoutes =  require('./routers/deliverable');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Configure Header HTTP
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, studentRoutes);
app.use(`/api/${API_VERSION}`, enterpriseRoutes);
app.use(`/api/${API_VERSION}`, employedRoutes);
app.use(`/api/${API_VERSION}`, specialtyRoutes);
app.use(`/api/${API_VERSION}`, sysDataRoutes);
app.use(`/api/${API_VERSION}`, jobRoutes);
app.use(`/api/${API_VERSION}`, agreementRoutes);
app.use(`/api/${API_VERSION}`, opinionRoutes);
app.use(`/api/${API_VERSION}`, signatoryRoutes);
app.use(`/api/${API_VERSION}`, professorRoutes);
app.use(`/api/${API_VERSION}`, docRoutes);
app.use(`/api/${API_VERSION}`, delivRoutes);

module.exports = app;