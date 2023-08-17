'use strict'

const EmailRoute = (config) => {
	for(const method in EmailRoute) {
		EmailRoute[method](config.server, config.controllers.email)
	}
	return EmailRoute
}

EmailRoute.get = (route, component) => {
}

EmailRoute.post = (route, component) => {
	route.post('/contact-us', component.triggerContactUsEmail)
}

EmailRoute.put = (route, component) => {
}

EmailRoute.del = (route, component) => {
}

module.exports = EmailRoute