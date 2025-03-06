import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPetForm from '../components/AddPetForm';
import logo from '../assets/logo.png';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #e0e5ec;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #2c3e50;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  color: white;
`;

const ModalContent = styled(Box)`
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

const Logo = styled.img`
  width: 100px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: white;
`;

const FilterButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
  background-color: #16a085 !important;
  color: white !important;
  &:hover {
    background-color: #13856b !important;
  }
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
  color: #333;
`;

const StyledCard = styled(Card)`
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  background-color: #ecf0f1;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  color: white;
  &:hover {
    background-color: #16a085;
  }
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

  useEffect(() => {
    localStorage.setItem('pets', JSON.stringify(pets));
  }, [pets]);

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
        <Title>🏡 Adopta un Amigo</Title>

        <List>
          {['Perro', 'Gato'].map((species) => (
            <ListItem key={species} disablePadding>
              <StyledListItemButton onClick={() => setSelectedSpecies(species)}>
                <ListItemIcon>
                  <PetsIcon />
                </ListItemIcon>
                <ListItemText primary={species} />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        <Title>Filtrar por Género</Title>
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
        <Button
          variant='contained'
          color='success'
          startIcon={<UploadFileIcon />}
          onClick={handleOpenForm}
        >
          Agregar Mascota
        </Button>
      </Sidebar>

      <MainContent>
        <PetRow>
          {filteredPets.map((pet) => (
            <StyledCard key={pet.id}>
              <CardMedia
                component='img'
                height='180'
                image={pet.image || 'https://via.placeholder.com/150'}
                alt={pet.name}
                onClick={() => setSelectedPet(pet)}
              />
              <CardContent>
                <Typography variant='h6'>{pet.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {pet.species} - {pet.gender}
                </Typography>

                {/* Botón de menú */}
                <IconButton
                  sx={{ position: 'absolute', top: 5, right: 5 }}
                  onClick={(event) => handleOpenMenu(event, pet.id)}
                >
                  <MoreVertIcon />
                </IconButton>

                {/* Menú de opciones */}
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

                <Button
                  variant='contained'
                  fullWidth
                  sx={{
                    marginTop: 2,
                    backgroundColor: '#16a085',
                    color: 'white',
                    '&:hover': { backgroundColor: '#13856b' },
                  }}
                  onClick={() =>
                    navigate('/adoption-request', { state: { pet } })
                  }
                >
                  Adoptar
                </Button>
              </CardContent>
            </StyledCard>
          ))}
        </PetRow>
      </MainContent>

      {/* Modal para agregar mascota */}
      <Modal open={isFormOpen} onClose={handleCloseForm}>
        <ModalContent>
          <AddPetForm onClose={handleCloseForm} setPets={setPets} pets={pets} />
        </ModalContent>
      </Modal>

      {/* Modal para detalles de la mascota */}
      <Modal open={Boolean(selectedPet)} onClose={() => setSelectedPet(null)}>
        <ModalContent>
          {selectedPet && (
            <>
              <img
                src={selectedPet.image || 'https://via.placeholder.com/150'}
                alt={selectedPet.name}
                style={{ width: '100%', borderRadius: '10px' }}
              />
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
              <Button
                variant='contained'
                fullWidth
                onClick={() => setSelectedPet(null)}
              >
                Cerrar
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdoptAPet;
