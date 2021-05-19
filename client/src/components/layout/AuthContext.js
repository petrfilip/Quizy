import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";

const getUser = (token) => (token && jwt_decode(token));

const AuthContext = createContext();

function AuthProvider({ children }) {

  const removeTokens = () => {
    localStorage.removeItem("tokens");

    setState({
      status: 'success',
      error: null,
      user: null,
      token: authTokens,
      setTokens,
      removeTokens
    })
  }

  const [authTokens, setAuthTokens] = useState(localStorage.getItem("tokens"));

  const [state, setState] = useState({
    status: 'pending'
  })

  const setTokens = (data) => {
    localStorage.setItem("tokens", data);
    setAuthTokens(data);
    const user = getUser(data);
    setState({
        status: 'success',
        error: null,
        user: user,
        token: data,
        setTokens,
        removeTokens
      }
    );
    // error => setState({ status: 'error', error, user: null }),

  }

  useEffect(() => {

    const user = getUser(localStorage.getItem("tokens"));
    setState({
        status: 'success',
        error: null,
        user: user,
        token: authTokens,
        setTokens,
        removeTokens
      }
    );
  }, [])

  return (
    <AuthContext.Provider value={state}>
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'error' ? (
        <div>
          Oh no
          <div>
            <pre>{state.error.message}</pre>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const state = useContext(AuthContext)
  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
  }
}

export { AuthProvider, useAuth }