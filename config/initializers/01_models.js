'use strict'

const { createProxy } = require('../utils')

module.exports = () => {
	const models_path = process.cwd() + '/config/api/models'
	const models = {}
	const handler = {
		apply(target, context, args) {
			log('info', '%s - %s', this.class, this.prototype)

			return Reflect.apply(target, context, args)
		}
	}

	return fs
		.readdirAsync(models_path)
		.map((file) => {
			if (file && file.includes('.js')) {
				const Model = new (require(models_path + '/' + file))()
				models[file.split('.')[0]] = createProxy(Model, handler)
			}

			return null
		})
		.then(() => global.Model = models)
		.catch((err) => {
			winston.error('Models Initializers [Error: %s]', util.inspect(err))
			throw err
		})
}