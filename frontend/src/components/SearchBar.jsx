function SearchBar({ incident, setIncident, searchIncident }) {
  return (
    <div style={{ marginTop: "25px" }}>
      <input
        type="text"
        placeholder="Enter Incident Number"
        value={incident}
        onChange={(e) => setIncident(e.target.value)}
      />

      <button onClick={searchIncident}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;