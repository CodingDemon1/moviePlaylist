const express = require("express");
const cors = require("cors");
const { connection } = require("./Config/db");
const { UserRouter } = require("./Routes/User.Routes");
const { PlaylistRouter } = require("./Routes/Playlist.Routes");

require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

// --------------Routes Starts-----------------
app.get("/", (req, res) => {
	res.status(200).send("Basic Endpoint");
});

app.use("/user", UserRouter);
app.use("/playlist", PlaylistRouter);

// --------------Routes Ends-----------------

app.listen(port, async () => {
	try {
		await connection();
		console.log("Connected to db");
	} catch (error) {
		console.log(error.message);
	}
	console.log(`Listening @ port number ${port}`);
});
