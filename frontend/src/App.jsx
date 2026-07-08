import { useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import IncidentCard from "./components/IncidentCard";
import AISummary from "./components/AISummary";
import ActionButtons from "./components/ActionButtons";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  const [incident, setIncident] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // ==========================
  // Search Incident
  // ==========================
  const searchIncident = async () => {
    setLoading(true);
    setResult(null);
    setSummary("");

    try {
      const response = await axios.get(
        `http://localhost:5001/api/incident/${incident}`
      );
console.log("Response received:", response);
console.log("Response data:", response.data);
      if (response.data.length > 0) {
        const data = response.data[0];

        setResult({
          application: data.cmdb_ci?.display_value || "Unknown",
          priority: data.priority,
          severity: data.severity,
          status: data.state,
          team: data.assignment_group?.display_value || "Not Assigned",
          summary: data.short_description,
        });
      } else {
        alert("Incident Not Found");
      }
    } catch (err) {
      console.log("FULL ERROR:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }

      alert("Unable to connect to ServiceNow");
    }

    setLoading(false);
  };

  // ==========================
  // Generate AI Summary
  // ==========================
  const generateAISummary = async () => {
    console.log("Generate AI Summary button clicked");

    try {
      if (!result) {
        alert("Please search for an incident first.");
        return;
      }

      const incidentText = `
Application: ${result.application}
Priority: ${result.priority}
Severity: ${result.severity}
Status: ${result.status}
Assignment Group: ${result.team}
Description: ${result.summary}
`;

      console.log("Calling Gemini API...");

      const response = await axios.post(
        "http://localhost:5001/api/summary",
        {
          incident: incidentText,
        }
      );

      console.log("Gemini Response:", response.data);
      console.log("Summary:", response.data.summary);

      setSummary(response.data.summary);

      alert("AI Summary Generated Successfully");
    } catch (err) {
      console.error("Frontend Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }

      alert("Unable to generate AI Summary");
    }
  };

  return (
    <div className="App">
      <Header />

      <SearchBar
        incident={incident}
        setIncident={setIncident}
        searchIncident={searchIncident}
      />

      {loading && (
        <div className="loading">
          🔍 Searching incident...
        </div>
      )}

      {result && (
        <>
          <IncidentCard result={result} />

          <AISummary summary={summary || result.summary} />

          <ActionButtons
            generateAISummary={generateAISummary}
          />
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;