import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';

interface AdoptionRequestProps {
  open: boolean;
  onClose: () => void;
  selectedPet: { name: string; imageUrl?: string } | null;
  onSubmit?: (event: React.FormEvent) => void;
}

const StyledModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
  color: #333;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const FormTitle = styled(Typography)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e67e22;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const PetName = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const FormField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 10px;
  }

  & .MuiOutlinedInput-root:focus-within {
    border-color: #e67e22;
  }

  margin-bottom: 16px !important;

  @media (max-width: 600px) {
    font-size: 14px;
    margin-bottom: 12px !important;
  }
`;

const StyledSubmitButton = styled(Button)`
  padding: 1rem;
  width: 100% !important;
  margin-top: 10px !important;
  font-size: 1.1rem;
  background-color: #e67e22 !important;
  color: white !important;
  border-radius: 30px !important;
  border: 1px solid #e67e22 !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.8rem;
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

  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setReason('');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPet) return;

    const whatsappNumber = '+595986381101';
    const message =
      `Hola! Quiero adoptar a *${selectedPet.name}* 🐶\n\n` +
      `👤 *Nombre:* ${name}\n📧 *Correo:* ${email}\n📞 *Teléfono:* ${phone}\n` +
      `📍 *Dirección:* ${address}\n📝 *Motivo:* ${reason}\n\n` +
      `🖼️ *Foto:* ${selectedPet.imageUrl}`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalContent>
        {selectedPet && (
          <>
            <FormTitle variant='h5'>📝 Solicitud de Adopción</FormTitle>
            <PetName variant='h6'>🐶 Adoptando a: {selectedPet.name}</PetName>
            <form onSubmit={handleSubmit}>
              <FormField
                label='Tu Nombre'
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormField
                label='Correo Electrónico'
                type='email'
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormField
                label='Teléfono'
                type='tel'
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <FormField
                label='Dirección'
                fullWidth
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <FormField
                label='¿Por qué deseas adoptar?'
                multiline
                rows={4}
                fullWidth
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <StyledSubmitButton type='submit'>
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
