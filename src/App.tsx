import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Pages from './pages/index'; // Importa tu componente

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>¡Bienvenido a Adopta Amigo! 🐶🐱</h1>
        {/* Enlace para ir a la página de adopción */}
        <Button variant='contained' color='primary'>
          <Link
            to='/adoptar'
            style={{ textDecoration: 'none', color: 'white' }}
          >
            Explorar Mascotas
          </Link>
        </Button>
      </div>

      {/* Definimos las rutas */}
      <Routes>
        <Route path='/pages' element={<Pages />} />
      </Routes>
    </Router>
  );
}

export default App;
