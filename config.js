const API_VERSION = "v1";
const IP_SERVER = "localhost";
const PORT_SERVER = process.env.PORT || 8080; 
const PSP_KEY = "pandita69";

const MYSQL_CREDENTIALS = {
    host     : 'tesis.cpbm1yjm50ia.us-east-1.rds.amazonaws.com',
    port     : 3306,
    user     : 'admin',
    password : 'tesis2oscar6',
    database : 'tesis'
};


module.exports = {
    API_VERSION,
    IP_SERVER,
    PORT_SERVER,
    MYSQL_CREDENTIALS,
    PSP_KEY
};
