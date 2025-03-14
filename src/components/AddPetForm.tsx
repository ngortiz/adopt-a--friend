import React, { useState, useRef, useEffect } from 'react';
import { uploadData } from '@aws-amplify/storage';
import { post } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';
import awsExports from '../aws-exports';
import styled from 'styled-components';
import { Box, TextField } from '@mui/material';

const FormTitle = styled.h2`
  font-size: 2.2rem;
  text-align: center;
  color: #13856b;
  margin-bottom: 2rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
`;

const Form = styled.form`
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  color: #13856b;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #13856b;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.9rem;
  font-size: 1rem;
  color: #37474f;
  border: 1px solid #d1d1d1;
  border-radius: 10px;
  background-color: #f9f9f9;
  &:focus {
    border-color: #13856b;
    background-color: #ffffff;
    outline: none;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled.button`
  grid-column: span 2;
  padding: 1rem;
  width: 50%;
  margin: 0 auto;
  font-size: 1.1rem;
  background-color: #13856b;
  color: #ffffff;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: white;
    color: #13856b !important;
    border: 1px solid #13856b;
  }
`;

interface PetFormProps {
  onClose: () => void;
  fetchPets: () => void;
}

const AddPetForm: React.FC<PetFormProps> = ({ onClose, fetchPets }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    species: '',
    age: '',
    description: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const petId = uuidv4();
    const fileExtension = image.name.split('.').pop()?.toLowerCase();

    if (!fileExtension) {
      alert('Formato de imagen no válido.');
      return;
    }

    try {
      const { path } = await uploadData({
        path: `public/${petId}.${fileExtension}`,
        data: image,
      }).result;

      const imageUrl = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com/${path}`;

      const body = {
        id: petId,
        ...formData,
        imageUrl,
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
      alert('Hubo un error al subir la imagen.');
    }
  };

  return (
    <Box>
      <FormTitle>Registrar Mascota</FormTitle>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nombre:</Label>
          <Input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Género:</Label>
          <Input
            type='text'
            name='gender'
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Especie:</Label>
          <Input
            type='text'
            name='species'
            value={formData.species}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Edad:</Label>
          <Input
            type='text'
            name='age'
            value={formData.age}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Descripción:</Label>
          <TextField
            name='description'
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>
        <FormGroup>
          <Label>Imagen:</Label>
          {previewUrl && <ImagePreview src={previewUrl} alt='Vista previa' />}
          <Input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            required
          />
        </FormGroup>
        <SubmitButton type='submit'>Registrar Mascota</SubmitButton>
      </Form>
    </Box>
  );
};

export default AddPetForm;
