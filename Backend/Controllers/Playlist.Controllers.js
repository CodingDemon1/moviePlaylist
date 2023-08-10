const { PlaylistModel } = require("../models/Playlist.Model");

const GetPlaylistNameByUserId = async (req, res) => {
	try {
		const userID = req.params.uid;
		const result = await PlaylistModel.find({ userID }).select({
			title: 1,
			_id: 1,
		});
		res.status(200).json({ flag: true, data: result, msg: "Data Fetched" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message, flag: false });
	}
};

const GetAllPlaylistOfTheUser = async (req, res) => {
	try {
		const userID = req.params.uid;
		const allPlaylist = await PlaylistModel.find({ userID });

		res
			.status(200)
			.json({ flag: true, length: allPlaylist.length, data: allPlaylist });
	} catch (error) {
		res.status(400).json({ flag: false, msg: error.message });
	}
};

const GetOtherUsersPublicPlaylist = async (req, res) => {
	try {
		const userID = req.params.uid;
		const allPlaylist = await PlaylistModel.find({
			isPrivate: false,
			userID: { $ne: userID },
		});

		res
			.status(200)
			.json({ flag: true, length: allPlaylist.length, data: allPlaylist });
	} catch (error) {
		res.status(400).json({ flag: false, msg: error.message });
	}
};

const AddAPlaylist = async (req, res) => {
	try {
		const { userID, title, description, isPrivate } = req.body;

		const isExist = await PlaylistModel.findOne({ title, userID });
		console.log(isExist);
		if (isExist) {
			return res.status(300).json({ flag: false, msg: "Already Exists" });
		}
		const isP = isPrivate == "True" ? true : false;
		const newPlaylist = new PlaylistModel({
			userID,
			title,
			description,
			isPrivate: isP,
		});

		await newPlaylist.save();

		res.status(200).json({
			flag: true,
			msg: "Playlist Created Successfully",
			data: newPlaylist,
		});
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

const DeleteAPlaylist = async (req, res) => {
	try {
		const pid = req.params.pid;

		const delPl = await PlaylistModel.findByIdAndDelete(pid);

		if (!delPl) {
			return res.status(400).json({ flag: false, msg: "Something Went wrong" });
		}

		res
			.status(200)
			.json({ flag: true, msg: "Playlist Delete Successfully!!!" });
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

const GetCurrentPlaylistSelectedByUser = async (req, res) => {
	try {
		const playlistID = req.params.pId;
		const currPlaylist = await PlaylistModel.findById(playlistID);

		res.status(200).json({
			flag: true,
			length: currPlaylist.length,
			data: currPlaylist.movieList,
		});
	} catch (error) {
		res.status(400).json({ flag: false, msg: error.message });
	}
};
module.exports = {
	GetPlaylistNameByUserId,
	GetAllPlaylistOfTheUser,
	GetOtherUsersPublicPlaylist,
	AddAPlaylist,
	DeleteAPlaylist,
	GetCurrentPlaylistSelectedByUser,
};
