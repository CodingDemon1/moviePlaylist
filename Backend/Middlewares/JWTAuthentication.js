require("dotenv").config();
const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
	try {
		const token = req.header("Auth");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			req.body.userId = decoded.id;
			next();
		} else {
			res.status(400).send({ flag: false, msg: "You are not Authorized" });
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
};

module.exports = { verify };
