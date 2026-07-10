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
      <h2>Infrastructure Health Dashboard</h2>

      <p style={{ color: "#555", marginBottom: "15px" }}>
        Live infrastructure metrics powered by Grafana, Prometheus, and Node
        Exporter. This dashboard helps correlate incident details with
        real-time system health.
      </p>

      <iframe
        src="http://localhost:3000/d/rYdddlPWk/node-exporter-full?orgId=1&from=now-24h&to=now&timezone=browser&var-ds_prometheus=afrm4aq2wnhfke&var-job=node_exporter&var-nodename=07b0c487a897&var-node=node-exporter:9100&refresh=1m&kiosk"
        width="100%"
        height="700"
        title="Infrastructure Dashboard"
        style={{
          border: "none",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}

export default InfrastructureHealth;