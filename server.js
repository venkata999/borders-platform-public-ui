const port = process.env.PORT || 8080;

const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const btoa = require('btoa');
const https = require('https');

const fs = require('fs');

if (process.env.NODE_ENV === 'production') {
    console.log('Setting ca bundle');
    const trustedCa = [
        '/etc/ssl/certs/ca-bundle.crt'
    ];

    https.globalAgent.options.ca = [];
    http.globalAgent.options.ca = [];
    for (const ca of trustedCa) {
        https.globalAgent.options.ca.push(fs.readFileSync(ca));
        http.globalAgent.options.ca.push(fs.readFileSync(ca));
    }
    console.log('ca bundle set...');
}

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

const workflowName = process.env.WORKFLOW_NAME;
const platformDataName = process.env.PLATFORM_DATA;

const translationServiceName =  process.env.TRANSLATION_SERVICE_NAME;
const formIOName = process.env.FORM_IO_NAME;

const intdomain = process.env.INT_DOMAIN;

const domain = process.env.DOMAIN;

const formIOUrl = `https://${formIOName}.${domain}`;
const workflowUrl = `https://${workflowName}.${intdomain}`;
const translationServiceUrl = `https://${translationServiceName}.${intdomain}`;
const platformDataUrl = `https://${platformDataName}.${intdomain}`;

console.log("formIOUrl " + formIOUrl);
console.log("workflowUrl " + workflowUrl);
console.log("translationServiceUrl " + translationServiceUrl);
console.log("platformDataUrl " + platformDataUrl);

const basicAuthentication = () => {
    const username= process.env.USERNAME;
    const password = process.env.PASSWORD;
    return "Basic " + btoa(username + ":" + password);
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
    secure: true,
    agent: https.globalAgent,

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
        secure: true,
        agent: https.globalAgent
    }
));

app.use('/api/form', proxy(
    {
        target: formIOUrl,
        pathRewrite: {
            '^/api/form': '/form'
        },
        agent: https.globalAgent,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            console.log('Form IO Proxy -->  ', req.method, req.path, '-->', formIOUrl, proxyReq.path);
        },
        onError: function onError(err, req, res) {
            console.error(err);
            res.status(500);
            res.json({error: 'Error when connecting to remote server.'});
        },
        logLevel: 'debug',
        changeOrigin: true,
        secure: true
    }
));

app.use('/api/platform-data', proxy(
    {
        target: platformDataUrl,
        pathRewrite: {
            '^/api/platform-data/': ''
        },
        agent: https.globalAgent,
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            console.log('Platform Data Proxy -->  ', req.method, req.path, '-->', platformDataUrl, proxyReq.path);
        },
        onError: function onError(err, req, res) {
            console.error(err);
            res.status(500);
            res.json({error: 'Error when connecting to remote server.'});
        },
        logLevel: 'debug',
        changeOrigin: true,
        secure: true
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


