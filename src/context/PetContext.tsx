import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  selectedSpecies: string | null;
  setSelectedSpecies: (value: string | null) => void;
  selectedGender: string | null;
  setSelectedGender: (value: string | null) => void;
}

const PetFilterContext = createContext<FilterContextType | undefined>(
  undefined
);

export const PetFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  return (
    <PetFilterContext.Provider
      value={{
        selectedSpecies,
        setSelectedSpecies,
        selectedGender,
        setSelectedGender,
      }}
    >
      {children}
    </PetFilterContext.Provider>
  );
};

export const usePetFilter = () => {
  const context = useContext(PetFilterContext);
  if (!context) {
    throw new Error('usePetFilter debe usarse dentro de PetFilterProvider');
  }
  return context;
};
