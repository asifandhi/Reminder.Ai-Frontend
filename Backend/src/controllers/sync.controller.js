import { parseTextWithGemini } from "../utils/geminiService.js";
import { google } from "googleapis";
import { Task } from "../models/task.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pushToGoogleCalendar } from "./calendar.controller.js";
import { User } from "../models/user.model.js";

export const addReminder = asyncHandler(async (req, res) => {
  let calendarLink;
  const { text } = req.body;
  if (!text) throw new apiError(400, "Text is required");

  const parsed = await parseTextWithGemini(text);
  const { todos } = parsed;

  const savedTasks = [];

  for (const todo of todos) {
    const task = await Task.create({
      user: req.user?._id,
      task: todo.task,
      description: todo.description || "",
      deadline: todo.deadline || null,
      dueTime: todo.dueTime || null,
      sourceText: text,
    });

    // Push to Google Calendar if user has tokens
    if (todo.deadline) {
      try {
        const user = await User.findById(req.user._id);
        if (user?.googleTokens?.accessToken) {
          const userTokens = {
            access_token: user.googleTokens.accessToken,
            refresh_token: user.googleTokens.refreshToken,
            expiry_date: user.googleTokens.expiryDate,
          };
          const { id ,link } = await pushToGoogleCalendar(todo, userTokens);
          calendarLink = link;
          task.googleCalendarEventId = id;
          await task.save();
        }
        console.log(calendarLink);
        
      } catch (err) {
        console.warn("Calendar push skipped:", err.message);
      }
    }

    savedTasks.push(task);
  }

  return res
    .status(200)
    .json(new apiResponse(200, { tasks: savedTasks }, "Synced successfully"));
});

export const deleteReminder = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) throw new apiError(404, "Task not found");

  // Delete from Google Calendar
  if (task.googleCalendarEventId) {
    try {
      const user = await User.findById(task.user);
      if (user?.googleTokens?.accessToken) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        oauth2Client.setCredentials({
          access_token: user.googleTokens.accessToken,
          refresh_token: user.googleTokens.refreshToken,
          expiry_date: user.googleTokens.expiryDate,
        });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        await calendar.events.delete({
          calendarId: "primary",
          eventId: task.googleCalendarEventId,
        });
      }
    } catch (err) {
      console.warn("Calendar delete skipped:", err.message);
    }
  }

  await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new apiResponse(200, { taskId }, "Reminder deleted successfully"));
});

export const completeReminder = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) throw new apiError(404, "Task not found");
  task.status = "completed";
  await task.save();
  return res
    .status(200)
    .json(new apiResponse(200, { task }, "Task marked as completed"));
});

export const getPendingTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id, status: "pending" }).sort(
    { createdAt: -1 }
  );
  return res
    .status(200)
    .json(new apiResponse(200, { tasks }, "Pending tasks fetched"));
});

export const getCompletedTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user._id,
    status: "completed",
  }).sort({ updatedAt: -1 });
  return res
    .status(200)
    .json(new apiResponse(200, { tasks }, "Completed tasks fetched"));
});
