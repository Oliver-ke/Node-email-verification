const sgMail = require('@sendgrid/mail');
module.exports = (apikey, receiver, link, cb) => {
	sgMail.setApiKey(apikey);
	const msg = {
		to: receiver,
		from: 'miracleoliver2000@gmail.com',
		subject: 'Email Confirmation',
		text: 'Confirm your email to continue registration',
		html: `<strong>click on the link to confirm email ${link}</strong>`
	};
	sgMail.send(msg, (err, result) => {
		if (!err) {
			cb();
		} else {
			console.log(err);
		}
	});
};
