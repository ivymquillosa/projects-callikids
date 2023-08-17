'use strict'

class EmailController {
	async triggerContactUsEmail({ params }) {
		return Model
				.email
				.triggerEmail(params)
				.then((e) => ({
					email_sent: e.statusCode === 202 ? true : false
				}))
	}
}

module.exports = EmailController