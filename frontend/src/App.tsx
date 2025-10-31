import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="container row">
          <Link to="/" className="brand">Mini Event Finder</Link>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>Browse</NavLink>
            <NavLink to="/create" className="btn">+ New Event</NavLink>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
