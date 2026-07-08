function ActionButtons({ generateAISummary }) {
  return (
    <div className="action-buttons">
      <button onClick={generateAISummary}>
        Generate AI Summary
      </button>

      <button>
        Escalate to xMatters
      </button>

      <button>
        Create Jira Ticket
      </button>
    </div>
  );
}

export default ActionButtons;