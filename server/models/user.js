const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	location: { type: String },
	yearsOfExperience: { type: Number },
	skills: [{ type: String }],
	preferredJobType: {
		type: String,
		enum: ["remote", "onsite", "any"],
		default: "any",
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		process.env.JWTPRIVATEKEY,
		{ expiresIn: "7d" }
	);
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		location: Joi.string().allow("").label("Location"),
		yearsOfExperience: Joi.number().min(0).allow(null).label("Years of Experience"),
		skills: Joi.array().items(Joi.string()).label("Skills"),
		preferredJobType: Joi.string()
			.valid("remote", "onsite", "any")
			.label("Preferred Job Type"),
		isAdmin: Joi.boolean(),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
