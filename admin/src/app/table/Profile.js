import React from 'react';
import { useAuth } from "../AuthContext";

function Profile(props) {

  const {user} = useAuth()

  return (
    <div>{JSON.stringify(user)}</div>
  );
}

export default Profile;