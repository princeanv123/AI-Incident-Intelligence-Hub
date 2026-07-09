const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

// ======================
// Initialize Express
// ======================
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ======================
// Initialize Gemini
// ======================
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("====================================");
console.log("AI Incident Intelligence Hub");
console.log("Gemini Loaded:", !!process.env.GEMINI_API_KEY);
console.log("====================================");

// ======================
// Health Check
// ======================
app.get("/", (req, res) => {
  res.send("🚀 AI Incident Intelligence Hub Backend Running");
});
// ======================
// Get Incident from ServiceNow
// ======================

app.get("/api/incident/:incidentNumber", async (req, res) => {

  try {

    const incidentNumber = req.params.incidentNumber;

    console.log("Searching Incident:", incidentNumber);

    const response = await axios.get(
      `${process.env.INSTANCE_URL}/api/now/table/incident`,
      {
        params: {
          sysparm_query: `number=${incidentNumber}`,
          sysparm_display_value: true,
        },
        auth: {
          username: process.env.SN_USERNAME,
          password: process.env.SN_PASSWORD,
        },
      }
    );

    console.log("Incident Retrieved Successfully");

    res.json(response.data.result);

  } catch (error) {

    console.error("ServiceNow Error:");

    if (error.response) {
      console.error(error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({
      error: "Unable to fetch incident from ServiceNow",
    });

  }

});
// ======================
// Generate AI Summary
// ======================
app.post("/api/summary", async (req, res) => {

  try {

    const { incident } = req.body;

    if (!incident) {
      return res.status(400).json({
        error: "Incident details are required."
      });
    }

    console.log("Generating AI Summary...");

    const prompt = `
You are an IT Incident Management expert.

Analyze the following ServiceNow incident and provide:

1. Executive Summary
2. Business Impact
3. Probable Root Cause
4. Recommended Resolution
5. Priority Recommendation

Incident Details:

${incident}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary = response.text || "No AI summary generated.";

    console.log("AI Summary Generated");

    res.json({
      summary,
    });

  } catch (error) {

    console.error("Gemini Error:", error);

    res.status(500).json({
      error: "Unable to generate AI Summary"
    });

  }

});
// ======================
// Escalate to xMatters
// ======================
app.post("/api/xmatters", async (req, res) => {

  try {

    const { incident } = req.body;

    console.log("Sending incident to xMatters...");

    const response = await axios.post(
      process.env.XMATTERS_WEBHOOK,
      {
        application: incident.application,
        priority: incident.priority,
        severity: incident.severity,
        status: incident.status,
        team: incident.team,
        summary: incident.summary
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("xMatters Response:", response.data);

    res.json({
      success: true,
      message: "Incident escalated to xMatters successfully!"
    });

  } catch (error) {

    console.error("xMatters Error:");

    if (error.response) {
      console.error(error.response.data);
    }

    res.status(500).json({
      success: false,
      message: "Failed to escalate incident to xMatters"
    });

  }

});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});