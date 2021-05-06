import './App.css';
import Main from "./app/Main";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={5}>
      <Main />
      </SnackbarProvider>
    </div>
  );
}

export default App;
