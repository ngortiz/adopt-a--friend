import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Modal,
  Box,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddPetForm from '../components/AddPetForm';
import logo from '../assets/logo.png';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background: darkslategray;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 24px;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const FilterButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const PetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding: 10px;
`;

// 💎 Estilos para las tarjetas de mascotas
const StyledCard = styled(Card)`
  position: relative;
  margin: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;

  &:hover {
    transform: scale(1.02);
  }
`;

const AdoptaUnAmigo: React.FC = () => {
  const getStoredPets = () => {
    const storedPets = localStorage.getItem('pets');
    return storedPets ? JSON.parse(storedPets) : [];
  };

  const [pets, setPets] = useState<any[]>(getStoredPets);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  useEffect(() => {
    localStorage.setItem('pets', JSON.stringify(pets));
  }, [pets]);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const filteredPets = pets.filter(
    (pet) =>
      (!selectedSpecies || pet.species === selectedSpecies) &&
      (!selectedGender || pet.gender === selectedGender)
  );

  return (
    <Container>
      {/* 🏠 Sidebar */}
      <Sidebar>
        <Logo src={logo} alt='Adopta Un Amigo' />
        <Title>🏡 Adopta un Amigo</Title>

        <List>
          {['Perro', 'Gato'].map((species) => (
            <ListItem key={species} disablePadding>
              <ListItemButton onClick={() => setSelectedSpecies(species)}>
                <ListItemIcon>
                  <PetsIcon />
                </ListItemIcon>
                <ListItemText primary={species} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        <Title>Filtrar por Género</Title>
        <FilterButton
          variant={selectedGender === 'Hembra' ? 'contained' : 'outlined'}
          color='secondary'
          onClick={() => setSelectedGender('Hembra')}
        >
          Hembra
        </FilterButton>
        <FilterButton
          variant={selectedGender === 'Macho' ? 'contained' : 'outlined'}
          color='primary'
          onClick={() => setSelectedGender('Macho')}
        >
          Macho
        </FilterButton>

        <Button
          variant='contained'
          color='success'
          startIcon={<UploadFileIcon />}
          onClick={handleOpenForm}
        >
          Agregar Mascota
        </Button>
      </Sidebar>

      {/* 📸 Contenido Principal */}
      <MainContent>
        <PetRow>
          {filteredPets.map((pet) => (
            <StyledCard key={pet.id} onClick={() => setSelectedPet(pet)}>
              <CardMedia
                component='img'
                height='180'
                image={pet.image || 'https://via.placeholder.com/150'}
                alt={pet.name}
              />

              <CardContent>
                <Typography variant='h6'>{pet.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {pet.species} - {pet.gender}
                </Typography>
                <Button variant='contained' fullWidth sx={{ marginTop: 2 }}>
                  Adoptar
                </Button>
              </CardContent>
            </StyledCard>
          ))}
        </PetRow>
      </MainContent>

      {/* 📝 Modal con el formulario */}
      <Modal open={isFormOpen} onClose={handleCloseForm}>
        <ModalContent>
          <AddPetForm onClose={handleCloseForm} setPets={setPets} pets={pets} />
        </ModalContent>
      </Modal>

      {/* 📝 Modal con detalles de la mascota */}
      {selectedPet && (
        <Modal open={!!selectedPet} onClose={() => setSelectedPet(null)}>
          <ModalContent>
            <img
              src={selectedPet.image || 'https://via.placeholder.com/150'}
              alt={selectedPet.name}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <Typography variant='h5' sx={{ marginTop: 2 }}>
              {selectedPet.name}
            </Typography>
            <Typography variant='body1'>
              {selectedPet.species} - {selectedPet.gender}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ marginTop: 1 }}
            >
              Edad: {selectedPet.age} años
            </Typography>
            <Typography variant='body2' sx={{ marginTop: 1 }}>
              Descripción: {selectedPet.description}
            </Typography>
            <Button
              variant='contained'
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => setSelectedPet(null)}
            >
              Cerrar
            </Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdoptaUnAmigo;
