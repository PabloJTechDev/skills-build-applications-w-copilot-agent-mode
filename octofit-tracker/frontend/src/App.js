import './App.css';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import octofitLogo from './octofitapp-small.png';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function navLinkClass({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`;
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <img
              src={octofitLogo}
              alt="Octofit"
              width="28"
              height="28"
              className="octofit-logo"
            />
            <span>Octofit Tracker</span>
          </span>
          <div className="navbar-nav">
            <NavLink className={navLinkClass} to="/users">Users</NavLink>
            <NavLink className={navLinkClass} to="/teams">Teams</NavLink>
            <NavLink className={navLinkClass} to="/activities">Activities</NavLink>
            <NavLink className={navLinkClass} to="/workouts">Workouts</NavLink>
            <NavLink className={navLinkClass} to="/leaderboard">Leaderboard</NavLink>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
