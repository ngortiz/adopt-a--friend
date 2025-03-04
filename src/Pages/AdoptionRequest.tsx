import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button } from '@mui/material';

// 🌟 Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2, #e6e6e6);
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const PetInfo = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px !important;
`;

const Title = styled(Typography)`
  color: #2c2c2c;
  font-weight: bold;
`;

const Subtitle = styled(Typography)`
  color: #444;
  font-size: 1.1rem;
`;

const StyledButton = styled(Button)`
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;

const SolicitudAdopcion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('✅ Solicitud de adopción enviada con éxito');
    navigate('/');
  };

  if (!pet) {
    return (
      <PageContainer>
        <Title variant='h6'>
          🐾 No hay mascota seleccionada para adopción.
        </Title>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FormContainer>
        <Title variant='h4' gutterBottom>
          📝 Solicitud de Adopción
        </Title>
        <PetInfo>
          <Subtitle variant='h6'>🐶 Adoptando a: {pet.name}</Subtitle>
          <Subtitle variant='body1'>
            {pet.species} - {pet.gender}
          </Subtitle>
        </PetInfo>

        <form onSubmit={handleSubmit}>
          <StyledTextField label='Tu Nombre' fullWidth required />
          <StyledTextField
            label='Correo Electrónico'
            type='email'
            fullWidth
            required
          />
          <StyledTextField label='Teléfono' type='tel' fullWidth required />
          <StyledTextField
            label='¿Por qué deseas adoptar?'
            multiline
            rows={4}
            fullWidth
            required
          />
          <StyledButton
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
          >
            Enviar Solicitud
          </StyledButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default SolicitudAdopcion;
