'use strict'

module.exports = (req, res, next) => {
	winston.info('Authentication [username: %s]', req.username)
	let users = (BASIC_AUTHENTICATION || '').split(',')

	if (req.route.path === '/.*/') {
		return next()
	}

	users = users.reduce((acc, value) => {
		const [username, password] = value.split(':')

		return {
			...acc,
			[username]: password
		}
	}, {})

	if (users[req.username] && req.authorization.basic.password === users[req.username]) {
		return next()
	}

	return res.send(401, { message: 'Unauthorized.' })
}