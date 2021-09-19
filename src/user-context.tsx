import React, { createContext, useEffect } from "react"
import useStickyState from "./useStickyState";
import {
  AT,
  getUser,
  userObjIsEqual,
} from "@lingdocs/lingdocs-main";
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
  const {value, setValue} = useStickyState<AT.LingdocsUser | undefined>(
    undefined,
    "saved-user",
  );

  function pullUser() {
    getUser().then((user) => {
      if (user === "offline") return;
      // don't update if there's nothing new - to avoid re-renders erasing game input etc
      if (!userObjIsEqual(user, value)) {
        setValue(user);
      }
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

  return <UserContext.Provider value={{ user: value, setUser: setValue, pullUser }}>
    {children}
  </UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context;
}

export { UserProvider, useUser };
