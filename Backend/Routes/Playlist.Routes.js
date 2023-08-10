const {
	AddAMovieToSelectedPlaylist,
	DeleteAMovieFromTheSelectedPlaylist,
} = require("../Controllers/Movies.Controllers");
const {
	GetPlaylistNameByUserId,
	GetAllPlaylistOfTheUser,
	GetOtherUsersPublicPlaylist,
	AddAPlaylist,
	DeleteAPlaylist,
	GetCurrentPlaylistSelectedByUser,
} = require("../Controllers/Playlist.Controllers");
const { verify } = require("../Middlewares/JWTAuthentication");

const PlaylistRouter = require("express").Router();

// get Playlist name
PlaylistRouter.get("/names/:uid", GetPlaylistNameByUserId);

//  get Playlist by user ID
PlaylistRouter.get("/getPL/:uid", GetAllPlaylistOfTheUser);

//  get all Playlist
PlaylistRouter.get("/getOthersPL/:uid", GetOtherUsersPublicPlaylist);

// Add Playlist
PlaylistRouter.post("/add", verify, AddAPlaylist);

// Delete Playlist
PlaylistRouter.delete("/deletePL/:pid", verify, DeleteAPlaylist);

// Get Current / Single playlist
PlaylistRouter.get("/getCurrPLMovies/:pId", GetCurrentPlaylistSelectedByUser);

// -----------------------End Playlist------------------------
// Add Movies
PlaylistRouter.post("/addMovie/:pid", verify, AddAMovieToSelectedPlaylist);

// delete Movie from playlist
PlaylistRouter.delete(
	"/:pId/delete/:mId",
	verify,
	DeleteAMovieFromTheSelectedPlaylist
);

module.exports = { PlaylistRouter };
