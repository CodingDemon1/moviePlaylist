# Movies Lovers - Movie Playlist Management App

## Summary

Movies Lovers is a web application that allows users to search for movies, create and manage playlists, and add movies to those playlists. Users can register and log in to create their own playlists, both public and private. The app utilizes the OMDB API to retrieve movie information.

## Routes and Details

- **Frontend**: The frontend of the application is built using HTML, CSS, and JavaScript. Users can search for movies using the OMDB API and interact with their playlists.

- **Backend**: The backend is built using Node.js and Express.js. It handles user registration, login, playlist management, and movie additions. It uses MongoDB to store user data and playlist information.

### User Routes

- `POST /user/register`: Register a new user.
- `POST /user/login`: Log in a user.

### Playlist Routes

- `GET /playlist/names/:uid`: Get playlist names by user ID.
- `GET /playlist/getPL/:uid`: Get all playlists of a user.
- `GET /playlist/getOthersPL/:uid`: Get public playlists of other users.
- `POST /playlist/add`: Add a new playlist.
- `DELETE /playlist/deletePL/:pid`: Delete a playlist.
- `GET /playlist/getCurrPLMovies/:pId`: Get movies in a specific playlist.

### Movie Routes

- `POST /playlist/addMovie/:pid`: Add a movie to a playlist.
- `DELETE /playlist/:pId/delete/:mId`: Delete a movie from a playlist.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- External API: OMDB API

## Area of Improvement

- Enhanced UI/UX for the frontend.
- Adding more advanced search options for movies.
- Adding the ability to rate and review movies.
- Implementing user profile customization.
- Adding password recovery functionality.

## Made with ❤️ by a Proudly Indian
