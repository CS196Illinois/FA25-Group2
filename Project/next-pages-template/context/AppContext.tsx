import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  showSignOutInNavbar: boolean;
  setShowSignOutInNavbar: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [showSignOutInNavbar, setShowSignOutInNavbar] = useState(false);

  return (
    <AppContext.Provider
      value={{ showSignOutInNavbar, setShowSignOutInNavbar }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
