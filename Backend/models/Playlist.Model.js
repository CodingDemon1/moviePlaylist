const mongoose = require("mongoose");

const PlaylistSchema = mongoose.Schema({
	title: String,
	description: String,
	isPrivate: {
		type: Boolean,
		default: false,
	},
	userID: mongoose.Schema.Types.ObjectId,
	userName: String,
	movieList: [
		{
			Title: String,
			Poster: String,
			Year: String,
			Type: String,
		},
	],
});

const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);

module.exports = { PlaylistModel };
