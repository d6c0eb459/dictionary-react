import React from 'react';

import { useHistory, useHistoryDispatch } from './HistoryContext';
import { useDictionary } from './DictionaryContext';

import { Entry } from './dictionary';

function Suggestion({ entry, isHistory, onClick }: { entry: Entry, isHistory: boolean, onClick: Function }) {
    const historyDispatch = useHistoryDispatch();
    return (
        <div className="hoverable flex between gap-smaller">
            <span className="material-icons">{ isHistory ? "history" : "search" }</span>
            <span className="flex-basis-max ellipsis" onClick={ () => onClick() }>
                { entry.word }
                &nbsp; <i>{ entry.definitions[0].meaning } </i>
            </span>
            { isHistory && 
                <span
                    className="material-icons"
                    onClick={ () => historyDispatch({
                        "type": "remove",
                        "entry": entry
                    })}
                >
                    close
                </span>
            }
        </div>
    )
}

export default function Search() {
    const dictionary = useDictionary();
    const history = useHistory();
    const historyDispatch = useHistoryDispatch();

    const [searchText, setSearchText] = React.useState<string>('');
    const [isActive, setIsActive] = React.useState<boolean>(true);
    const [results, setResults] = React.useState<Entry[]>(
        dictionary.autocomplete(searchText)
    );

    function updateSearchText(text: string) {
        setSearchText(text);
        setResults(dictionary.autocomplete(text));
        setIsActive(true);
    }
    
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        updateSearchText(e.target.value.toLowerCase());
    }

    function doSelect(entry: Entry) {
        if(historyDispatch != null) {
            historyDispatch({ "type": "add", "entry": entry });
        }
        setSearchText(entry.word);
        setResults([]);
        setIsActive(false);
    }

    function doSearch() {
        let candidates = results;
        if(!isActive) {
            candidates = dictionary.autocomplete(searchText);
        }

        if(candidates.length > 0) {
            doSelect(candidates[0]);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        if(e.key === "Enter") {
            doSearch();
        }
    }

    
    let selectedHistory : Entry[] = [];
    let candidates : Entry[] = [];
    if(isActive) {
        selectedHistory = history.slice(0, 3);
        candidates = [];
        for(let result of results) {
            if(!selectedHistory.includes(result)) {
                candidates.push(result);
                if(candidates.length >= 10) {
                    break;
                }
            }
        }
    }

    return (
        <div className="rounded-less border padded padded-vertical-less primary">
            <div className="flex">
                <input 
                    value={ searchText }
                    onClick={ () => setIsActive(true) }
                    onChange={ onChange }
                    onKeyUp={ onKeyDown }
                    placeholder="Search"
                    className="flex-basis-max secondary"
                />
                { searchText.length > 0 && 
                    <>
                    <span
                        className="material-icons"
                        onClick={ () => updateSearchText('') }
                    >close</span>
                    <span className="spacer"></span>
                    </>
                }
                <span className="material-icons" onClick={ doSearch }>search</span>
            </div>
            { isActive && <hr className="primary"/> }
            <div className="flex-vertical">
                { selectedHistory.map((e) => {
                    return <Suggestion 
                        entry={ e }
                        isHistory={ true } 
                        key={ e.word }
                        onClick={ () => { doSelect(e); } }
                    />
                })}
                { candidates.map((e) => {
                    return <Suggestion 
                        entry={ e }
                        isHistory={ false } 
                        key={ e.word }
                        onClick={ () => { doSelect(e); } }
                    />
                })}
            </div>
        </div>
    )
}
