import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Bracket() {
    const [startups, setStartups] = useState([]);
    const [pairs, setPairs] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [tournamentStarted, setTournamentStarted] = useState(false);
    const [hasChampion, setHasChampion] = useState(false);

    useEffect(() => {
        const saved_startups = localStorage.getItem('StartupList');
        const saved_pairs = localStorage.getItem('StartupPairs');
        
        if (saved_startups) {
            setStartups(JSON.parse(saved_startups));
        }
        if (saved_pairs) {
            const duels = JSON.parse(saved_pairs);
            setPairs(duels);
            setTournamentStarted(duels.length > 0);
            

            if (duels.length === 1 && duels[0].winner) {
                setHasChampion(true);
            }
        }
    }, []);

    const removeStartup = (index) => {
        if (tournamentStarted) {
            alert("Cannot remove startups after tournament has started!");
            return;
        }
        
        const new_startups=startups.filter((_, i)=> i !== index);
        setStartups(new_startups);
        localStorage.setItem('StartupList', JSON.stringify(new_startups));
    };

    function handleClick() {
        if (tournamentStarted && !hasChampion) {
            alert("Tournament already in progress. Finish all battles or reset the tournament.");
            return;
        }

        if (hasChampion) {
            alert("This tournament already has a champion. Please reset to start a new one.");
            return;
        }

        if (startups.length % 2 !== 0 || startups.length < 4 || startups.length === 6) {
            alert("You need 4 or 8 startups to begin!");
            return;
        }
        
        const shuffled = [...startups].sort(() => 0.5 - Math.random());
        const new_pairs = [];
        
        for (let i = 0; i < shuffled.length; i += 2) {
            new_pairs.push({
                pairId: i/2 + 1,
                startup1: shuffled[i],
                startup2: shuffled[i + 1],
                winner: null
            });
        }

        setPairs(new_pairs);
        setTournamentStarted(true);
        setHasChampion(false);
        localStorage.setItem('StartupPairs', JSON.stringify(new_pairs));
        setShowSuccess(true);
        
        set_Timer(() => setShowSuccess(false), 3000);
    }

    return(
        <div className="home_wrapper">
            <Link to="/"><button id="back_button">Home</button></Link>
            <header className="top_header">
                <h1>Startup Rush</h1>
            <a href="https://www.linkedin.com/in/matheus-salgado02"  className="contact_link">Contact</a>
            </header>

            <div className="main_layout">
                <div className="light_section">
                <div className="main_content">
                    <h3>List of startups ({startups.length})</h3>
                    <div className="startups_list">
                        {startups.length > 0 ? 
                        (
                            startups.map((startup, index) => (
                            <div key={index} className="startup_item">
                                <div className="startup_content">
                                    <p><strong>Name: {startup.nameList}</strong></p>
                                    <p>Slogan: {startup.sloganList}</p>
                                    <p>Founded: {startup.dateList}</p> </div>
                                    {!tournamentStarted && (<button onClick={() => removeStartup(index)} className="delete_btn"title="Remove startup">Remove</button>)} </div>
                                    ))
                        ):(
                            <p>No startups registered yet</p>
                            )}
                        </div>
                        <div className="option_block">
                        <button onClick={handleClick} className={`draw_btn ${tournamentStarted ? 'disabled' : ''}`} disabled={tournamentStarted && !hasChampion}>
                            {hasChampion ? 'Tournament Finished' : tournamentStarted ? 'Tournament In Progress' : 'Start Tournament'}
                        </button>
                        </div>

                        {showSuccess && (
                            <div className="success_message">
                                Tournament started successfully. Go to Battles page to begin.
                            </div>
                        )}

                        {hasChampion && (
                            <div className="champion_message">
                                <h3>Tournament Champion: {pairs[0].winner.nameList} 🏆</h3>
                            </div>
                        )}
                        {pairs.length > 0 && (
                            <div className="pairs_section">
                            <h3>Startups Fighting</h3>
                            <div className="pairs_grid">
                                {pairs.map((pair) => (
                                    <div key={pair.pairId} className="pair_card">
                                        <h4>Battle {pair.pairId}</h4>
                                        <div className="versus_container">
                                            <div className={`startup ${pair.winner?.nameList === pair.startup1.nameList ? 'winner' : ''}`}>
                                                <p><strong>{pair.startup1.nameList}</strong></p>
                                                <p>"{pair.startup1.sloganList}"</p>
                                                    {pair.winner && (<p>{pair.winner?.nameList === pair.startup1.nameList ? '🏆 Winner' : ''}</p>)}
                                            </div>
                                            <div className="vs">VS</div>
                                            <div className={`startup ${pair.winner?.nameList === pair.startup2.nameList ? 'winner' : ''}`}>
                                                    <p><strong>{pair.startup2.nameList}</strong></p>
                                                    <p>"{pair.startup2.sloganList}"</p>
                                                    {pair.winner && ( <p>{pair.winner?.nameList === pair.startup2.nameList ? '🏆 Winner' : ''}</p> )}
                                            </div>
                                        </div>
                                    </div>
                                    ))}
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