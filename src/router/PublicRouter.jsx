import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth";
import React, { useContext } from "react";

export const PublicRouter = ({children}) => {
    const { authState: { logged } } = useContext(AuthContext);

    return (!logged) ? children : <Navigate to="/" />;
}
 