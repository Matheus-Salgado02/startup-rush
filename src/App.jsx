import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Bracket } from './pages/BracketPage';
import { SignPage } from './pages/SignPage';
import { Battles } from './pages/Battles';
import { Results } from './pages/Results';
import './index.css'

function App() {
    return(
     <Router>
      <Routes>
        <Route path = "/" element ={<HomePage/>}/>
        <Route path = "/SignPage" element ={<SignPage/>}/>
        <Route path = "/BracketPage" element ={<Bracket/>}/>
        <Route path = "/Battles" element = {<Battles/>}/>
        <Route path = "/Results" element = {<Results/>}/>
      </Routes>
     </Router>

    );
}

export default App
