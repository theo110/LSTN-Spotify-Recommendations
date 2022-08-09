import { React, useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './components/login/Login'
import Playlists from './components/playlists/Playlists'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954',
      contrastText: '#F0FFFF'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#1DB954'
    },
  },
})


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/playlists" element={<Playlists />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
