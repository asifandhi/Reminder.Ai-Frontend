import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    refreshToken: {
      type: String,
    },
    googleTokens: {
      accessToken: {
        type: String,
      },
      refreshToken: {
        type: String,
      },
      expiryDate: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return ; 
    this.password = await bcrypt.hash(this.password,10);
    

})

userSchema.methods.isPasswordCorrect = async function (InPassword){
    return await bcrypt.compare(InPassword,this.password);
} 

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            userId:this._id,
            email:this.email

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            userId:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}
export const User = mongoose.model("User", userSchema);
