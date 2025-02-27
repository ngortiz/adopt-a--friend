import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';

const pets = [
  {
    id: 1,
    name: 'Firulais',
    species: 'Perro',
    age: '2 años',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Michi',
    species: 'Gato',
    age: '1 año',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Lola',
    species: 'Conejo',
    age: '3 años',
    image: 'https://via.placeholder.com/150',
  },
];

const pages: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '20px',
        padding: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}
    >
      {pets.map((pet) => (
        <motion.div key={pet.id} whileHover={{ scale: 1.05 }}>
          <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardMedia
              component='img'
              height='140'
              image={pet.image}
              alt={pet.name}
            />
            <CardContent>
              <Typography variant='h6' component='div'>
                {pet.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {pet.species} - {pet.age}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Adoptar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default pages;
