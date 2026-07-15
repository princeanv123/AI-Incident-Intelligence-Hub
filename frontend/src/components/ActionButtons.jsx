function ActionButtons({ generateAISummary }) {

  const underConstruction = (feature) => {
    alert(`🚧 ${feature} is under construction.\n\nComing soon in the next release.`);
  };

  return (
    <div className="action-buttons">

      {/* Working Button */}
      <button onClick={generateAISummary}>
        Generate AI Summary
      </button>

      {/* Under Construction */}
      <button onClick={() => underConstruction("Escalate to xMatters")}>
        Escalate to xMatters
      </button>

      {/* Under Construction */}
      <button onClick={() => underConstruction("Create Jira Ticket")}>
        Create Jira Ticket
      </button>

    </div>
  );
}

export default ActionButtons;