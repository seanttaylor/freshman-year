const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const requestContext = require('../lib/middleware/request-context.middleware.js');
const proxy = require('../lib/middleware/proxy');
const app = express();
const serverPort = process.env.SERVER_PORT || 3001;
const PROXY_DATA_SERVICE_URL = process.env.PROXY_DATA_SERVICE_URL || 'http://data_service:3000';

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestContext);

app.use('/api/sponsors', require('./routes/sponsors.route.js'));
app.use('/api/students', require('./routes/students.route.js'));
app.use(proxy.configuration(PROXY_DATA_SERVICE_URL));

/*
 * Routes
 */
app.use('/status', require('./routes/status.route.js'));

// catch 404
app.use((req, res, next) => {
    console.error(`Error 404 on ${req.url}.`);
    res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.error || err.message;
    //console.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
    console.error(err);
    res.status(status).send({ status, error: "There was an error." });
});

http.createServer(app).listen(serverPort, () => {
    console.info(
        "Edge Service proxy is listening on port %d (http://localhost:%d)",
        serverPort,
        serverPort
    );
});
