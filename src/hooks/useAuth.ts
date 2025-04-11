import { useContext } from "react";

import { AuthContext } from "@/context/AuthProvider";

// This hook provides access to the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
