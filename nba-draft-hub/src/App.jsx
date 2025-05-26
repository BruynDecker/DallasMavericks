import draftData from './data/draftData.json';
import { mergePlayers } from './utils/mergeplayers';
import BigBoard from './components/BigBoard';
import { Routes, Route } from 'react-router-dom';
import PlayerProfile from './components/PlayerProfile';
import HeroBanner from './components/HeroBanner';
import './App.css';



function App() {
  const players = mergePlayers(draftData);

  return (
    <>
    <HeroBanner />

    <Routes>
      <Route path="/" element={<BigBoard players={players} />} />
      <Route path="/player/:id" element={<PlayerProfile players={players} />} />
    </Routes>
    </>
  );
}

export default App;
