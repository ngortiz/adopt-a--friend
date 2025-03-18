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
  align-items: center !important;
  padding: 20px;
`;

const FormContainer = styled.div`
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 84%;
  margin-left: 8%;
`;

const Headers = styled(Typography)`
  font-size: 2rem !important;
  font-weight: bold;
  background-color: white !important;
  color: #e67e22 !important;
  border-radius: 30px !important;
  border: 1px solid #e67e22 !important;
  margin-bottom: 20px !important;
  text-align: center !important;
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
  padding: 12px 10px;
  width: 50%;
  margin-left: 34% !important;
  padding-top: 2% !important;
  left: 22%;
  font-size: 12px;
  background-color: white !important;
  color: #e67e22 !important;
  border-radius: 30px !important;
  border: 1px solid #e67e22 !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;

    border: 1px solid #e67e22;
  }
`;

const HiddenFileInput = styled.input`
  display: none; /* Oculta completamente el input */
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  grid-column: span 2;
  padding: 1rem;
  width: 50%;
  margin: 0 auto;
  font-size: 12px !important;
  background-color: #e67e22 !important;
  color: white !important;
  border-radius: 30px !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-bottom: 20px !important;
  margin-top: 6% !important;
  margin-left: 24% !important;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;

    border: 1px solid #e67e22;
  }
`;
const Notification = styled.div<{ show: boolean; type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 15px;
  color: #13856b;
  background-color: ${(props) =>
    props.type === 'success' ? '#dff0d8' : '#f2dede'};
  border: 1px solid transparent;
  border-color: ${(props) =>
    props.type === 'success' ? '#d6e9c6' : '#ebccd1'};
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: translateY(${(props) => (props.show ? '0' : '-20px')});
  transition: opacity 0.5s ease, transform 0.5s ease;
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
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

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

    setLoading(true); // Activamos el estado de carga

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
      setNotification({
        show: true,
        message: 'Mascota registrada con éxito.',
        type: 'success',
      });
      setTimeout(
        () => setNotification({ show: false, message: '', type: 'success' }),
        3000
      );
      onClose();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setNotification({
        show: true,
        message: 'Hubo un error al subir la imagen.',
        type: 'error',
      });
      setTimeout(
        () => setNotification({ show: false, message: '', type: 'error' }),
        3000
      );
    } finally {
      setLoading(false); // Desactivamos el estado de carga al final
    }
  };

  return (
    <PageContainer>
      <Headers>🐾 Agregar Nueva Mascota </Headers>
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
      <Notification show={notification.show} type={notification.type}>
        {notification.message}
      </Notification>
    </PageContainer>
  );
};

export default AddPetForm;
