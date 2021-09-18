import React, { useState, createContext, useEffect } from "react"
import { AT, getUser } from "@lingdocs/lingdocs-main";

const UserContext = createContext<
  {
    user: AT.LingdocsUser | undefined,
    setUser: React.Dispatch<React.SetStateAction<AT.LingdocsUser | undefined>>,
    pullUser: () => void,
  }
  | undefined
>(undefined);

function UserProvider({ children }: any) {
  const [user, setUser] = useState<AT.LingdocsUser | undefined>(undefined);

  function pullUser() {
    getUser().then((user) => {
      setUser(user === "offline" ? undefined : user);
    }).catch(console.error);
  }

  useEffect(() => {
    pullUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, pullUser }}>
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
