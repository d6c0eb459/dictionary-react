/**
 * React context for a history of selected entries.
 */
import { createContext, useContext, useReducer } from 'react';

import { Entry } from './dictionary';

const HistoryContext = createContext<Entry[]>([]);

const HistoryDispatchContext = createContext<Function>(() => {});

export function useHistory() {
    return useContext(HistoryContext);
}

export function useHistoryDispatch() {
  return useContext(HistoryDispatchContext);
}

/**
 * Reducer updater.
 *
 * Implements simple list functions like add, remove, pop.
 */
function reducer(entries: Entry[], action: any): Entry[] {
    switch(action.type) {
        case "add":
            return [
                action.entry,
                ...entries.filter((e) => e !== action.entry).slice(0, 5)
            ];
        case "remove":
            return entries.filter((e) => e !== action.entry);
        case "pop":
            return entries.slice(1);
        default:
            return entries;
    }
}

export function HistoryProvider({ children }: { children: any }) {
    const [entries, dispatch] = useReducer(reducer, []);

    return (
        <HistoryContext.Provider value={ entries }>
            <HistoryDispatchContext.Provider value={ dispatch }>
                {children}
            </HistoryDispatchContext.Provider>
        </HistoryContext.Provider>
    );
}
