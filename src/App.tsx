import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import AdoptAPet from './Pages/AdoptAPet';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator.Provider>
      <Router>
        <Routes>
          <Route path="/" element={<AdoptAPet />} />
          <Route path="/adoptar" element={<AdoptAPet/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Authenticator.Provider>
  );
}

export default App;
