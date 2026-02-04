import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    // Logic to get all videos
    const { page =1, limit = 10, query, sortBy, sortType, userId } = req.query
    

})

const publishVideo = asyncHandler(async (req, res) => {
    // Logic to publish a new video
    const { title, description, thumbnail, videoUrl, } = req.body
    
    if(!title?.trim() || !description?.trim() || !req.file){
        throw new ApiError(400, "All fields are required")
    }

    

    const newVideo = Video.create({
        title : title.trim(),
        description : description.trim(),
        thumbnail : thumbnail?.trim() || "",
        videoUrl,
        uploadedBy : req.user._id
    })
    res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    // Logic to get a video by its ID
    const { videoId } = req.params

})
const updateVideo = asyncHandler(async (req, res) => {
    // Logic to update video details
    const { videoId } = req.params  
})
const deleteVideo = asyncHandler(async (req, res) => {
    // Logic to delete a video
    const { videoId } = req.params  
});

export {
    getAllVideos,
    publishVideo,  
    getVideoById,
    updateVideo,
    deleteVideo
}
