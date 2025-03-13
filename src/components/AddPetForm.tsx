import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import { post } from 'aws-amplify/api';
import { uploadData } from '@aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import awsExports from '../aws-exports';

// 🎨 Styled Components Mejorados
const PageContainer = styled.div`
  justify-content: center;
  padding: 20px;
  margin-botton: 10%;
`;

const FormContainer = styled.div`
  flex-direction: column;
  align-items: center !important;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 561px !important;
`;

const Title = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #13856b;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 15px !important;
  width: 100%;
  color: #3498db !important;
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
  display: block;
  background: white;
  color: #3498db;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  font-size: 0.9rem;
  transition: background 0.3s;
  &:hover {
    background: #2980b9;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
  color: #13856b;
`;

const StyledButton = styled(Button)`
  margin: 5px !important;
  width: 50%;
  margin-left: 25% !important;
  border-color: #13856b !important;
  background-color: white !important;

  color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
`;

interface AddPetFormProps {
  onClose: () => void;
  fetchPets: () => void;
}

const AddPetForm: React.FC<AddPetFormProps> = ({ onClose, fetchPets }) => {
  const [newPet, setNewPet] = useState({
    name: '',
    species: '',
    gender: '',
    age: '',
    description: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (
      !newPet.name ||
      !newPet.species ||
      !newPet.gender ||
      !newPet.age ||
      !newPet.description ||
      !newPet.image ||
      !imageFile
    ) {
      alert('⚠️ Por favor, completa todos los campos.');
      return;
    }

    const petId = uuidv4();
    const { path } = await uploadData({
      path: `public/${petId}.${imageFile.name
        .split('.')
        .pop()
        ?.toLocaleLowerCase()}`,
      data: imageFile,
    }).result;

    const body = {
      id: petId,
      name: newPet.name,
      gender: newPet.gender,
      species: newPet.species,
      age: newPet.age,
      description: newPet.description,
      imageUrl: `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com/${path}`,
    };
    try {
      await post({
        apiName: awsExports.aws_cloud_logic_custom[0].name,
        path: '/pets',
        options: {
          body: body,
        },
      });

      await fetchPets();
    } catch (e) {
      console.log(e);
    }

    onClose();
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>🐾 Agregar Nueva Mascota </Title>

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
          label='Edad'
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
