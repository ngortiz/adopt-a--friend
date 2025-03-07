import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdoptAPet from './Pages/AdoptAPet';
import AdoptionRequest from './Pages/AdoptionRequest';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App({ signOut, user }: WithAuthenticatorProps) {
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

export default withAuthenticator(App);
