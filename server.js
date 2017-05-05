// mqtt-client
var mqtt = require('mqtt');
var mqttUrl = 'mqtt://mqtt:1883';
var mqttClient = mqtt.connect(mqttUrl);

// express-app
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var httpServerPort = 40080;
var app = express();

// setup
app.use(bodyParser.json());
app.use(morgan('combined'));

mqttClient.on('connect', function() {
  console.log('mqtt-client connected to ' + mqttUrl);

  // listen after successful connection to mqtt-broker
  app.listen(httpServerPort, function () {
    console.log('geofency2mqtt is listening on port: ' + httpServerPort);
    console.log('press ctrl-c to exit.');
  });

  // handle POST-request
  app.post('/geofency/:username/', function (req, res) {
    var presenceState = (req.body.entry === '1' ? 'true' : 'false');
    mqttClient.publish('geofency/presence/' + req.params.username, presenceState);
    console.log('updated presence-state for user \'' + req.params.username + '\' to ' + presenceState);
    res.send('ok');
  });

  // test endpoint
  app.get('/', function (req, res) {
    res.send('it works...');
  });
});
