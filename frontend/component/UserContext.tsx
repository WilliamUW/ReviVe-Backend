"use client";

import { DeviceListing, mockListings } from "@/utils/device";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
type UserContextType = {
  listings: DeviceListing[];
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook for accessing the context
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// Define the provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [listings] = useState<DeviceListing[]>(mockListings);

  return (
    <UserContext.Provider value={{ listings }}>{children}</UserContext.Provider>
  );
};

export { UserProvider, useUserContext };
