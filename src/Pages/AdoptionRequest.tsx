import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';

interface AdoptionRequestProps {
  open: boolean;
  onClose: () => void;
  selectedPet: { name: string; imageUrl?: string } | null;
  onSubmit?: (event: React.FormEvent) => void; // 👈 Agregamos onSubmit opcionalmente
}

const StyledModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  text-align: center;
  color: #333;
  font-family: 'Poppins', sans-serif;
`;

const FormTitle = styled(Typography)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e67e22;
  margin-bottom: 1rem;
`;

const PetName = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  & .MuiOutlinedInput-root:focus-within {
    border-color: #e67e22;
    background-color: #ffffff;
  }
`;

const StyledSubmitButton = styled(Button)`
  padding: 1rem;
  width: 50% !important;
  margin-right: 48% !important;
  margin-top: 3% !important;
  left: 22%;
  font-size: 1.1rem;
  background-color: #e67e22 !important;
  color: white !important;
  border-radius: 30px !important;
  border: 1px solid#E67E22 !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;

    border: 1px solid #e67e22;
  }
`;

const AdoptionRequest: React.FC<AdoptionRequestProps> = ({
  open,
  onClose,
  selectedPet,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reason, setReason] = useState('');
  // Limpia los campos cuando se selecciona una nueva mascota o se abre el modal
  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setReason('');
    }
  }, [open]); // Se ejecuta cada vez que `open` cambia

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedPet) return;

    const whatsappNumber = '+595986381101';

    const message =
      `Hola! Quiero adoptar a *${selectedPet.name}* 🐶\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `📧 *Correo:* ${email}\n` +
      `📞 *Teléfono:* ${phone}\n` +
      `📍 *Dirección:* ${address}\n` +
      `📝 *Motivo:* ${reason}\n\n` +
      `🖼️ *Foto:* ${selectedPet.imageUrl}`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, '_blank');

    onClose(); // Cerrar el modal después de enviar
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalContent>
        {selectedPet && (
          <>
            <FormTitle variant='h5'>📝 Solicitud de Adopción</FormTitle>
            <PetName variant='h6'>🐶 Adoptando a: {selectedPet.name}</PetName>
            <form onSubmit={handleSubmit}>
              <StyledTextField
                label='Tu Nombre'
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <StyledTextField
                label='Correo Electrónico'
                type='email'
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <StyledTextField
                label='Teléfono'
                type='tel'
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <StyledTextField
                label='Dirección'
                fullWidth
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <StyledTextField
                label='¿Por qué deseas adoptar?'
                multiline
                rows={4}
                fullWidth
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <StyledSubmitButton type='submit' fullWidth>
                Enviar Solicitud
              </StyledSubmitButton>
            </form>
          </>
        )}
      </StyledModalContent>
    </Modal>
  );
};

export default AdoptionRequest;
