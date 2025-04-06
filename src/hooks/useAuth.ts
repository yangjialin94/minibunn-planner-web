import { useContext } from "react";

import { AuthContext } from "@/providers/AuthProvider";

// This hook provides access to the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
