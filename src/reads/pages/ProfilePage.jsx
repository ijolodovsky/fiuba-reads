import { useContext } from "react";
import { AuthContext } from "../../auth/context";

export const ProfilePage = () => {

  const { authState } = useContext(AuthContext);

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <h2>{authState.user?.name}</h2>
        </div>
      </div>
    </>
  )
}
