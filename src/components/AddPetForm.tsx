import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import { post } from 'aws-amplify/api';
import { uploadData } from '@aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import awsExports from '../aws-exports';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

// Styled Components Mejorados
const PageContainer = styled.div`
  justify-content: center;
  align-items: center !important;
  padding: 20px;
  width: 100%;
`;
const CloseButton = styled(IconButton)`
  color: #e67e22 !important;
  transition: color 0.3s ease;
  ma &:hover {
    color: #333 !important;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-width: 84%;
  margin-left: 8%;

  @media (max-width: 480px) {
    padding: 15px;
    width: 100%;
  }
`;

const Headers = styled(Typography)`
  font-size: 2rem !important;
  font-weight: bold;
  background-color: white !important;
  color: #e67e22 !important;
  margin: 43%;
  margin-bottom
  margin-bottom: 20px !important;
  text-align: center !important;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 15px !important;
  width: 100%;
  color: #3498db !important;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 3px solid #dee2e6;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const UploadLabel = styled.label`
  padding: 10px;
  display: block;
  text-align: center;
  width: 100%;
  max-width: 250px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  background-color: white;
  color: #e67e22;
  border-radius: 30px;
  border: 1px solid #e67e22;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    color: #e67e22;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    max-width: 200px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 250px;
  padding: 12px;
  font-size: 14px;
  background-color: #e67e22 !important;
  color: white !important;
  border-radius: 30px !important;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;

  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    max-width: 200px;
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
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const petId = uuidv4();
      const { path } = await uploadData({
        path: `public/${petId}.${imageFile.name
          .split('.')
          .pop()
          ?.toLowerCase()}`,
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

      await post({
        apiName: awsExports.aws_cloud_logic_custom[0].name,
        path: '/pets',
        options: { body },
      });

      await fetchPets();

      onClose();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>

      <Headers>🐾 Agregar Nueva Mascota</Headers>

      <FormContainer>
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

        <StyledButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Mascota'}
        </StyledButton>
      </FormContainer>
    </PageContainer>
  );
};

export default AddPetForm;
