require('coffee-script/register');

var robot = require('hubot');

robot.loadBot("../src/adapters", "slack", true);