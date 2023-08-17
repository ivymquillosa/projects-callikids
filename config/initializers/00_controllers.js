'use strict'

const { createProxy } = require('../utils')

module.exports = function() {
	const controllers_path = process.cwd() + '/config/api/controllers'
	const handler = {
		apply(target, context, args) {
			const [req, res, next] = args
			// trim parameters only if parameter is object and values are string
			if (!Array.isArray(req.params)) {
				Object.keys(req.params).map((each) => {
					if (typeof req.params[each] === 'string') {
						req.params[each] = req.params[each].trim()
					}

					return null
				})
			}
			// added request id and host on metadata
			if (req.params.metadata) {
				req.params.metadata = {
					...req.params.metadata,
					request_id: req.id()
				}
			}


			const data = { ...req.params }
			delete data.base64string

			log('info', '%s - %s [Params: %s]', this.class, this.prototype, util.inspect(data))

			return Reflect
				.apply(target, context, args)
				.then((result) => {
					if (!res.headersSent) {
						if (typeof result === 'object') {
							res.send(200, result)
						} else {
							throw { success: false, message: 'Record does not exist.' }
						}
					}

					return next()
				})
				.catch((err) => {
					if (err.success === false) {
						log('warn', '%s - %s [Error: %s]', this.class, this.prototype, err.message)

						return res.send(400, { code: 'BadRequest', message: err.message })
					}

					log('error', '%s - %s [Error: %s]', this.class, this.prototype, util.inspect(err))

					return res.send(500, { code: 'InternalError', message: util.inspect(err) })
				})
		}
	}

	return fs
		.readdirAsync(controllers_path)
		.map((file) => {
			if (file && file.includes('.js')) {
				const Controller = new (require(controllers_path + '/' + file))()
				this.controllers[file.split('.')[0]] = createProxy(Controller, handler)
			}

			return file
		})
}