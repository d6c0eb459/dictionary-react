import { useDictionary } from './DictionaryContext';
import { useHistoryDispatch } from './HistoryContext';
import { Definition, Entry } from './dictionary';

const joinWithSpace = (arr: any[]) => arr.reduce(
    (acc: any, e: any) => {
        return acc == null ? [ e ] : [ acc, ' ' , e ]
    },
    null
);


function AugmentedText({ text, current }: { text: string, current: string }) {
    const dictionary = useDictionary();
    const historyDispatch = useHistoryDispatch()

    const parts = text.split(" ").map((word, i) => {
        const key = word.endsWith(",") ? word.slice(0, -1) : word;

        if(key === current) {
            return <span key={ i }>{ word }</span>
        }

        const entry = dictionary.get(key);
        if(entry != null) {
            return (
                <span key={ i } className="clickable" onClick={ () => {
                    historyDispatch({ "type": "add", "entry": entry });
                }}>
                    { word }
                </span>
            )
        }

        return <span key={ i }>{ word }</span>
    });

    return (
        <>
            { joinWithSpace(parts) }
        </>
    )
}

export default function Card({ entry }: { entry: Entry } ) {
    const dictionary = useDictionary();
    const historyDispatch = useHistoryDispatch()

    const defs = entry.definitions.map((def: Definition, i: number) => {
        const example = (def.example != null && (
            <div className="flex left gap start secondary">
                <span className="material-icons">
                    format_quote
                </span>
                <div>
                    <b><AugmentedText text={ def.example.original } current={ entry.word }/></b>
                    &nbsp;
                    { def.example.translation }
                </div>
            </div>
        ));

        return (
            <div className="flex left gap start" key={ i }>
                <div>{ i + 1 }.</div>
                <div>
                    <AugmentedText text={ def.meaning } current=""/>
                    { 
                        (def.note != null && def.note.length > 0) && <span>&nbsp;<i>({ def.note })</i></span>
                    }
                    { example }
                </div>
            </div>
        )
    });

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
