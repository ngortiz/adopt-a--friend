import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ListItem,
  Divider,
  Modal,
  Box,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import AdoptionRequest from '../Pages/AdoptionRequest';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPetForm from '../components/AddPetForm';
import logo from '../assets/logo.jpg';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 1000vh;
  background-color: #e0e5ec;
`;

const StyledSidebar = styled('aside')`
  width: 250px;
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled('img')`
  width: 100px;
  margin-bottom: 15px;
  border-radius: 100%;
`;

const StyledTitle = styled('h3')`
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const StyledFilterButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
  background-color: white !important;
  color: #16a085 !important;
  border-color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  background-color: white;
  border-radius: 5px;
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #dcdcdc;
    }
    &:hover fieldset {
      border-color: #b5b5b5;
    }
    &.Mui-focused fieldset {
      border-color: #16a085;
    }
  }
`;

const FilterButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
  background-color: white !important;
  color: #16a085 !important;
  border-color: 2px solid #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 60%;
  left: 40%;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const AdoptButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  border: 2px solid #16a085 !important;
  background-color: white !important;
  color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white;
  }
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
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  background-color: #ecf0f1;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  }
`;
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  width: 1000vh;
`;

const PetImage = styled.img`
  width: 90%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
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

  const [isAdoptionFormOpen, setIsAdoptionFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchAgeMin, setSearchAgeMin] = useState('');
  const [searchAgeMax, setSearchAgeMax] = useState('');
  const [filteredPets, setFilteredPets] = useState(pets);

  const handleSearch = () => {
    const filtered = pets.filter(
      (pet) =>
        (!selectedSpecies || pet.species === selectedSpecies) &&
        (!selectedGender || pet.gender === selectedGender) &&
        (!searchAgeMin || parseInt(pet.age) >= parseInt(searchAgeMin)) &&
        (!searchAgeMax || parseInt(pet.age) <= parseInt(searchAgeMax))
    );
    setFilteredPets(filtered);
  };
  useEffect(() => {
    handleSearch();
  }, [selectedSpecies, selectedGender, searchAgeMin, searchAgeMax]);

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
  const speciesIcons = {
    Perro: <PetsIcon />, // 🐶 Icono de perro
    Gato: <FavoriteIcon />, // 🐱 Icono de gato
  };

  return (
    <Container>
      <StyledSidebar>
        <Logo src={logo} alt='Adopta Un Amigo' />

        <StyledTitle>Género</StyledTitle>
        <StyledFilterButton onClick={() => setSelectedGender('Hembra')}>
          Hembra
        </StyledFilterButton>
        <StyledFilterButton onClick={() => setSelectedGender('Macho')}>
          Macho
        </StyledFilterButton>

        <Divider sx={{ width: '100%', margin: '10px 0' }} />

        <ListItem disablePadding>
          <Button
            fullWidth
            variant='contained'
            startIcon={<UploadFileIcon />}
            onClick={handleOpenForm}
            sx={{
              backgroundColor: '#16a085 ',
              color: 'white',
              '&:hover': { backgroundColor: '#1f6696' },
            }}
          >
            Agregar Mascota
          </Button>
        </ListItem>

        <Divider sx={{ width: '100%', margin: '10px 0' }} />

        <StyledTitle>Edad</StyledTitle>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            backgroundColor: '#f1f1f1',
            padding: 2,
            borderRadius: '8px',
            justifyContent: 'space-between',
          }}
        >
          <StyledTextField
            label='Desde'
            variant='outlined'
            size='small'
            type='number'
            onChange={(e) => setSearchAgeMin(e.target.value)}
          />
          <StyledTextField
            label='Hasta'
            variant='outlined'
            size='small'
            type='number'
            onChange={(e) => setSearchAgeMax(e.target.value)}
          />
        </Box>

        <Button
          variant='contained'
          onClick={handleSearch}
          sx={{
            width: '100%',
            backgroundColor: '#16a085',
            color: 'white',
            borderRadius: '8px',
            marginTop: '15px',
            padding: '10px 0',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#13856b' },
          }}
        >
          Buscar
        </Button>
      </StyledSidebar>
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
                startIcon={speciesIcons[species]} // Agregar el icono aquí
              >
                {species}
              </Button>
            ))}
          </Box>
        </Box>
        ;
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
      <AdoptionRequest
        open={isAdoptionFormOpen}
        onClose={handleCloseAdoptionForm}
        selectedPet={selectedPet}
        onSubmit={handleAdoptionSubmit}
      />
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
