import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import AdoptAPet from './Pages/AdoptAPet';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function AuthRedirect() {
  const { user } = useAuthenticator(context => [context.user]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/adoptar');
    }
  }, [user, navigate]);

  return <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    }}>
      <Authenticator variation="modal" />
    </div>;
}

function App() {
  return (
    <Authenticator.Provider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthRedirect />} />
          <Route path="/" element={<AdoptAPet />} />
          <Route path="/adoptar" element={<AdoptAPet/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Authenticator.Provider>
  );
}

export default App;
