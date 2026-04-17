import { createContext, useContext } from "react";

type AccountUnsavedChangesContextValue = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
};

const AccountUnsavedChangesContext =
  createContext<AccountUnsavedChangesContextValue | null>(null);

export const AccountUnsavedChangesProvider = AccountUnsavedChangesContext.Provider;

export const useAccountUnsavedChanges = () => {
  const context = useContext(AccountUnsavedChangesContext);
  if (!context) {
    throw new Error("useAccountUnsavedChanges must be used within AccountUnsavedChangesProvider");
  }
  return context;
};
