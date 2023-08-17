'use strict'

/**
·* Module dependencies
·*/
const nconf 	= require('nconf')
	, winston 	= require('winston')
	, os 		= require('os')
	, env 		= process.env.NODE_ENV || 'development'
    
require('dotenv').config({ path: process.cwd() + '/config/default.env' })
const port = process.env.PORT || nconf.get('PORT')
winston.remove(winston.transports.Console)
const logger = winston.add(winston.transports.Console, {
    timestamp: true,
    colorize: true
})

logger.stream = {
    write: (message) => logger.info(message)
}

/**
·* Global Variable and Function
·*/

Object.keys(process.env).map((key) => global[key] = process.env[key])
global.log = (level = 'info', message, ...args) => winston[level](message, ...args)
global.winston 	= winston
global.Promise 	= require('bluebird')
global.util 	= require('util')
global._ 		= require('lodash')
global.path 	= require('path')
global.fse 		= require('fs-extra')
global.uuid		= require('uuid')
global.fs 		= Promise.promisifyAll(require('fs'))

global.nconf 	= nconf
nconf.argv()
  .env()
  .add( 'global', {file: __dirname + '/config/api/' + env + '.json',  type: 'file'})
console.log('env', env)
/**
·* Process Event
·*/

process.on('exit', (err) => {
	log('error', 'Server - Exit [Error: %s]', util.inspect(err))
})

// uncaughtException event
process.on('uncaughtException', (err) => {
	log('error', 'Server - uncaughtException [Error: %s]', util.inspect(err))
	// restart app
	process.exit(1)
})
// unhandledRejection event
process.on('unhandledRejection', (err, p) => {
	log('error', 'Server - unhandledRejection at %s [Error: %s]', util.inspect(p), util.inspect(err))
})

/**
·* Boot the application
·*/

const Initialize = require('./config/initialize');

(async () => {
	try {
        let server =  await Initialize.setup(logger)
        server = await Initialize.boot(server)

        const message = `Application starting in ${env} environment on ${os.hostname()}:${port}`
		server.listen(port, () => winston.info(message))
	}
	catch(err) {
		winston.error('Initializing [Error %s]', util.inspect(err))
	}
})()