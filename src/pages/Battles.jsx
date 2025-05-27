import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


const getParsedItem = (key, fallback = null) => {
      const item = localStorage.getItem(key);
      return item && item !== "undefined" ? JSON.parse(item) : fallback;
  };

export function Battles() {
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);
  const [scores, setScores] = useState({});
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [allStartups, setAllStartups] = useState([]);
  const [champion, setChampion] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [sharkFightMessage, setSharkFightMessage] = useState('');
  const [showRoundTransition, setShowRoundTransition] = useState(false);

  // Load saved data once
  useEffect(() => {
    const startups = getParsedItem('StartupList', []);
    const startupsWithCounts = startups.map(startup => ({...startup,eventCounts: startup.eventCounts || {
        "Convincing Pitch": 0,
        "Buggy Product": 0,
        "Strong User Traction": 0,
        "Angry Investor": 0,
        "Fake News in Pitch": 0}}));
    setAllStartups(startupsWithCounts);
    const savedPairs = getParsedItem('StartupPairs', []);
    setPairs(savedPairs);
    initializeScores(savedPairs);
    if (savedPairs.every(pair => pair.winner)) setCurrentPairIndex(0);

    const savedChampion = getParsedItem('StartupChampion');
    if (savedChampion?.nameList) setChampion(savedChampion);

    const savedRound = parseInt(localStorage.getItem('StartupRoundNumber'), 10);
    if (!isNaN(savedRound)) setRoundNumber(savedRound);
  }, []);

  // Save champion when it changes
  useEffect(() => {
    if (champion) {
      localStorage.setItem('StartupChampion', JSON.stringify(champion));
    }}, [champion]);

  // advance round automatically
  useEffect(() => {
    if (pairs.length && pairs.every(pair => pair.winner)) {
      const timer = setTimeout(advanceToNextRound, 1000);
      return () => clearTimeout(timer);
    }
  }, [pairs]);

  const initializeScores = (pairs) => {
    const startups = getParsedItem('StartupList', []);
    const newScores = {};
    pairs.forEach(pair => {
      const startup1 = startups.find(s => s.nameList === pair.startup1.nameList);
      const startup2 = startups.find(s => s.nameList === pair.startup2.nameList);
      newScores[`${pair.startup1.nameList}_${pair.pairId}`] = startup1?.points || 70;
      newScores[`${pair.startup2.nameList}_${pair.pairId}`] = startup2?.points || 70;
    });
    setScores(newScores);
  };

  const applyEventImpact = (startupName, pairId, impact, eventName) => {
    const key = `${startupName}_${pairId}`;
    setScores(prev => ({ ...prev, [key]: (prev[key] || 70) + impact }));

    const updated = allStartups.map(s => {
      if (s.nameList === startupName) {
        return {...s,points: (s.points || 70) + impact,eventCounts: {...s.eventCounts,[eventName]: (s.eventCounts?.[eventName] || 0) + 1}};
      }
      return s;
    });

    setAllStartups(updated);
    localStorage.setItem('StartupList', JSON.stringify(updated));
  };

  const determineWinner = (pairId) => {
    const pair = pairs.find(p => p.pairId === pairId);
    if (!pair) return;

    const score1 = scores[`${pair.startup1.nameList}_${pairId}`] || 70;
    const score2 = scores[`${pair.startup2.nameList}_${pairId}`] || 70;

    let finalScore1 = score1;
    let finalScore2 = score2;
    let winner = null;

    if (score1 === score2) {
      const chosen = Math.random() < 0.5 ? pair.startup1 : pair.startup2;
      const key = `${chosen.nameList}_${pairId}`;
      setScores(prev => ({ ...prev, [key]: (prev[key] || 70) + 2 }));
      sharkFightMessage !== '' || setSharkFightMessage(`Shark Fight. ${chosen.nameList} received 2 points.`);

      setTimeout(() => setSharkFightMessage(''), 5000);

      finalScore1 += chosen === pair.startup1 ? 2 : 0;
      finalScore2 += chosen === pair.startup2 ? 2 : 0;

      winner = finalScore1 > finalScore2 ? pair.startup1 : pair.startup2;
    } else {
      winner = score1 > score2 ? pair.startup1 : pair.startup2;
    }

    const winnerKey = `${winner.nameList}_${pairId}`;
    setScores(prev => ({ ...prev, [winnerKey]: (prev[winnerKey] || 70) + 30 }));

    const updatedStartups = allStartups.map(s => (
      s.nameList === winner.nameList ? { ...s, points: (s.points || 70) + 30 } : s
    ));

    setAllStartups(updatedStartups);
    localStorage.setItem('StartupList', JSON.stringify(updatedStartups));

    const updatedPairs = pairs.map(p => p.pairId === pairId ? { ...p, winner } : p);
    setPairs(updatedPairs);
    setWinners(prev => [...prev, winner]);
    localStorage.setItem('StartupPairs', JSON.stringify(updatedPairs));
  };

  const advanceToNextRound = () => {
    if (winners.length === 1) {
      const champ = winners[0];
      setChampion(champ);
      champ?.nameList && localStorage.setItem('StartupChampion', JSON.stringify(champ));
      return;
    }

    if (winners.length % 2 === 0 && winners.length >= 2) {
      setShowRoundTransition(true);
      setTimeout(() => {
        const shuffled = [...winners].sort(() => Math.random() - 0.5);
        const newPairs = shuffled.reduce((acc, cur, i, arr) => {
          if (i % 2 === 0) {
            acc.push({ pairId: acc.length + 1, startup1: cur, startup2: arr[i + 1], winner: null });
          }
          return acc;
        }, []);

        setPairs(newPairs);
        setWinners([]);
        setCurrentPairIndex(0);
        setRoundNumber(prev => {
          const next = prev + 1;
          localStorage.setItem('StartupRoundNumber', next.toString());
          return next;
        });
        localStorage.setItem('StartupPairs', JSON.stringify(newPairs));
        initializeScores(newPairs);
        setShowRoundTransition(false);
}, 3000);
    }
  };

  const handlePairSelect = (e) => {
    setCurrentPairIndex(Number(e.target.value));
  };

  const currentPair = pairs[currentPairIndex];

  return (
    <div className="home_wrapper">
      <Link to="/"><button id="back_button">Home</button></Link>
      <header className="top_header">
        <h1>Startup Rush</h1>
        <Link to="/contact" className="contact_link">Contact</Link>
      </header>

      <div className="main_layout">
        <div className="light_section">
          <div className="main_content">
            <h3>Battles!</h3>
            <h4>Round {roundNumber}</h4>

            {champion && (
              <div className="champion_highlight">
                <h2>Champion of Startup Rush</h2>
                <p><strong>{champion.nameList}</strong></p>
                <p>"{champion.sloganList}"</p>
              </div>
            )}

            {showRoundTransition && <div className="round_transition_message">Going to the next round...</div>}

            {pairs.length > 0 && !champion ? (
              <>
                <label>Choose Battle:</label>
                <select onChange={handlePairSelect} value={currentPairIndex}>
                  {pairs.map((pair, index) => (
                    <option key={pair.pairId} value={index}>Battle {pair.pairId}</option>
                  ))}
                </select>

                {sharkFightMessage && <div className="shark_fight">{sharkFightMessage}</div>}

                <div className="battle_card">
                  <h4>Battle {currentPair.pairId}</h4>
                  <div className="versus_container">
                    {[currentPair.startup1, currentPair.startup2].map(startup => {
                      const globalStartup = allStartups.find(s => s.nameList === startup.nameList);
                      const points = globalStartup?.points || 70;
                      return (
                        <div key={startup.nameList} className={`startup ${currentPair.winner?.nameList === startup.nameList ? 'winner' : ''}`}>
                          <p><strong>{startup.nameList}</strong></p>
                          <p>"{startup.sloganList}"</p>
                          <p>Points: {points}</p>
                          <EventPanel startup={startup} pairId={currentPair.pairId} onEvent={applyEventImpact} />
                          <p>Points: {scores[`${startup.nameList}_${currentPair.pairId}`] || 70}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="judging_actions">
                    <button onClick={() => determineWinner(currentPair.pairId)} disabled={currentPair.winner}>
                      Determinate Winner
                    </button>
                  </div>
                  {currentPair.winner && (
                    <p className="winner_text">
                      Winner: <strong>{currentPair.winner.nameList}</strong> with {scores[`${currentPair.winner.nameList}_${currentPair.pairId}`]} Points
                    </p>
                  )}
                </div>
              </>
            ) : !champion ? (
              <div className="no_battles">
                <p>No battles created yet!</p>
                <Link to="/BracketPage" className="create_battles_link">
                  <button>Create Battles in Bracket Page</button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <div className="dark_section"></div>
      </div>
    </div>
  );
}

function EventPanel({ startup, pairId, onEvent }) {
  const events = [
    { label: "Convincing Pitch", impact: 6 },
    { label: "Buggy Product", impact: -4 },
    { label: "Strong User Traction", impact: 3 },
    { label: "Angry Investor", impact: -6 },
    { label: "Fake News in Pitch", impact: -8 }
  ];

  const [disabledEvents, setDisabledEvents] = useState({});

  const handleEventClick = (event) => {
    onEvent(startup.nameList, pairId, event.impact, event.label);
    setDisabledEvents(prev => ({ ...prev, [event.label]: true }));
  };

  useEffect(() => {
    setDisabledEvents({});
  }, [pairId]);

  return (
    <div className="event_panel">
      <p><strong>Events:</strong></p>
      {events.map(event => (
        <button key={event.label} onClick={() => handleEventClick(event)} disabled={disabledEvents[event.label]}>
          {event.label} ({event.impact > 0 ? "+" : ""}{event.impact})
        </button>
      ))}
    </div>
  );
}
