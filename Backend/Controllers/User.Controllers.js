const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.Model");

const UserLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const isUserExist = await UserModel.findOne({ email });

		if (!isUserExist) {
			return res.status(404).json({
				msg: "User Not Found. Please Register",
				flag: false,
			});
		}

		const isPasswordMatching = bcrypt.compareSync(
			password,
			isUserExist.password
		);

		if (!isPasswordMatching) {
			return res.status(400).json({
				msg: "Wrong Credentials",
				flag: false,
			});
		}

		const token = jwt.sign(
			{ userId: isUserExist._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({
			msg: "Login Successful",
			response: true,
			token,
			name: isUserExist.name.split(" ")[0],
			uId: isUserExist._id,
		});
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

const UserRegister = async (req, res) => {
	try {
		const { email, name, password, mobile } = req.body;

		const isUserExist = await UserModel.findOne({ email });

		if (isUserExist) {
			return res.status(400).json({
				msg: "User Already Exist, Please Login!!!",
				flag: false,
			});
		}

		const hashedPassword = bcrypt.hashSync(password, 5);

		const newUser = new UserModel({
			email,
			name,
			password: hashedPassword,
			mobile,
		});

		await newUser.save();

		res.status(200).json({
			msg: "User Registration Successful",
			response: true,
		});
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

module.exports = { UserLogin, UserRegister };
