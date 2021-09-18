import React, { useState, createContext } from "react"
import { AT } from "@lingdocs/lingdocs-main";

const UserContext = createContext<
  { user: AT.LingdocsUser | undefined, setUser: React.Dispatch<React.SetStateAction<AT.LingdocsUser | undefined>> }
  | undefined
>(undefined);

function UserProvider({ children }: any) {
  const [user, setUser] = useState<AT.LingdocsUser | undefined>(undefined);
  return <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context;
}

export { UserProvider, useUser };
