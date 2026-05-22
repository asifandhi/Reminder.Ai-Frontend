import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave : false });
    
    return { accessToken, refreshToken };
  } catch (error) {
      console.error("generateTokens error:", error.message);
    throw new apiError(500, "Unable to generate tokens");
  }
};
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  
  sameSite: "lax",
};
 const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "All fields are required");
  }

  const exists = await User.findOne({ email });
  if (exists) throw new apiError(409, "Email already registered");

  const user = await User.create({ name, email, password });

  const created = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new apiResponse(201, created, "Registered successfully"));
});

 const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new apiError(400, "Email and password required");

  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "User not found");

  const valid = await user.isPasswordCorrect(password);
  if (!valid) throw new apiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedIn, accessToken, refreshToken },
        "Logged in"
      )
    );
});

 const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out"));
});

 const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) throw new apiError(401, "Refresh token required");

 try {
     const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
     const user = await User.findById(decoded.userId);
   
     if (!user || user.refreshToken !== incomingRefreshToken) {
       throw new apiError(401, "Invalid or expired refresh token");
     }
   
     const { accessToken, refreshToken } = await generateTokens(user._id);
   
     return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(new apiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
 } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
 }
});

 const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new apiResponse(200, req.user, "Current user"));
});

 const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) throw new apiError(400, "Both passwords required");
  
    const user = await User.findById(req.user._id);
    const valid = await user.isPasswordCorrect(oldPassword);
    if (!valid) throw new apiError(401, "Old password incorrect");
  
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
  
    return res.status(200).json(new apiResponse(200, {}, "Password changed"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Unable to change password");
    
  }

});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword
}
