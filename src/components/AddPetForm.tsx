import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

// 🎨 Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 15px !important;
  width: 100%;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 2px solid #ddd;
`;

const UploadButton = styled(Button)`
  margin-top: 10px !important;
`;

const AddPetForm: React.FC<{
  onClose: () => void;
  setPets: React.Dispatch<React.SetStateAction<any[]>>;
  pets: any[];
}> = ({ onClose, setPets, pets }) => {
  const [newPet, setNewPet] = useState({
    name: '',
    species: '',
    gender: '',
    age: '',
    description: '',
    image: '', // Ahora se guardará en base64
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewPet((prev) => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (
      !newPet.name ||
      !newPet.species ||
      !newPet.gender ||
      !newPet.age ||
      !newPet.description ||
      !newPet.image
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const updatedPets = [...pets, { id: pets.length + 1, ...newPet }];
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    onClose();
  };

  return (
    <FormContainer>
      <Title>🐾 Agregar Nueva Mascota</Title>

      <StyledTextField
        label='Nombre'
        name='name'
        value={newPet.name}
        onChange={handleChange}
        required
      />

      <StyledTextField
        select
        label='Especie'
        name='species'
        value={newPet.species}
        onChange={handleChange}
        required
      >
        <MenuItem value='Perro'>🐶 Perro</MenuItem>
        <MenuItem value='Gato'>🐱 Gato</MenuItem>
      </StyledTextField>

      <StyledTextField
        select
        label='Género'
        name='gender'
        value={newPet.gender}
        onChange={handleChange}
        required
      >
        <MenuItem value='Macho'>♂️ Macho</MenuItem>
        <MenuItem value='Hembra'>♀️ Hembra</MenuItem>
      </StyledTextField>

      <StyledTextField
        label='Edad (años)'
        name='age'
        type='number'
        value={newPet.age}
        onChange={handleChange}
        required
      />

      <StyledTextField
        label='Descripción'
        name='description'
        value={newPet.description}
        onChange={handleChange}
        multiline
        rows={3}
        required
      />

      {imagePreview && <ImagePreview src={imagePreview} alt='Vista previa' />}

      <input
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        style={{ marginBottom: '10px' }}
      />

      <UploadButton variant='contained' color='success' onClick={handleSubmit}>
        Agregar Mascota
      </UploadButton>
    </FormContainer>
  );
};

export default AddPetForm;
