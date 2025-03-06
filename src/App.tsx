import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdoptAPet from './Pages/AdoptAPet';
import AdoptionRequest from './Pages/AdoptionRequest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdoptAPet />} /> {/* Página principal */}
        <Route path='/adoptar' element={<AdoptAPet />} />{' '}
        {/* Cambiar "adopt" por "adoptar" */}
        <Route path='/adoption-request' element={<AdoptionRequest />} />
      </Routes>
    </Router>
  );
}

export default App;
