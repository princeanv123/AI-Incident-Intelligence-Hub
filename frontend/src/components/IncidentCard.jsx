function IncidentCard({ result }) {

  if (!result) return null;

  return (

    <div>

      <h2>Incident Details</h2>

      <p>Application : {result.application}</p>

      <p>Priority : {result.priority}</p>

      <p>Severity : {result.severity}</p>

      <p>Status : {result.status}</p>

      <p>Assigned Team : {result.team}</p>

    </div>

  );

}

export default IncidentCard;