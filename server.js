const port = process.env.PORT || 8080;

const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const proxy = require('http-proxy-middleware');
const cors = require('cors')


const respond = (req, res) => {
    res.send('OK');
};

process.title = 'platform-public-ui';

app.set('port', port);

app.use(express.static(__dirname + "/"));

app.use(cors());

app.get('/healthz', respond);
app.get('/readiness', respond);

console.log("workflow name " + process.env.WORKFLOW_NAME);
console.log("translation name" + process.env.TRANSLATION_SERVICE_NAME);

const workflowName =process.env.WORKFLOW_NAME;
const translationServiceName =  process.env.TRANSLATION_SERVICE_NAME;

const intdomain = process.env.INT_DOMAIN;

const workflowUrl = `https://${workflowName}.${intdomain}`;
const translationServiceUrl = `https://${translationServiceName}.${intdomain}`;

console.log("workflowUrl " + workflowUrl);
console.log("translationServiceUrl " + translationServiceUrl);

const basicAuthentication = () => {
    const username= process.env.EXTERNAL_TASK_CALLER_USERNAME;
    const password = process.env.EXTERNAL_TASK_CALLER_PASSWORD;
    const tok = username + ':' + password;
    const hash = Base64.encode(tok);
    return "Basic " + hash;
};

app.use('/api/workflow', proxy({
    target: workflowUrl,
    pathRewrite: {
        '^/api/workflow': '/rest/engine/borders'
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        const authHeader = basicAuthentication();
        proxyReq.setHeader('Authorization',  authHeader);
        console.log('Workflow Proxy -->  ', req.method, req.path, '-->', workflowUrl, proxyReq.path);
    },
    onError: function onError(err, req, res) {
        console.error(err);
        res.status(500);
        res.json({error: 'Error when connecting to remote server.'});
    },
    logLevel: 'debug',
    changeOrigin: true,
    secure: false
}));


app.use('/api/translation', proxy(
    {
        target: translationServiceUrl,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            const authHeader = basicAuthentication();
            proxyReq.setHeader('Authorization',  authHeader);
            console.log('Translation Service Proxy -->  ', req.method, req.path, '-->', translationServiceUrl, proxyReq.path);
        },
        onError: function onError(err, req, res) {
            console.error(err);
            res.status(500);
            res.json({error: 'Error when connecting to remote server.'});
        },
        logLevel: 'debug',
        changeOrigin: true,
        secure: false
    }
));


app.all('*', function (req, res) {
    console.log("Request to public UI");
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Platform Public Prod server listening on port ' + app.get('port'));
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('SIGQUIT', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}


