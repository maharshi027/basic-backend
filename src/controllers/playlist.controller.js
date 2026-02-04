import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
    // Logic to create a new playlist
    const { name, description } = req.body;
    const owner = req.user._id; 
});
const getUserPlaylists = asyncHandler(async (req, res) => {
    // Logic to get all playlists of a user
    const owner = req.user._id; 
});

const getPlaylistById = asyncHandler(async (req, res) => {
    // Logic to get a playlist by its ID
    const { playlistId } = req.params; 
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    // Logic to add a video to a playlist
    const { playlistId } = req.params;
    const { videoId } = req.body;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // Logic to remove a video from a playlist
    const { playlistId } = req.params;
    const { videoId } = req.body;
});
const deletePlaylist = asyncHandler(async (req, res) => {
    // Logic to delete a playlist
    const { playlistId } = req.params; 
});     

export {
    createPlaylist,
    getUserPlaylists,   
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
}