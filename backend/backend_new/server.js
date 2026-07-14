const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini Loaded:", !!process.env.GEMINI_API_KEY);
const app = express();

app.use(cors());
app.use(express.json());

    // Sample Incident Data
    const incidents = [
    {
        id: "INC001245",
        application: "Workday",
        priority: "P1",
        severity: "High",
        status: "Open",
        team: "Database Team",
        summary:
        "Database connection pool is exhausted due to high API traffic. AI recommends restarting the database service and scaling connection limits."
    },
    {
        id: "INC001246",
        application: "SAP",
        priority: "P2",
        severity: "Medium",
        status: "In Progress",
        team: "SAP Team",
        summary:
        "Background jobs are delayed due to heavy processing. AI recommends checking batch jobs and increasing processing capacity."
    }
    ];

    // Home API
    app.get("/", (req, res) => {
    res.send("🚀 AI Incident Intelligence Hub Backend is Running");
    });

    app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});
    const PORT = process.env.PORT || 5001;


   app.get("/api/incident/:number", async (req, res) => {
  try {

    console.log("Searching:", req.params.number);
console.log("INSTANCE_URL:", process.env.INSTANCE_URL);
console.log("USERNAME:", process.env.SN_USERNAME);
console.log("Password Loaded:", !!process.env.SN_PASSWORD);
    const response = await axios.get(
      `${process.env.INSTANCE_URL}/api/now/table/incident`,
      {
        auth: {
          username: process.env.SN_USERNAME,
          password: process.env.SN_PASSWORD,
        },
        params: {
          sysparm_query: `number=${req.params.number}`,
          sysparm_limit: 1,
        },
      }
    );

    console.log(response.data);

    res.json(response.data.result);

  } catch (err) {

    console.log("========== ERROR ==========");
console.log("Message:", err.message);

if (err.response) {
  console.log("Status:", err.response.status);
  console.log("Data:", err.response.data);
}

    res.status(500).json({
      error: "Unable to fetch incident"
    });

  }
});
// =============================
// Generate AI Summary using Gemini
// =============================
console.log("Summary API route registered");
// =============================
// Test API
// =============================
app.post("/api/test", (req, res) => {

  console.log("===== TEST ROUTE HIT =====");
  console.log(req.body);

  res.json({
    success: true,
    message: "Test route is working!"
  });

});
 

app.post("/api/summary", async (req, res) => {

  console.log("===== SUMMARY API CALLED =====");
  console.log(req.body);

  try {

    const { incident } = req.body;

    if (!incident) {
      return res.status(400).json({
        error: "Incident details are required.",
      });
    }

    const prompt = `
You are an IT Operations AI Assistant.

Summarize the following ServiceNow incident in simple business language.

Incident Details:
${incident}

Provide:
1. Summary
2. Possible Root Cause
3. Recommended Next Step
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("Gemini raw response:");
    console.dir(response, { depth: null });

    res.json({
      summary: response.text,
    });

} catch (error) {

  console.log("========== GEMINI ERROR ==========");
  console.error(error);

  if (error.response) {
    console.log(error.response.data);
  }

  if (error.stack) {
    console.log(error.stack);
  }

  res.status(500).json({
    error: error.message,
  });
  }
});
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });