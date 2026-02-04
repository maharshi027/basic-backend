import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"; 


const getUserChannelProfile = asyncHandler(async (req, res) => {
    // get user channel profile controller
   const { username } =  req.params
   
   if(!username?.trim()){
    throw new ApiError(400, "Username is missing")

   }
   const channel = await User.aggregate([
    {
        $match: {
            username : username?.toLowerCase()
        },
    },
    {  
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as : "subscribers"
        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as : "subscribed"
        }
    },
    {
        $addFields: {
            subscribersCount: {
                $size: "$subscribers"
            },
            channelSubscribedCount: {
                $size: "$subscribed"
            },
            isSubscribed: {
                $cond:{
                    if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                    then : true,
                    else: false
               }
            }
        }
    },
    {
        $project: {
            fullName: 1,
            subscribersCount: 1,
            channelSubscribedCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            username: 1
        }
    }
   ])
    if(!channel || channel.length === 0){
    throw new ApiError(404, "Channel not found")
   }

   return res.status(200).json(new ApiResponse(200, channel[0], "User channel profile fetched successfully"))

})
export {
    getUserChannelProfile,
}   
