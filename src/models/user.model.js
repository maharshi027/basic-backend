import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'


const userSchema = new Schema(
    {
        fullName :{
            type : String,
            required:true,
            trim:true,
            index:true
        },
        username :{
            type : String,
            required:true,
            unique : true,
            lowercase : true,
            trim: true,
            index : true
        },
        email :{
            type : String,
            required:true,
            unique : true,
            lowercase : true,
            trim: true
        },
        password:{
            type: String,
            required: [true, "Password is Required"]

        },
        avatar : {
            type:String, // cloudnary url
            required: true,
        },
        coverImage : {
            type:String, // cloudnary url
            default : ""
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshToken: {
            type: String
        }
    },
   {
    timestamps:true
   }
)

userSchema.pre("save", async function (next) {
    if ( ! this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id : this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}
export const User = mongoose.model("User", userSchema);