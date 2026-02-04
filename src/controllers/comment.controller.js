import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    // Logic to get comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query; 
    
})
const addComment = asyncHandler(async (req, res) => {
    // Logic to add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;   

});

const updateComment = asyncHandler(async (req, res) => {
    // Logic to update a comment
    const { commentId } = req.params;
    const { content } = req.body;

});

const deleteComment = asyncHandler(async (req, res) => {
    // Logic to delete a comment
    const { commentId } = req.params;

});

export {
    getVideoComments,
    addComment,
    deleteComment,
    updateComment
}