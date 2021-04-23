import React, { createContext, useState } from 'react';

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]); // Almacena los contactos

    return (
        <GlobalContext.Provider value={{ contacts, setContacts }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;