const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const sendmail = require('../util/sendmail');
const apiKey = require('../config/dev.config').SEND_GRID_API_KEY;
//login route
router.get('/login', (req, res) => {
	res.render('login');
});

//register
router.get('/register', (req, res) => {
	res.render('register');
});

//register handle
router.post('/register', (req, res) => {
	const { name, password, email, password2 } = req.body;
	let errors = [];
	//check required filed
	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'please fill in all fields' });
	}
	//check password match
	if (password !== password2) {
		errors.push({ msg: 'passwords do not match' });
	}

	//check password lengt
	if (password.length < 6) {
		errors.push({ msg: 'password should atleast 6 characters' });
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		//validation passes
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//user exist
				errors.push({ msg: 'Email already exist' });
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					name,
					email,
					password
				});
				// Hash password
				newUser.save().then((user) => {
					const link = `http://localhost:5000/users/confirm/${user._id}`;
					//sendmail
					sendmail(apiKey, user.email, link, () => {
						res.render('ask-confirm');
					});
				});
			}
		});
	}
});

router.get('/confirm/:regId', (req, res) => {
	const regId = req.params.regId;
	User.findById(regId).then((user) => {
		if (user) {
			if (!user.confirmed) {
				user.confirmed = true;
				user.save().then((user) => {
					res.render('confirmed', { user });
				});
			} else {
				res.render('confirmed', { error: 'Email already confirmed !' });
			}
		} else {
			res.render('confirmed', { error: 'Invalid Request' });
		}
	});
});

//login handle
router.post('/login', (req, res) => {});

module.exports = router;
