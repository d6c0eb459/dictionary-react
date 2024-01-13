import { useDictionary } from './DictionaryContext';
import { useHistoryDispatch } from './HistoryContext';
import { Definition, Entry } from './dictionary';

/**
 * Returns an array that has a string with a single space inserted in between every
 * member.
 *
 * For example given [a, b, c] this function will return [a, ' ', b, ' ', c].
 *
 * @param arr The array to use.
 */
const joinWithSpace = (arr: any[]) => arr.reduce(
    (acc: any, e: any) => {
        return acc == null ? [ e ] : [ acc, ' ' , e ]
    },
    null
);

/**
 * A component that converts words for which dictionary entries exist into links.
 *
 * @param text      The string to display.
 * @param ignore    A word to ignore.
 */
function AugmentedText({ text, ignore }: { text: string, ignore: string }) {
    const dictionary = useDictionary();
    const historyDispatch = useHistoryDispatch()

    // Split the text into words and map those that have dictionary entries to links,
    // leaving the rest intact.
    const parts = text.split(" ").map((word, i) => {
        const key = word.endsWith(",") ? word.slice(0, -1) : word;

        if(key !== ignore) {
            const entry = dictionary.get(key);
            if(entry != null) {
                // An entry exists, display a link
                return (
                    <span key={ i } className="clickable" onClick={ () => {
                        historyDispatch({ "type": "add", "entry": entry });
                    }}>
                        { word }
                    </span>
                )
            }
        }

        // An entry does not exist, just return the word
        return <span key={ i }>{ word }</span>
    });

    return (
        <>
            { joinWithSpace(parts) }
        </>
    )
}

/**
 * A component to display an entry in the dictionary.
 *
 * @param entry The entry to display.
 */
export default function Card({ entry }: { entry: Entry } ) {
    const dictionary = useDictionary();
    const historyDispatch = useHistoryDispatch()

    // A list of definitions for the word
    const defs = entry.definitions.map((def: Definition, i: number) => {
        // An example usage of the word in a sentence
        const example = (def.example != null && (
            <div className="flex left gap start secondary">
                <span className="material-icons">
                    format_quote
                </span>
                <div>
                    <b><AugmentedText text={ def.example.original } ignore={ entry.word }/></b>
                    &nbsp;
                    { def.example.translation }
                </div>
            </div>
        ));
        
        // A definition composed of a meaning, optional note, and example.
        return (
            <div className="flex left gap start" key={ i }>
                <div>{ i + 1 }.</div>
                <div>
                    <AugmentedText text={ def.meaning } ignore=""/>
                    { 
                        (def.note != null && def.note.length > 0) && <span>&nbsp;<i>({ def.note })</i></span>
                    }
                    { example }
                </div>
            </div>
        )
    });

    // A list of links to other entries
    const seeAlso = entry.seeAlso.map((word: string, i: number) => {
        const entry = dictionary.get(word);
        if(entry == null) {
            return null;
        }

        return (
            <span key={ i } className="clickable" onClick={ () => {
                historyDispatch({ "type": "add", "entry": entry });
            }}>
                <b>{ entry.word }</b>
            </span>
        );
    }).filter((e: any) => e);

    // A list of alternative spellings.
    const variants = entry.variants.join(" ");

    return (
        <div className="card border rounded padded primary shadow">
            <div className="title flex between">
                <div className="large"><b>{ entry.word }</b></div>
                <div><i>{ entry.partOfSpeech }</i></div>
            </div>
            { defs }
            { seeAlso.length > 0 && (
                <div>
                    <i>See also:</i> { joinWithSpace(seeAlso) }
                </div>
            ) }
            { variants.length > 0 && (
                <div>
                    <i>Variants:</i> <b>{ variants }</b>
                </div>
            ) }
        </div>
    )
}
