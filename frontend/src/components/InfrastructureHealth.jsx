function InfrastructureHealth() {
  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "12px",
      }}
    >
      <h2>Infrastructure Health</h2>

      <iframe
        src="http://localhost:3000/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk"
        width="100%"
        height="900"
        frameBorder="0"
        title="Grafana Dashboard"
      />
    </div>
  );
}

export default InfrastructureHealth;