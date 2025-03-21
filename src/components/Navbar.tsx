import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Button } from '@mui/material';
import styled from 'styled-components';
import { useState } from 'react';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #e67e22;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  @media (max-width: 768px) {
    height: 50px;
    padding: 5px 15px;
`;

const AuthButton = styled(Button)`
  background-color: white !important;
  color: #e67e22 !important;
  border-radius: 20px !important;
  padding: 8px 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  border: 1px solid #e67e22 !important;
  left: 86%;

  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;
  }

  @media (max-width: 768px) {
    @media (max-width: 768px) {
      font-size: 10px !importante;
       left: 49%;
    }
`;

const Navbar: React.FC = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [showLoginModal, setShowAuthModal] = useState(false);

  const handleSignOut = () => {
    signOut();
    setShowAuthModal(false);
  };

  return (
    <>
      <NavbarContainer>
        {user ? (
          <AuthButton startIcon={<LogoutIcon />} onClick={handleSignOut}>
            Cerrar Sesión
          </AuthButton>
        ) : (
          <AuthButton
            startIcon={<LoginIcon />}
            onClick={() => setShowAuthModal(true)}
          >
            Iniciar Sesión
          </AuthButton>
        )}
      </NavbarContainer>
      {showLoginModal && (
        <div>
          <Button onClick={() => setShowAuthModal(false)}>Cerrar</Button>
          <Authenticator variation='modal' hideSignUp />
        </div>
      )}
    </>
  );
};

export default Navbar;
