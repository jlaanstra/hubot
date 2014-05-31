// Include the CoffeeScript interpreter so that .coffee files will work

var coffee = require('coffee-script');

var path   = require('path');

// Include our application file

var hubot = require('./index.coffee');

var adapterPath = path.join(__dirname, "src", "adapters");
var adapter = "slack";

// Start the hubot
hubot.loadBot(adapterPath, )