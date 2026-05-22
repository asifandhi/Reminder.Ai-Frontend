import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = `You are a task extraction assistant. Extract actionable tasks from the user's message.
Return ONLY valid JSON, no markdown, no explanation, no code blocks.
Use this exact schema:
{
  "todos": [
    {
      "task": "short clear action title (e.g. Submit Internship Offer Letter)",
      "description": "any extra context, links, instructions from the message",
      "deadline": "YYYY-MM-DD or null",
      "dueTime": "HH:MM (24hr) or null"
    }
  ]
}
Rules:
- task: short, action-oriented title (verb + object)
- description: include URLs, form links, extra instructions if present
- deadline: extract from message, use YYYY-MM-DD format
- dueTime: only if a specific time is mentioned, else null
- If no tasks found, return { "todos": [] }
Today's date is ${new Date().toISOString().split("T")[0]}.`;

export const parseTextWithGemini = async (rawText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(PROMPT + "\n\nMessage: " + rawText);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};