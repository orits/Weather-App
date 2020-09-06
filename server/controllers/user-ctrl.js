const User = require("../models/user-model");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const passportConfig = require("../passport");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const nameRegex = RegExp(/^[a-zA-Z ]{2,30}$/);
const nameHebRegex = RegExp(/^[\u0590-\u05FF]{2,30}$/);

const emailRegex = RegExp(
	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

createUser = async (req, res) => {
	const body = req.body;
	try {
		if (
			!body.firstName ||
			!body.lastName ||
			!body.emailAddress ||
			!body.password
		) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י את כל השדות הנדרשים",
			});
		}
		if (body.firstName.length < 2) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י שם פרטי באורך 2 תווים לפחות",
			});
		} else if (
			!nameRegex.test(body.firstName) &&
			!nameHebRegex.test(body.firstName)
		) {
			return res.status(200).json({
				success: false,
				message:
					"!אנא הכנס/י שם פרטי שמורכב מאותיות בלבד" +
					"\n" +
					"(אנגלית או עברית)",
			});
		}

		if (body.lastName.length < 2) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י שם משפחה באורך 2 תווים לפחות",
			});
		} else if (
			!nameRegex.test(body.lastName) &&
			!nameHebRegex.test(body.lastName)
		) {
			return res.status(200).json({
				success: false,
				message:
					"!אנא הכנס/י שם משפחה שמורכב מאותיות בלבד" +
					"\n" +
					"(אנגלית או עברית)",
			});
		}

		if (!emailRegex.test(body.emailAddress)) {
			return res.status(200).json({
				success: false,
				message: "!כתובת האימייל אינה חוקית",
			});
		}

		if (body.password.length < 6) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י סיסמא באורך 6 לפחות",
			});
		}

		await User.findOne({ emailAddress: body.emailAddress }).then((user) => {
			if (user) {
				// or 400
				return res.status(200).json({
					success: false,
					//message: "Email already exists!",
					message: "!כתובת האימייל כבר קיימת במערכת",
				});
			} else {
				//body.password = bcrypt.hashSync(body.password, 10);
				const user = new User(body);

				if (!user) {
					return res.status(400).json({ success: false, error: err });
				}

				user.save()
					.then(() => {
						return res.status(201).json({
							success: true,
							id: user._id,
							message: "User created!",
						});
					})
					.catch((error) => {
						return res.status(400).json({
							error,
							message: "User not created!",
						});
					});
			}
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

updateUser = async (req, res) => {
	const body = req.body;

	if (!body) {
		return res.status(400).json({
			success: false,
			error: "You must provide a body to update",
		});
	}

	User.findOne({ _id: req.params.id }, (err, user) => {
		if (err) {
			return res.status(404).json({
				err,
				message: "User not found!",
			});
		}
		user.firstName = body.firstName;
		user.lastName = body.lastName;
		user.emailAddress = body.emailAddress;
		user.password = body.password;
		user.lastUpdate = body.lastUpdate;
		user.save()
			.then(() => {
				return res.status(200).json({
					success: true,
					id: user._id,
					message: "User updated!",
				});
			})
			.catch((error) => {
				return res.status(404).json({
					error,
					message: "User not updated!",
				});
			});
	});
};

deleteUser = async (req, res) => {
	const id = req.params.id;
	console.log("id:", req.params.id);
	try {
		await User.findOneAndDelete({ _id: id }, (err, user) => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}

			if (!user) {
				return res
					.status(404)
					.json({ success: false, error: "User not found" });
			}

			return res.status(200).json({ success: true, data: user });
		}).catch((err) => console.log(err));
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
};

getUserById = async (req, res) => {
	await User.findOne({ _id: req.params.id }, (err, user) => {
		if (err) {
			return res.status(400).json({ success: false, error: err });
		}

		if (!user) {
			return res
				.status(404)
				.json({ success: false, error: "User not found" });
		}
		return res.status(200).json({ success: true, data: user });
	}).catch((err) => console.log(err));
};

getUsers = async (req, res) => {
	await User.find({}, (err, users) => {
		if (err) {
			return res.status(400).json({ success: false, error: err });
		}
		if (!users.length) {
			return res
				.status(404)
				.json({ success: false, error: "Users not found" });
		}
		return res.status(200).json({ success: true, data: users });
	}).catch((err) => console.log(err));
};

connectUser = async (req, res) => {
	const body = req.body;
	try {
		if (!body.emailAddress || !body.password) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י את כל השדות הנדרשים",
			});
		}

		if (!emailRegex.test(body.emailAddress)) {
			return res.status(200).json({
				success: false,
				message: "!כתובת האימייל אינה חוקית",
			});
		}

		if (body.password.length < 6) {
			return res.status(200).json({
				success: false,
				message: "!אנא הכנס/י סיסמא באורך 6 לפחות",
			});
		}

		User.findOne({ emailAddress: req.body.emailAddress }, (err, user) => {
			if (
				err ||
				!user ||
				!bcrypt.compareSync(req.body.password, user.password)
			) {
				return res.status(200).json({
					success: false,
					err,
					message: "!אימייל או סיסמא לא נכונים",
				});
			}
			const { _id, firstName, emailAddress, admin } = user;
			if (body.checked) {
				let payload = { id: _id };
				const token = jwt.sign(payload, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				return res.status(200).json({
					success: true,
					isAuthenticated: true,
					user: {
						id: _id,
						admin: admin,
						emailAddress: emailAddress,
						firstName: firstName,
					},
					token,
					cookie: body.checked ? true : false,
					message: body.checked
						? "User exist & updated & can conncet! & want cookie!"
						: "User exist & updated & can conncet! & no no cookie",
				});
				//{ expiresIn: "1h" };
				//res.send({ token });
				//res.cookie("access_token", { token }, { httpOnly: true, sameSite: true });
				// eslint-disable-next-line no-unreachable
				res.cookie("access_token", { token });
			}
			user.lastLogin = Date.now();
		});
	} catch (err) {}
};

getCookieUser = async (req, res) => {
	const authHeader = req.header.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(200).json({
			success: false,
			message: "no token!!!",
		});
	}

	console.log(token);

	return res.status(200).json({
		success: false,
		message: "!!!!!!",
	});

	// try {
	//   jwt.verify(token, SECRET);
	// } catch (err) {
	//   return res.status(403).json({
	//     success: false,
	//     message: "no verify token!!!",
	//   });
	// }

	// res.send({ token });
	// return res.status(200).json({
	//   success: true,
	//   message: "here!",
	//   cookie: x,
	// });
};

module.exports = {
	getCookieUser,
	createUser,
	updateUser,
	deleteUser,
	getUsers,
	getUserById,
	connectUser,
};
