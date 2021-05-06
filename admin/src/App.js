import './App.css';
import Main from "./app/Main";
import { SnackbarProvider } from "notistack";
import { AuthContext } from "./app/AuthContext";
import { useState } from "react";

function App() {

  const unparsedToken = localStorage.getItem("tokens");
  const existingTokens = JSON.parse(typeof unparsedToken === 'object' && unparsedToken);
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <div className="App">
      <SnackbarProvider maxSnack={5}>
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
          <Main/>
        </AuthContext.Provider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
