function ActionButtons({
  generateAISummary,
  escalateToXMatters,
  createJiraTicket
}) {
  return (
    <div className="action-buttons">
      <button onClick={generateAISummary}>
        Generate AI Summary
      </button>

      <button onClick={escalateToXMatters}>
        Escalate to xMatters
      </button>

      <button onClick={createJiraTicket}>
        Create Jira Ticket
      </button>
    </div>
  );
}

export default ActionButtons;