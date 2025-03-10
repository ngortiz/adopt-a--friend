import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Modal,
  Box,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPetForm from '../components/AddPetForm';
import logo from '../assets/logo.jpg';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #e0e5ec;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f1f1f1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  color: #13856b;
`;

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

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  color: #333;
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 900px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  width: 80%;
  margin-bottom: 15px;
  border-radius: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #13856b;
`;

const FilterButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
  background-color: white !important;
  color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
`;

const AdoptButton = styled(Button)`
  margin: 5px !important;
  margin-left: 10% !important%;
  width: 40%;
  border-color: 2px solid #16a085;
  background-color: white !important;
  color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white;
  }
`;
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  width: 1000vh;
`;

const PetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding: 10px;
  color: #333;
`;

const StyledCard = styled(Card)`
  position: relative;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  background-color: #ecf0f1;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  color: white;
  &:hover {
    background-color: #16a085;
  }
`;

const PetImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;

interface Pet {
  id: number;
  name: string;
  species: string;
  gender: string;
  age: string;
  description: string;
  image: string;
}

const AdoptAPet = () => {
  const getStoredPets = (): Pet[] => {
    const storedPets = localStorage.getItem('pets');
    return storedPets ? JSON.parse(storedPets) : [];
  };

  const [pets, setPets] = useState<Pet[]>(getStoredPets);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    [key: number]: HTMLElement | null;
  }>({});
  const navigate = useNavigate();
  const [isAdoptionFormOpen, setIsAdoptionFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleAdoptClick = (pet: Pet) => {
    setSelectedPet(pet);
    setIsAdoptionFormOpen(true);
    setIsDetailsOpen(false);
  };

  const handleDetailsClick = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    localStorage.setItem('pets', JSON.stringify(pets));
  }, [pets]);

  const handleCloseAdoptionForm = () => {
    setIsAdoptionFormOpen(false);
    setSelectedPet(null);
  };

  const handleAdoptionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('✅ Solicitud de adopción enviada con éxito');
    handleCloseAdoptionForm();
  };

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleCloseMenu = (id: number) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: null }));
  };

  const handleDeletePet = (id: number) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    handleCloseMenu(id);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsFormOpen(true); // Abrir formulario de edición
  };

  const filteredPets = pets.filter(
    (pet) =>
      (!selectedSpecies || pet.species === selectedSpecies) &&
      (!selectedGender || pet.gender === selectedGender)
  );

  return (
    <Container>
      <Sidebar>
        <Logo src={logo} alt='Adopta Un Amigo' />

        <Title> Género</Title>
        <FilterButton
          variant='contained'
          onClick={() => setSelectedGender('Hembra')}
        >
          Hembra
        </FilterButton>
        <FilterButton
          variant='contained'
          onClick={() => setSelectedGender('Macho')}
        >
          Macho
        </FilterButton>
        <ListItem disablePadding>
          <StyledListItemButton onClick={handleOpenForm}>
            <ListItemIcon>
              <UploadFileIcon />
            </ListItemIcon>
            <ListItemText primary='Agregar Mascota' />
          </StyledListItemButton>
        </ListItem>
      </Sidebar>

      <MainContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 2,
            width: '100%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              padding: 1,
              width: '100%',
            }}
          >
            {['Perro', 'Gato'].map((species) => (
              <Button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                sx={{
                  marginTop: 1,
                  marginRight: 1,
                  backgroundColor: 'white',
                  color: '#16a085',
                  border: '1px solid#16a085',
                  '&:hover': {
                    backgroundColor: '#13856b',
                    color: 'white',
                  },
                  padding: '5px 10px',
                }}
                variant='contained'
              >
                {species}
              </Button>
            ))}
          </Box>
        </Box>

        <PetRow>
          {filteredPets.map((pet) => (
            <StyledCard key={pet.id}>
              <CardMedia
                component='img'
                height='180'
                image={pet.image || 'https://via.placeholder.com/150'}
                alt={pet.name}
                onClick={() => handleDetailsClick(pet)}
              />
              <CardContent>
                <Typography variant='h6'>{pet.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {pet.species} - {pet.gender}
                </Typography>

                <IconButton
                  sx={{ position: 'absolute', top: 5, right: 5 }}
                  onClick={(event) => handleOpenMenu(event, pet.id)}
                >
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={menuAnchor[pet.id]}
                  open={Boolean(menuAnchor[pet.id])}
                  onClose={() => handleCloseMenu(pet.id)}
                >
                  <MenuItem onClick={() => handleEditPet(pet)}>Editar</MenuItem>
                  <MenuItem onClick={() => handleDeletePet(pet.id)}>
                    Eliminar
                  </MenuItem>
                </Menu>

                <AdoptButton
                  variant='contained'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdoptClick(pet);
                  }}
                >
                  Adoptar
                </AdoptButton>
              </CardContent>
            </StyledCard>
          ))}
        </PetRow>
      </MainContent>

      {/* Modal de Solicitud de Adopción */}
      <Modal open={isAdoptionFormOpen} onClose={handleCloseAdoptionForm}>
        <StyledModalContent>
          {selectedPet && (
            <>
              <Typography variant='h5'>📝 Solicitud de Adopción</Typography>
              <Typography variant='h6'>
                🐶 Adoptando a: {selectedPet.name}
              </Typography>
              <form onSubmit={handleAdoptionSubmit}>
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
                <FilterButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                >
                  Enviar Solicitud
                </FilterButton>
              </form>
            </>
          )}
        </StyledModalContent>
      </Modal>

      {/* Modal para agregar mascota */}
      <Modal open={isFormOpen} onClose={handleCloseForm}>
        <ModalContent>
          <AddPetForm onClose={handleCloseForm} />
        </ModalContent>
      </Modal>

      {/* Modal de Detalles */}
      <Modal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        <ModalContent>
          {selectedPet && (
            <>
              <PetImage
                src={selectedPet.image || 'https://via.placeholder.com/150'}
                alt={selectedPet.name}
              />
              <Box>
                <Typography variant='h5'>{selectedPet.name}</Typography>
                <Typography variant='body1'>
                  {selectedPet.species} - {selectedPet.gender}
                </Typography>
                <Typography variant='body2'>
                  Edad: {selectedPet.age} años
                </Typography>
                <Typography variant='body2'>
                  Descripción: {selectedPet.description}
                </Typography>
                <FilterButton
                  variant='contained'
                  fullWidth
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Cerrar
                </FilterButton>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdoptAPet;
