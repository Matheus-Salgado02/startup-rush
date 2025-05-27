import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const eventLabels = {
  pitches: "Convincing Pitch",
  bugs: "Buggy Product",
  tractions: "Strong User Traction",
  angryInvestors: "Angry Investors",
  fake_news: "Fake News in Pitch",
};

export function Results() 
{
  const [startupList, setStartupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState(() => Object.fromEntries(Object.keys(eventLabels).map(key => [key, 0]))
  );

  useEffect(() => {
    const stored = localStorage.getItem("StartupList");
    const parsed = JSON.parse(stored || "[]");

    const startups = parsed.map(startup => 
      {
      const { eventCounts = {} } = startup;
        return {...startup,points: startup.points ?? 70,stats: {
            pitches: eventCounts["Convincing Pitch"] || 0,
            bugs: eventCounts["Buggy Product"] || 0,
            tractions: eventCounts["Strong User Traction"] || 0,
            angryInvestors: eventCounts["Angry Investor"] || 0,
            fake_news: eventCounts["Fake News in Pitch"] || 0,
          },};}).sort((a, b) => b.points - a.points);

    const newTotals = { ...totals};
    for (const startup of startups) {
      for (const key in newTotals) {
        newTotals[key] += startup.stats[key] || 0;
      }
    }

    setStartupList(startups);
    setTotals(newTotals);
    setLoading(false);
  }, 
  []
  );
  const sortedEventStats = Object.entries(totals).map(([key, count]) => ({ label: eventLabels[key], count })).sort((a, b) => b.count - a.count);
  return (
    <div className="home_wrapper">
      <Link to="/"> <button id="back_button">Home</button></Link>
      <header className="top_header">
        <h1>Startup Rush</h1>
        <a href="https://www.linkedin.com/in/matheus-salgado02" className="contact_link"> Contact </a>
      </header>
      <div className="main_layout">
      <div className="light_section">
        <div className="main_content">
          <h3>Results</h3>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : startupList.length ? (
              <>
                <div className="results_table_container">
                  <table className="results_table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Startup</th>
                        <th>Points</th>
                        {Object.values(eventLabels).map(label => (<th key={label}>{label}</th>))}
                      </tr>
                    </thead>
                    <tbody>
                      {startupList.map((startup, index) => (
                        <tr key={startup.nameList || index}>
                        <td>{index + 1}</td>
                         <td>
                          <strong>{startup.nameList}</strong>
                        <br/>
                          <small>"{startup.sloganList}"</small>
                        </td>
                        <td>{startup.points}</td>
                        {Object.keys(eventLabels).map(key => (<td key={key}>{startup.stats[key]}</td>))}
                        </tr>))}
                  </tbody>
                  </table>
                </div>

                <div className="event_ranking" style={{ marginTop: 40 }}>
                  <h4>Event Frequency Ranking</h4>
                  <table className="results_table" style={{ maxWidth: 500, margin: "0 auto" }}>
                    <thead>
                      <tr>
                     <th>Event Type</th>
                      <th>Total Occurrences</th>
                     </tr>
                    </thead>
                    <tbody>
                      {sortedEventStats.map(({ label, count }) => (<tr key={label}> <td>{label}</td> <td>{count}</td> </tr>)) }
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="no_results">
                <p>No results available yet.</p>
                <div className="option_block">
                  <Link to="/battles"><button>Go to Battles</button></Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="dark_section"></div>
      </div>
    </div>
  );
}
