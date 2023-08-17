const express = require('express');
const path = require('path');
const app = express();
const data = require('./data.json');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const pages = require('./routes/index')
require('dotenv').config({ path: process.cwd() + '/config/default.env' })
const EmailModel = new (require('./config/api/models/email'))()
var https = require('https');
var Request = require("request");
const { response } = require('express');
var axios = require('axios')

app.use(express.static(__dirname + '/public'));

app.use(cookieParser())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set('views', (path.join(__dirname, 'views')));
app.set('view engine', 'pug');

// app.get('/contact-us', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public/templates/contact_us.html'));
// })

app.get('/', (req, res) => {
    res.render('pages/homepage', {title: 'California Kids Pediatrics', menu_home: 'active', pageClass: 'homepage'});
})

app.get('/services', (req, res) => {
    res.render('pages/services', {title: 'Services', menu_services: 'active', pageClass: 'services'});
})

app.get('/meet-our-team', (req, res) => {
    res.render('pages/meet_the_team', {title: 'Meet Our Team', menu_meet_our_team: 'active', pageClass: 'meet_our_team'});
})

app.get('/resources', (req, res) => {
    res.render('pages/resources', {title: 'Resources', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/contact-us', (req, res) => {
    res.render('pages/contact_us', {title: 'Contact Us', menu_contact_us: 'active', pageClass: 'contact_us'});
})

app.get('/patient-registration-under-18/', (req, res) => {
    res.render('pages/patient_registration', {title: 'Patient Registration', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/patient-registration-over-18/', (req, res) => {
    res.render('pages/patient_registration_over', {title: 'Patient Registration', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/vaccine-information-sheet/', (req, res) => {
    res.render('pages/vaccine_information_sheet', {title: 'Vaccine Information Sheet', menu_services: 'active', pageClass: 'services'});
})

app.get('/location', (req, res) => {
    res.render('pages/location', {title: 'Location', menu_location: 'active', pageClass: 'location'});
})

app.get('/dosage-chart', (req, res) => {
    res.render('pages/dosage_chart', {title: 'Dosage Chart', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/vaccine-information-birth-to-six-years/', (req, res) => {
    res.render('pages/vaccine_birth_6', {title: 'Birth to 6 Years', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/vaccine-information-birth-to-eighteen-years/', (req, res) => {
    res.render('pages/vaccine_birth_18', {title: 'Birth to 18 Years', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/vaccine-information-mile-stone-check/', (req, res) => {
    res.render('pages/mile_stone_check.pug', {title: 'Baby Milestone Check', menu_resources: 'active', pageClass: 'resources'});
})

app.get('/404', (req, res) => {
    res.render('pages/page_not_found', {title: 'Page not found!'});
})
    
app.post('validate_captcha', (req, res) => {
    console.log(req.params);
    res.json({test:'test'})
})

// app.get('/404/', (req, res) => {
//     res.render('pages/404.pug', {title: '404 Page'});
// })

// send email
app.post('/contact-us', async(req, res) =>{
    console.log('req.body', req.body)
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
		res.send({success: false, msg: 'Please select captcha first'});
		return;
	}
	const secretKey = '6LccMbAcAAAAAPzz-1Qxyk0dxsVnPPYE8z6DxnGq';

    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + secretKey + "&";
    recaptcha_url += "response=" + req.body['g-recaptcha-response'] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.send({ "message": "Captcha validation failed" });
        }
        EmailModel.triggerEmail(req.body)
        res.render('pages/thank_you', {title: 'Contact Us', menu_contact_us: 'active', pageClass: 'contact_us', send:body})
    });

    //miss hanna
    // https.get(verificationURL, (resG) => {
	// 	let rawData = '';
	// 	resG.on('data', (chunk) => { rawData += chunk })
	// 	resG.on('end', function() {
	// 		try {
	// 			var parsedData = JSON.parse(rawData);
	// 			if (parsedData.success === true) {
    //                 return res.header("Content-Type", "application/json").send(body);
					
	// 			} else {
    //                 return res.send({success: false, msg: 'Failed captcha verification'});
					
	// 			}
	// 		} catch (e) {
	// 			return res.send({success: false, msg: 'Failed captcha verification from Google'});
				
	// 		}
	// 	});
	// });

})


app.use(function (req, res) {
      const appUrl = req.originalUrl;
      const isMatch = appUrl.match(/a\d{1,6}\/app/g)
      const err = new Error('Not Found')
      err.status = 404
      res.redirect('/404')
})




const {
    PORT ="3000"
}= process.env

app.listen( PORT, () => console.log (`||----------- Started at port ${PORT} -----------||`));