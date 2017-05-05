// parse command-line-args
var argv = require('minimist')(process.argv.slice(2));

// mqtt-client
var mqtt = require('mqtt');
var mqttServer = argv['mqtt-server'] || 'localhost';
var mqttPort = argv['mqtt-port'] || 1883;
var mqttUrl = 'mqtt://' + mqttServer + ':' + mqttPort;
var mqttTopicPrefix = argv['mqtt-topic-prefix'] || 'geofency/presence/';

// express-app
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var httpServerPort = argv['http-port'] || 80;

// setup
var app = express();
app.use(bodyParser.json());
if (argv['http-log']) {
  app.use(morgan('combined'));
}

// connect to mqtt-broker
var mqttClient = mqtt.connect(mqttUrl);
mqttClient.on('connect', function() {
  console.log('mqtt-client connected to ' + mqttUrl + '- using "'+ mqttTopicPrefix + '" as topic-prefix.');

  // listen after successful connection to mqtt-broker
  app.listen(httpServerPort, function () {
    console.log('geofency2mqtt is listening on port: ' + httpServerPort);
  });

  // handle POST-request
  app.post('/geofency/:username/', function (req, res) {
    var presenceState = (req.body.entry === '1' ? 'true' : 'false');
    mqttClient.publish(mqttTopicPrefix + req.params.username, presenceState);
    console.log('updated presence-state for user \'' + req.params.username + '\' to ' + presenceState);
    res.send('ok');
  });

  // test endpoint
  app.get('/', function (req, res) {
    res.send('it works...');
  });
});
