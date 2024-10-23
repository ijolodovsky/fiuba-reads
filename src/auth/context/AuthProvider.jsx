import { useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { types } from "../types/types";

const init = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return {
    logged: !!user,
    user: user
  }
};

export const AuthProvider = ({ children }) => {

  const [authState, dispatch] = useReducer(authReducer, {}, init);

  const login = (userData) => {
    const { name, email, username, first_name, last_name, age, role, profile_picture } = userData;

    const user = {
      name: name,
      email: email,
      username: username,
      firstName: first_name,
      lastName: last_name,
      age:age,
      role: role,
      profilePicture: profile_picture
    };

    const action = {
      type: types.login,
      payload: user
    };

    localStorage.setItem('user', JSON.stringify(user));

    dispatch(action);
  };

  const logout = () => {
    localStorage.removeItem('user');

    const action = {
      type: types.logout
    };

    dispatch(action);
  };

  return (
    <AuthContext.Provider value={{ login, logout, authState }}>
      {children}
    </AuthContext.Provider>
  );
};
