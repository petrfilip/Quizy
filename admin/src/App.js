import './App.css';
import Main from "./app/Main";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./app/AuthContext";
import { useState } from "react";

function App() {

  return (
    <div className="App">
      <SnackbarProvider maxSnack={5}>
        <AuthProvider>
          <Main/>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
