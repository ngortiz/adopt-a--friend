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
import AdoptionRequest from '../Pages/AdoptionRequest';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPetForm from '../components/AddPetForm';
import logo2 from '../assets/logo2.jpg';
import { get } from 'aws-amplify/api';
import awsExports from '../aws-exports';
import PetDetailsModal from './PetDetailsModal';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Navbar from '../components/Navbar';

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #e0e5ec;
  overflow: hidden;
`;
const StyledSidebar = styled('aside')`
  width: 280px;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
  margin-top: 4%;
  border-right: 3px solid#e67e22;

  @media (max-width: 1024px) {
    width: 240px;
  }
`;

const Logo = styled('img')`
  width: 80% !important;
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
  color: #e67e22 !important;
  border-color: #e67e22 !important;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;
  }
`;
const StyledButton = styled(Button)`
  grid-column: span 2;
  padding: 1rem;
  width: 50%;
  margin: 0 auto;
  font-size: 1.1rem;
  background-color: #e67e22 !important;
  color: white !important;
  border-radius: 30px !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;

    border: 1px solid #e67e22;
  }
`;

const AdoptButton = styled(Button)`
  padding: 1rem;
  width: 50%;
  margin-top: 3% !important;
  left: 22%;
  font-size: 1.1rem;
  background-color: white !important;
  color: #e67e22 !important;
  border-radius: 30px !important;
  border: 1px solid#E67E22 !important;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333 !important;
    color: #e67e22 !important;

    border: 1px solid #e67e22;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  padding: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
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
  padding: 30px;
  max-width: 1400px;
  margin: auto;
  margin-top: 4%;

  max-height: 100vh;
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 80px;
  &::-webkit-scrollbar {
    width: 8px;
  }
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Title = styled.div`
  color: #333 !important;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1%;
  margin-top: 2%;
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
  const { user } = useAuthenticator((context) => [context.user]);
  const pageSize = 8;

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

  return (
    <>
      <Navbar />

      <Container>
        <StyledSidebar>
          <Logo src={logo2} alt='Adopta Un Amigo' />

          <StyledTitle>Género</StyledTitle>
          <StyledFilterButton onClick={() => setSelectedGender('Hembra')}>
            Hembra
          </StyledFilterButton>
          <StyledFilterButton onClick={() => setSelectedGender('Macho')}>
            Macho
          </StyledFilterButton>
          <Divider sx={{ width: '100%', margin: '10px 0' }} />
          <StyledTitle>Especies</StyledTitle>
          <StyledFilterButton onClick={() => setSelectedSpecies('Perro')}>
            🐶 Perro
          </StyledFilterButton>
          <StyledFilterButton onClick={() => setSelectedSpecies('Gato')}>
            🐱 Gato
          </StyledFilterButton>
          <Divider sx={{ width: '100%', margin: '10px 0' }} />

          <Divider sx={{ width: '100%', margin: '10px 0' }} />
          {user && (
            <ListItem disablePadding>
              <StyledButton
                fullWidth
                startIcon={<UploadFileIcon />}
                onClick={handleOpenForm}
              >
                Agregar Mascota
              </StyledButton>
            </ListItem>
          )}
        </StyledSidebar>

        <MainContent>
          <div>
            <Title>Adopta Un Amigo</Title>
          </div>
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
                    <MenuItem onClick={() => handleEditPet(pet)}>
                      Editar
                    </MenuItem>
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
    </>
  );
};

export default AdoptAPet;
