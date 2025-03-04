import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import AdoptaUnAmigo from './Pages/AdoptaUnAmigo';
import AdoptionRequest from './Pages/AdoptionRequest';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h1>¡Bienvenido a Adopta Amigo! 🐶🐱</h1>
    <Button variant='contained' color='primary'>
      <Link to='/adoptar' style={{ textDecoration: 'none', color: 'white' }}>
        Explorar Mascotas
      </Link>
    </Button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} /> {/* Página principal */}
        <Route path='/adoptar' element={<AdoptaUnAmigo />} />
        <Route path='/adoption-request' element={<AdoptionRequest />} />
      </Routes>
    </Router>
  );
}

export default App;
