/**
 * React context for a dictionary.
 */
import { createContext, useContext } from 'react';

import { Dictionary } from './dictionary';

const DictionaryContext = createContext<Dictionary>(new Dictionary([]));

export function useDictionary() {
    return useContext(DictionaryContext);
}

export function DictionaryProvider({ children, dictionary }: { children: any, dictionary: Dictionary }) {
    return (
        <DictionaryContext.Provider value={ dictionary }>
            {children}
        </DictionaryContext.Provider>
    );
}
