import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdoptAPet from './Pages/AdoptAPet';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App({}: WithAuthenticatorProps) {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdoptAPet />} /> {/* Página principal */}
        <Route path='/adoptar' element={<AdoptAPet />} />{' '}
        {/* Cambiar "adopt" por "adoptar" */}
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
