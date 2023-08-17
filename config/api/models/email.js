'use strict'

const fs = require('fs')
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

class EmailModel {
	prepareEmailBody(file, data) {
		let response =  fs.readFileSync(file, 'utf8')
		for (var key in data) {
			if (data.hasOwnProperty(key))
				response = response.replace('${' + key + '}', data[key]).replace('${' + key + '}', data[key])
		}

		return response
    }

    prepareEmailContent(content, payload) {
		Object.keys(payload).forEach(key => {
			const find = '\\${' + key + '}'
			const regex = new RegExp(find, 'g')
			if (key.includes('link') && payload[key] && !payload[key].includes('Not Available'))
				content = content.replace(regex, `<a href="${payload[key]}">${payload[key]}</a>`)
			else
				content = content.replace(regex, payload[key] || '')
		})

		return content
    }
    
    sendEmailUsingSendGrid(email_data) {
		if (!email_data  && !email_data.email_to)
			return Promise.reject({
				message: 'email_to is required',
				success: false
			})

		if(!SENDGRID_API_KEY) {
			throw { success: false, message: 'You must set the SENDGRID_API_KEY on config'}
		}

		let sendgrid = require('sendgrid')(SENDGRID_API_KEY)
		let config = {
			method 	: 'POST',
			path 	: '/v3/mail/send',
			body 	: {
				personalizations: [
					{
						to: [{ email: email_data.email_to }],
						subject: email_data.subject,
					}
				],
				from: {
					email: email_data.email_from || DEFAULT_EMAIL_FROM || '',
					name: email_data.name_from || ''
				},
				content: [
					{
						type: 'text/html',
						value: email_data.body,
					}
				]
			}
		}

		if(email_data.attachments && email_data.attachments.length > 0)
			config.body.attachments = email_data.attachments

		let request = sendgrid.emptyRequest(config)	

		// send the message and get a response with an error or details of the message that was sent
		return sendgrid.API(request).catch(err => console.log(JSON.stringify(err)))
    }

    async triggerEmail(params) {
		// admin
		{
			const html_template_path = process.cwd() + '/resources/html/contact-us.html'
			const send_options = {
				subject: 'Patient contact us form submission.',
				email_from: process.env.DEFAULT_EMAIL_FROM,
				email_to: process.env.DEFAULT_EMAIL_TO,
			}

			const content = this.prepareEmailBody(html_template_path, params)
			const html_template = await this.prepareEmailContent(content, params)
			send_options.body = html_template
			// send mail
			await this.sendEmailUsingSendGrid(send_options)
		}

		// user
		{
			const html_template_path = process.cwd() + '/resources/html/contact-us-user.html'
			const send_options = {
				subject: 'Thank you for connecting with  California Kids Pediatrics!',
				email_from: process.env.DEFAULT_EMAIL_FROM,
				email_to: params.email_address,
			}
	
			const content = this.prepareEmailBody(html_template_path, {
				name: `${params.first_name} ${params.last_name}`
			})
			const html_template = await this.prepareEmailContent(content, params)
			send_options.body = html_template
			// send mail
			return this.sendEmailUsingSendGrid(send_options)
		}
    }
}

module.exports = EmailModel