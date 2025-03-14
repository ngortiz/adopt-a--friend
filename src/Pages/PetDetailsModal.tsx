import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

export interface PetDetails {
  id: string;
  name: string;
  imageUrl: string;
  species: string;
  gender: string;
  age: string;
  description: string;
  adoptionStatus: string;
}

interface PetDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  petDetails: PetDetails | null;
}

const StyledDialogContent = styled(DialogContent)`
  padding: 16px;
  overflow-y: auto;
`;

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 100%;
    max-width: 900px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledImage = styled.img`
  flex: 1;
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.6rem;
  color: #16a085;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #16a085;
`;

const StyledLabel = styled.span`
  font-weight: bold;
  color: #16a085;
  font-size: 1rem;
  flex: 1;
  margin-right: 10px;
`;

const StyledSpan = styled.span`
  font-weight: normal;
  color: #555;
  font-size: 1rem;
  flex: 2;
`;

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({
  open,
  handleClose,
  petDetails,
}) => (
  <StyledDialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
    {petDetails && (
      <>
        <StyledDialogTitle>
          DETALLE DE LA MASCOTA
          <IconButton onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent>
          <CardContainer>
            <StyledImage
              src={petDetails.imageUrl || 'https://via.placeholder.com/250'}
              alt={petDetails.name}
            />

            <InfoContainer>
              <DetailRow>
                <StyledLabel>Nombre:</StyledLabel>
                <StyledSpan>{petDetails.name}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Especie:</StyledLabel>
                <StyledSpan>{petDetails.species}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Género:</StyledLabel>
                <StyledSpan>{petDetails.gender}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Edad:</StyledLabel>
                <StyledSpan>{petDetails.age}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Descripción:</StyledLabel>
                <StyledSpan>{petDetails.description}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Estado de Adopción:</StyledLabel>
                <StyledSpan>{petDetails.adoptionStatus}</StyledSpan>
              </DetailRow>
            </InfoContainer>
          </CardContainer>
        </StyledDialogContent>
      </>
    )}
  </StyledDialog>
);

export default PetDetailsModal;
