require('coffee-script/register');

var Fs, Hubot, OptParse, Options, Path, adapterPath, loadScripts, robot;

Hubot = require('hubot');

Fs = require('fs');

Path = require('path');

Options = {
  adapter: process.env.HUBOT_ADAPTER || "slack",
  alias: process.env.HUBOT_ALIAS || false,
  enableHttpd: process.env.HUBOT_HTTPD || true,
  scripts: process.env.HUBOT_SCRIPTS || [],
  name: process.env.HUBOT_NAME || "Hubot",
  path: process.env.HUBOT_PATH || "."
};

adapterPath = Path.join(__dirname, "node_modules\hubot\src\adapters");

robot = Hubot.loadBot(adapterPath, Options.adapter, Options.enableHttpd, Options.name);

console.log(robot.version);

robot.alias = Options.alias;

loadScripts = function() {
  var externalScripts, hubotScripts, path, scriptsPath, _i, _len, _ref, _results;
  scriptsPath = Path.resolve(".", "scripts");
  robot.load(scriptsPath);
  scriptsPath = Path.resolve(".", "src", "scripts");
  robot.load(scriptsPath);
  hubotScripts = Path.resolve(".", "hubot-scripts.json");
  Fs.exists(hubotScripts, function(exists) {
    if (exists) {
      return Fs.readFile(hubotScripts, function(err, data) {
        var scripts;
        if (data.length > 0) {
          try {
            scripts = JSON.parse(data);
            scriptsPath = Path.resolve("node_modules", "hubot-scripts", "src", "scripts");
            return robot.loadHubotScripts(scriptsPath, scripts);
          } catch (_error) {
            err = _error;
            console.error("Error parsing JSON data from hubot-scripts.json: " + err);
            return process.exit(1);
          }
        }
      });
    }
  });
  externalScripts = Path.resolve(".", "external-scripts.json");
  Fs.exists(externalScripts, function(exists) {
    if (exists) {
      return Fs.readFile(externalScripts, function(err, data) {
        var scripts;
        if (data.length > 0) {
          try {
            scripts = JSON.parse(data);
          } catch (_error) {
            err = _error;
            console.error("Error parsing JSON data from external-scripts.json: " + err);
            process.exit(1);
          }
          return robot.loadExternalScripts(scripts);
        }
      });
    }
  });
  _ref = Options.scripts;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    path = _ref[_i];
    if (path[0] === '/') {
      scriptsPath = path;
    } else {
      scriptsPath = Path.resolve(".", path);
    }
    _results.push(robot.load(scriptsPath));
  }
  return _results;
};

robot.adapter.on('connected', loadScripts);

robot.run();