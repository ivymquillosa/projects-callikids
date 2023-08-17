'use strict'

/**
·* Boot the application by configuring the environment,
·* invoking initializers, loading controllers, and drawing routes.
·*/

const restify 	= require('restify')
	, morgan 	= require('morgan')
	, corsMiddleware = require('restify-cors-middleware')

class Initialize {
	static async setup({ stream }) {
		const { name, version } = require(process.cwd() + '/package')
		const server = restify.createServer({
			name,
			version
		})
		const cors = corsMiddleware({  
			origins: ["*"],
			allowHeaders: ["Authorization"],
			exposeHeaders: ["Authorization"]
		});
		server.pre(cors.preflight);  
		server.use(cors.actual);  
		server.use(restify.plugins.fullResponse())
		server.use(restify.plugins.acceptParser(server.acceptable))
		server.use(restify.plugins.queryParser({ mapParams: true }))
		server.use(restify.plugins.bodyParser({ mapParams: true }))
		server.use(restify.plugins.authorizationParser())
		// // setup morgan
		const message = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
		server.use(morgan(message, { stream }))
		// custom middlewares
		const dir = process.cwd() + '/config/middlewares'
		const files = fs.readdirSync(dir) || []
		// iterate the files on custom middlewares folder
		await Promise.map(files, file => server.use(require(path.join(dir, file))))
		
		return server
	}
	
	static boot(server) {
		const dir 	= path.resolve(__dirname, './initializers')
			, self 	= {
				server,
				controllers: {}
			}

		if (!fs.existsSync(dir)) {
			return Promise.reject('Application does not exist: ' + dir)
		}

		// NOTE: Sorting is required, due to the fact that no order is guaranteed
		//       by the system for a directory listing.  Sorting allows initializers
		//       to be prefixed with a number, and loaded in a pre-determined order.
		const files = fs.readdirSync(dir).sort()

		return Promise
			.mapSeries(files, (file) => {
				const module = require(path.join(dir, file))

				return module.call(self)
			})
			.then(() => self.server)
			.catch((err) => {
				log('error', 'Initializers [Error %s]', util.inspect(err))
				process.exit(1)
			})
	}
}

module.exports = Initialize