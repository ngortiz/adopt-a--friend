import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdoptAPet from './AdoptAPet';

import '@testing-library/jest-dom';

vi.mock('@aws-amplify/ui-react', async () => {
  const actual = await vi.importActual<typeof import('@aws-amplify/ui-react')>(
    '@aws-amplify/ui-react'
  );
  return {
    ...actual,
    useAuthenticator: vi.fn(() => ({
      user: null as any,
    })),
  };
});

describe('AdoptAPet', () => {
  it('debe renderizar el título "Adopta Un Amigo"', async () => {
    render(<AdoptAPet />);
    await waitFor(() => {
      expect(screen.getByAltText(/Adopta Un Amigo/i)).toBeInTheDocument();
    });
  });
});
