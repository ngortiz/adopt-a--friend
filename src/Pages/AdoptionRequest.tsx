import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';

// Interfaz para definir los tipos de las props
interface AdoptionRequestProps {
  open: boolean;
  onClose: () => void;
  selectedPet: { name: string } | null;
  onSubmit: (event: React.FormEvent) => void;
}

// Styled Component para el modal
const StyledModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  color: #333;
`;

// Componente de solicitud de adopción
const AdoptionRequest: React.FC<AdoptionRequestProps> = ({
  open,
  onClose,
  selectedPet,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalContent>
        {selectedPet && (
          <>
            <Typography variant='h5'>📝 Solicitud de Adopción</Typography>
            <Typography variant='h6'>
              🐶 Adoptando a: {selectedPet.name}
            </Typography>
            <form onSubmit={onSubmit}>
              <TextField
                label='Tu Nombre'
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label='Correo Electrónico'
                type='email'
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label='Teléfono'
                type='tel'
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label='¿Por qué deseas adoptar?'
                multiline
                rows={4}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Enviar Solicitud
              </Button>
            </form>
          </>
        )}
      </StyledModalContent>
    </Modal>
  );
};

export default AdoptionRequest;
