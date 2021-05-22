import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./components/layout/AuthContext";
import { SnackbarProvider } from "notistack";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import cs from "./translations/cs"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      cs: cs,
      en: {
        translation: {
          "Welcome to React": "Welcome to React and react-i18next"
        }
      }
    },
    lng: "cs",
    fallbackLng: "cs",

    interpolation: {
      escapeValue: false
    }
  });

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={5}>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
