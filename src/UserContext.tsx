import React from "react";
import { AT } from "@lingdocs/lingdocs-main";

const UserContext = React.createContext<undefined | AT.LingdocsUser>(undefined);

export default UserContext;