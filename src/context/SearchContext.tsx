'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SearchContextProps {
  formData: {
    destiny: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    children: number;
  };
  setFormData: (newData: Partial<{
    destiny: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    children: number;
  }>) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); 
  const todayFormatted = today.toISOString().split('T')[0];
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    destiny: "São Paulo",
    checkIn: todayFormatted,
    checkOut: tomorrowFormatted,
    rooms: 1,
    adults: 1,
    children: 0,
  });

  const calculateRooms = (adults: number, children: number): number => {
    const totalPeople = adults + children;
    return Math.max(1, Math.ceil(totalPeople / 3)); 
  };

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...newData };

      if (newData.adults !== undefined || newData.children !== undefined) {
        updatedData.rooms = calculateRooms(updatedData.adults, updatedData.children);
      }

      return updatedData;
    });
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      rooms: calculateRooms(prevData.adults, prevData.children),
    }));
  }, [formData.adults, formData.children]); 

  return (
    <SearchContext.Provider value={{ formData, setFormData: updateFormData }}>
      {children}
    </SearchContext.Provider>
  );
};
