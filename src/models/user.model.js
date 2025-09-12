import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username :{
            type : String,
            required:true,
            unique : true,
            lowercase : true
        }
    }
)



export const Users = mongoose.model("User", userSchema);