import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

const savedTheme = localStorage.getItem('theme');
const prefersDarkMode = savedTheme === 'dark';

const theme = createTheme({
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
  },
});

if (savedTheme) {
  document.documentElement.classList.add(savedTheme);
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
