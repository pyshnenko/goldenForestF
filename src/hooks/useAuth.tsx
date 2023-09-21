import * as React from "react";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NullableUser} from "types/User";
import { useLocalStorage } from "./useLocalStorage";

interface AuthCtx {
  user: NullableUser,
  login: (data: NullableUser, page?: string) => Promise<void>,
  logout: () => void,
  saveFull: (val: any) => void,
  userFull: any
};

const AuthContext = createContext<AuthCtx>({
  user: null, 
  login: async(user, page) => {},
  logout: () => {},
  saveFull: (val: any) => {},
  userFull: null
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage("user", '');
  const [userFull, setUserFull] = React.useState();
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: NullableUser, page?: string) => {
    setUser(data);
    page === undefined? navigate("/") : navigate(page);
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      saveFull: setUserFull,
      userFull
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
