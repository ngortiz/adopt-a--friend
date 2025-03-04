import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

// 🎨 Styled Components Mejorados
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 15px !important;
  width: 100%;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 3px solid #dee2e6;
`;

const UploadLabel = styled.label`
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
  &:hover {
    background: #2980b9;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const StyledButton = styled(Button)`
  background-color: #2ecc71 !important;
  &:hover {
    background-color: #27ae60 !important;
  }
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
    image: '',
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
      alert('⚠️ Por favor, completa todos los campos.');
      return;
    }

    const updatedPets = [...pets, { id: pets.length + 1, ...newPet }];
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    onClose();
  };

  return (
    <PageContainer>
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
          type='text'
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

        <UploadLabel>
          📷 Subir Imagen
          <HiddenFileInput
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
          />
        </UploadLabel>

        <StyledButton variant='contained' onClick={handleSubmit}>
          Agregar Mascota
        </StyledButton>
      </FormContainer>
    </PageContainer>
  );
};

export default AddPetForm;
