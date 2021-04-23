import React from 'react';
import Home from './app/Home';
import { GlobalProvider } from './app/context/globalContext';

export default function App() {
  
  return (
    <GlobalProvider>
      <Home />
    </GlobalProvider>
    ) 
}