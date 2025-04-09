import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddPetForm from './AddPetForm';
import '@testing-library/jest-dom';

describe('AddPetForm', () => {
  const mockOnClose = vi.fn();
  const mockFetchPets = vi.fn();

  it('debe renderizar el formulario con todos los campos esperados', () => {
    render(<AddPetForm onClose={mockOnClose} fetchPets={mockFetchPets} />);

    // Verifica encabezado
    expect(screen.getByText('Agregar Nueva Mascota')).toBeInTheDocument();

    // Verificamos os inputs
    expect(screen.getByText('Agregar Nueva Mascota')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Especie')).toBeInTheDocument();
    expect(screen.getByText('Género')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();

    // Verifica botón para registrar
    expect(
      screen.getByRole('button', { name: /registrar mascota/i })
    ).toBeInTheDocument();
  });
});
