const { PlaylistModel } = require("../models/Playlist.Model");

// Add MOvie to Playlist
const AddAMovieToSelectedPlaylist = async (req, res) => {
	try {
		console.log(req.body);
		const playlistID = req.params.pid;
		const { Title, Poster, Year, Type } = req.body;

		const playlist = await PlaylistModel.findById(playlistID);

		const isExist = playlist.movieList.find((item) => item.Title == Title);

		if (isExist) {
			return res
				.status(300)
				.json({ msg: "Movie already Present ", flag: false });
		}

		playlist.movieList.push({ Title, Poster, Year, Type });
		await playlist.save();

		res.status(200).json({
			flag: true,
			msg: "Movie Added Successfully...",
			data: { Title, Poster, Year, Type },
		});
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

// Delete movie From Playlist
const DeleteAMovieFromTheSelectedPlaylist = async (req, res) => {
	try {
		const { pId, mId } = req.params;

		const playlist = await PlaylistModel.findById(pId);

		const isExist = playlist.movieList.find((item) => item._id == mId);

		if (!isExist) {
			return res.status(404).json({ msg: "Movie Not Found ", flag: false });
		}
		const deleteMovie = await PlaylistModel.findByIdAndUpdate(pId, {
			$pull: {
				movieList: {
					_id: mId,
				},
			},
		});

		if (!deleteMovie) {
			return res.status(400).json({ msg: "Something went wrong", flag: false });
		}

		res.status(200).json({
			flag: true,
			msg: "Movie Deleted Successfully...",
		});
	} catch (error) {
		res.status(400).json({ msg: error.message, flag: false });
	}
};

module.exports = {
	AddAMovieToSelectedPlaylist,
	DeleteAMovieFromTheSelectedPlaylist,
};
