import { useReducer } from "react"
import { AuthContext } from "./AuthContext"
import { authReducer } from "./authReducer"

export const AuthProvider = ({children}) => {

    const [authState, dispatch] = useReducer(authReducer, {logged: false, name: null});

  return (
    <AuthContext.Provider value={{ }}>
      { children }
    </AuthContext.Provider>
  )
}