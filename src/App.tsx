import React from 'react';

import Card from './Card';
import Search from './Search';
import { HistoryProvider, useHistory, useHistoryDispatch } from './HistoryContext';
import { DictionaryProvider } from './DictionaryContext';

import { Dictionary, Entry } from './dictionary';

import data from './data/nah-en.json';
const DICTIONARY: Dictionary = Dictionary.loadStrict(data);

/**
 * A component that displays recently selected cards.
 */
function History() {
    const entries: Entry[] = useHistory();

    // Just display the most recent card, if any.
    return (
        <>
            { entries.length > 0 && <Card entry={ entries[0] } /> }
        </>
    )
}

/**
 * A component that displays the left menu.
 */
function Menu() {
    const history = useHistory();
    const dispatch = useHistoryDispatch();
    return (
        <>
            <span className="logo material-icons">menu_book</span>
            { history.length > 0 && 
                <span 
                    className="material-icons"
                    onClick={ () => dispatch({"type": "pop"}) }
                >undo</span>
            }
        </>
    );
}

/**
 * The application.
 *
 * @param dictionary The dictionary to display.
 */
export function App({ dictionary }: { dictionary: Dictionary }) {
    return (
        <DictionaryProvider dictionary={ dictionary }>
        <HistoryProvider>
            <div className="app flex left start padded-less">
                <div className="menu secondary">
                    <Menu />
                </div>
                <div className="content relative">
                    <div className="cards">
                        <div className="scroller">
                            <History />
                        </div>
                    </div>
                    <div className="search flex-basis-max">
                        <Search />
                    </div>
                </div>
            </div>
        </HistoryProvider>
        </DictionaryProvider>
    );
}

export default function Main() {
    return <App dictionary={ DICTIONARY }/>
}
