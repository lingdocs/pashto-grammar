import React, { useState, createContext, useEffect } from "react"
import { AT, getUser } from "@lingdocs/lingdocs-main";
import { CronJob } from "cron";

const UserContext = createContext<
  {
    user: AT.LingdocsUser | undefined,
    setUser: React.Dispatch<React.SetStateAction<AT.LingdocsUser | undefined>>,
    pullUser: () => void,
  }
  | undefined
>(undefined);

// TODO: persisting user in local state
function UserProvider({ children }: any) {
  const [user, setUser] = useState<AT.LingdocsUser | undefined>(undefined);

  function pullUser() {
    console.log("pulling user...");
    getUser().then((user) => {
      setUser(user === "offline" ? undefined : user);
    }).catch(console.error);
  }

  const checkUserCronJob = new CronJob("1/30 * * * * *", () => {
    pullUser();
  });

  useEffect(() => {
    pullUser();
    checkUserCronJob.start();
    return () => {
      checkUserCronJob.stop();
    }
    // eslint-disable-next-line
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
