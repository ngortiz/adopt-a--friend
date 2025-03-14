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
  Pagination,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import AdoptionRequest from '../Pages/AdoptionRequest';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPetForm from '../components/AddPetForm';
import logo from '../assets/logo.jpg';
import { get } from 'aws-amplify/api';
import awsExports from '../aws-exports';
import PetDetailsModal from './PetDetailsModal';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh; // ✅ Ocupa toda la pantalla
  width: 100vw;
  background-color: #e0e5ec;
  overflow: hidden; // ✅ Evita barras negras
`;
const StyledSidebar = styled('aside')`
  width: 220px;
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh; // ✅ Hace que ocupe toda la altura
  overflow-y: auto;

  @media (min-width: 768px) {
    width: 250px;
  }
`;

const Logo = styled('img')`
  width: 80px;
  margin-bottom: 15px;
  border-radius: 50%;

  @media (min-width: 768px) {
    width: 100px;
  }
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
const StyledButton = styled(Button)`
  margin: 5px !important;
  width: 100%;
  border: 2px solid #16a085 !important;
  background-color: white !important;
  color: #16a085 !important;

  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
`;

const AdoptButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  border: 2px solid #16a085 !important;
  background-color: white !important;
  color: #16a085 !important;
  &:hover {
    background-color: #13856b !important;
    color: white !important;
  }
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const PetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 10px;
`;

const StyledCard = styled(Card)`
  position: relative;
  width: 100%;
  max-width: 300px;
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
  width: 100%;
  max-width: 1200px;
  margin: auto;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const FiltersContainer = styled.div`
  position: fixed;
  top: 17px;
  left: 14%;
  width: 80%;
  background: #e0e5ec;
  padding: 22px;
  z-index: 1000;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  border-bottom: 2px solid #ccc;
`;

interface Pet {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: string;
  description: string;
  imageUrl: string;
}
interface PetDetails {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: string;
  description: string;
  imageUrl: string;
  adoptionStatus: string;
}

const AdoptAPet = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [isAdoptionFormOpen, setIsAdoptionFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchPets = async () => {
    try {
      const getOperation = get({
        apiName: awsExports.aws_cloud_logic_custom[0].name,
        path: '/pets',
      });

      const response = await getOperation.response;
      const data: unknown = await response.body.json();

      setPets(data as Pet[]);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      (!selectedSpecies || pet.species === selectedSpecies) &&
      (!selectedGender || pet.gender === selectedGender)
  );

  // Paginación de los resultados filtrados
  const totalPages = Math.ceil(filteredPets.length / pageSize);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Resetear la página a 1 cuando se aplica un filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecies, selectedGender]);

  const handleAdoptClick = (pet: Pet) => {
    setSelectedPet({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      gender: pet.gender,
      age: pet.age,
      description: pet.description || 'Descripción no disponible',
      imageUrl: pet.imageUrl || 'https://via.placeholder.com/250',
      adoptionStatus: 'Disponible',
    });

    setIsAdoptionFormOpen(true);
    setIsDetailsOpen(false);
  };

  const handleDetailsClick = (pet: Pet) => {
    setSelectedPet({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      gender: pet.gender,
      age: pet.age,
      description: pet.description,
      imageUrl: pet.imageUrl || 'https://via.placeholder.com/250',
      adoptionStatus: 'Disponible',
    });
    setIsDetailsOpen(true);
  };

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
    id: string
  ) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleCloseMenu = (id: string) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: null }));
  };

  const handleDeletePet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    handleCloseMenu(id);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      gender: pet.gender,
      age: pet.age,
      description: pet.description || 'Descripción no disponible',
      imageUrl: pet.imageUrl || 'https://via.placeholder.com/250',
      adoptionStatus: 'Disponible',
    });

    setIsFormOpen(true);
  };
  const speciesIcons = {
    Perro: <PetsIcon />,
    Gato: <FavoriteIcon />,
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
          <StyledButton
            fullWidth
            startIcon={<UploadFileIcon />}
            onClick={handleOpenForm}
          >
            Agregar Mascota
          </StyledButton>
        </ListItem>
      </StyledSidebar>

      <MainContent>
        <Box sx={{ paddingTop: '60px' }}>
          {' '}
          <FiltersContainer>
            {['Perro', 'Gato'].map((species) => (
              <Button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                sx={{
                  backgroundColor:
                    selectedSpecies === species ? '#13856b' : 'white',
                  color: selectedSpecies === species ? 'white' : '#16a085',
                  border: '1px solid #16a085',
                  '&:hover': { backgroundColor: '#13856b', color: 'white' },
                }}
                variant='contained'
                startIcon={
                  species === 'Gato' ? speciesIcons.Gato : speciesIcons.Perro
                }
              >
                {species}
              </Button>
            ))}
          </FiltersContainer>
        </Box>

        <PetRow>
          {paginatedPets.map((pet) => (
            <StyledCard key={pet.id}>
              <CardMedia
                component='img'
                height='180'
                image={pet.imageUrl || 'https://via.placeholder.com/150'}
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

        {/* Paginación con MUI */}
        {totalPages > 1 && (
          <PaginationContainer>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color='primary'
            />
          </PaginationContainer>
        )}
      </MainContent>
      <AdoptionRequest
        open={isAdoptionFormOpen}
        onClose={handleCloseAdoptionForm}
        selectedPet={selectedPet}
        onSubmit={handleAdoptionSubmit} // ✅ Pasar la función de manejo de envío
      />

      {/* Modal para agregar mascota */}
      <Modal open={isFormOpen} onClose={handleCloseForm}>
        <ModalContent>
          <AddPetForm onClose={handleCloseForm} fetchPets={fetchPets} />
        </ModalContent>
      </Modal>
      <PetDetailsModal
        open={isDetailsOpen}
        handleClose={() => setIsDetailsOpen(false)}
        petDetails={selectedPet}
      />
    </Container>
  );
};

export default AdoptAPet;
