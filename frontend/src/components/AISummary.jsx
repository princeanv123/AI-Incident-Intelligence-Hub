import ReactMarkdown from "react-markdown";

function AISummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary-card">
      <h2>AI Summary</h2>

      <ReactMarkdown>
        {summary}
      </ReactMarkdown>
    </div>
  );
}

export default AISummary;