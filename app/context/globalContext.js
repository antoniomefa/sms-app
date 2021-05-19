import React, { createContext, useState } from 'react';

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]); // Almacena los contactos
    const [campaigns, setCampaigns] = useState([]); // Almacena las campañas
    const [update, setUpdate] = useState({});

    return (
        <GlobalContext.Provider value={{ contacts, setContacts, campaigns, setCampaigns, update, setUpdate }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;