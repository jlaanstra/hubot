Hubot    = require 'hubot'

Fs       = require 'fs'
Path     = require 'path'

Options =
  adapter:     process.env.HUBOT_ADAPTER or "slack"
  alias:       process.env.HUBOT_ALIAS   or false
  create:      process.env.HUBOT_CREATE  or false
  enableHttpd: process.env.HUBOT_HTTPD   or true
  scripts:     process.env.HUBOT_SCRIPTS or []
  name:        process.env.HUBOT_NAME    or "Hubot"
  path:        process.env.HUBOT_PATH    or "."

adapterPath = Path.join __dirname, "..", "src", "adapters"

robot = Hubot.loadBot adapterPath, Options.adapter, Options.enableHttpd, Options.name

if Options.version
  console.log robot.version
  process.exit 0

robot.alias = Options.alias

loadScripts = ->
  scriptsPath = Path.resolve ".", "scripts"
  robot.load scriptsPath

  scriptsPath = Path.resolve ".", "src", "scripts"
  robot.load scriptsPath

  hubotScripts = Path.resolve ".", "hubot-scripts.json"
  Fs.exists hubotScripts, (exists) ->
    if exists
      Fs.readFile hubotScripts, (err, data) ->
        if data.length > 0
          try
            scripts = JSON.parse data
            scriptsPath = Path.resolve "node_modules", "hubot-scripts", "src", "scripts"
            robot.loadHubotScripts scriptsPath, scripts
          catch err
            console.error "Error parsing JSON data from hubot-scripts.json: #{err}"
            process.exit(1)

  externalScripts = Path.resolve ".", "external-scripts.json"
  Fs.exists externalScripts, (exists) ->
    if exists
      Fs.readFile externalScripts, (err, data) ->
        if data.length > 0
          try
            scripts = JSON.parse data
          catch err
            console.error "Error parsing JSON data from external-scripts.json: #{err}"
            process.exit(1)
          robot.loadExternalScripts scripts

  for path in Options.scripts
    if path[0] == '/'
      scriptsPath = path
    else
      scriptsPath = Path.resolve ".", path
    robot.load scriptsPath

robot.adapter.on 'connected', loadScripts

robot.run()