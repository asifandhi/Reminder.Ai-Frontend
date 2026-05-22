import { google } from "googleapis";
import { User } from "../models/user.model.js";


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


oauth2Client.on("tokens", async (tokens) => {
  storedTokens = { ...storedTokens, ...tokens };
  await User.findOneAndUpdate(
    { "googleTokens.accessToken": { $exists: true } },
    {
      googleTokens: {
        accessToken: tokens.access_token ?? storedTokens.access_token,
        refreshToken: tokens.refresh_token ?? storedTokens.refresh_token,
        expiryDate: tokens.expiry_date ?? storedTokens.expiry_date,
      },
    }
  );
  console.log("Google tokens auto-refreshed and saved to DB");
});

// ✅ Module-level store — survives across all requests
let storedTokens = null;

// Step 1: Redirect to Google login
export const getAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    state: req.user._id.toString(),
  });
  res.redirect(url);
};

// Step 2: Google callback — save tokens globally
export const handleCallback = async (req, res) => {
  const { code,state } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  storedTokens = tokens;  
  console.log("Stored tokens : ", storedTokens);
  

  await User.findByIdAndUpdate(
    state,{
      googleTokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
      }
    }
  );
  res.redirect(`${process.env.FRONTEND_URL}/settings`);
};

 

// ✅ Reusable helper for sync.controller.js
export const pushToGoogleCalendar = async (taskData) => {

  if (!storedTokens) {
    const user = await User.findOne({ "googleTokens.accessToken": { $exists: true } });
    if (!user) throw new Error("Not connected to Google. Visit /api/calendar/auth first.");
    storedTokens = {
      access_token: user.googleTokens.accessToken,
      refresh_token: user.googleTokens.refreshToken,
      expiry_date: user.googleTokens.expiryDate,
    };
  }
   
  oauth2Client.setCredentials(storedTokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  let calEvent;

  if (taskData.dueTime) {
    // Timed event
    const [hours, minutes] = taskData.dueTime.split(":");
    const start = new Date(`${taskData.deadline}T${taskData.dueTime}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30min duration
    const endTime = `${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`;

    calEvent = {
      summary: taskData.task,
      description: taskData.description || "",
      start: { dateTime: `${taskData.deadline}T${taskData.dueTime}:00`, timeZone: "Asia/Kolkata" },
      end: { dateTime: `${taskData.deadline}T${endTime}:00`, timeZone: "Asia/Kolkata" },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
    };
  } else {
    // All-day event
    calEvent = {
      summary: taskData.task,
      description: taskData.description || "",
      start: { date: taskData.deadline },
      end: { date: taskData.deadline },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 480 }] },
    };
  }

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: calEvent,
  });

  return { id: response.data.id, link: response.data.htmlLink };
};