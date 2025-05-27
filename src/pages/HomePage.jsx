import { Link } from "react-router-dom";

export function HomePage() {

  const handleReset = () => {
    if (window.confirm("This will delete all data and reset the tourneament.")) {
      localStorage.removeItem('StartupPairs');
      localStorage.removeItem('StartupList');
      localStorage.removeItem('StartupChampion')
      localStorage.removeItem('StartupRoundNumber')
      alert("All data has been reseted.");
      window.location.reload();
    }
  };

  return (
    <div className="home_wrapper">
      <header className="top_header">
      <h1>Startup Rush</h1>
      <a href="https://www.linkedin.com/in/matheus-salgado02"  className="contact_link">Contact</a>
      </header>
      <div className="main_layout">
      <div className="light_section">

      <div className="main_content">
          <h2 className="subtitle">Select an option</h2>
          <div className="option_block">
            <h3>1. Sign up startups</h3>
            <Link to="/SignPage"><button>Select</button></Link>
            </div>
            <div className="option_block">
              <h3>2. Create bracket</h3>
              <Link to="/BracketPage"><button>Select</button></Link>
            </div>
            <div className="option_block">
              <h3>3. Battles</h3>
              <Link to="/Battles"><button>Select</button></Link>
            </div>
            <div className="option_block">
              <h3>4. Results</h3>
              <Link to="/Results"><button>Select</button></Link>
          </div>
          <div className="option_block reset_block">
            <h3>Reset Data</h3>
            <button onClick={handleReset} className="reset_button">Reset All Data</button>
        </div>
        </div>
      </div>
      <div className="dark_section"></div>
    </div>
    </div>
  );

  
}