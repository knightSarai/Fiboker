import './App.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import OtherPage from './OtherPage'
import HomePage from './HomePage'

function App() {
  return (
    <Router>
      <div className="App">
          <header className="app-header">
            <Link to='/'></Link>
            <Link to='/other'></Link>
          </header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/other" element={<OtherPage/>} />
          </Routes>
      </div>
    </Router>
  )
}

export default App
