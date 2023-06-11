import PrefixTree from './prefix-tree'; 

export interface Example {
    original: string,
    translation: string,
}

export interface Definition {
    meaning: string,
    note: string,
    example: Example | null,
}

export interface Entry {
    word: string,
    partOfSpeech: string,
    definitions: Definition[],
    variants: string[],
    seeAlso: string[],
}

export interface Example {
    original: string,
    translation: string,
}

export interface DictionaryShorthand {
    e: EntryShorthand[],
}

interface DefinitionShorthand {
    m: string,
    n: string | null,
    s: string | null,
    t: string | null,
}

interface EntryShorthand {
    w: string,
    v: string[],
    s: string[],
    p: string,
    d: DefinitionShorthand[],
}

export class Dictionary {
    entries: Entry[];
    prefixTree: PrefixTree;

    constructor(entries: Entry[]) {
        this.entries = entries

        this.prefixTree = new PrefixTree();
        for(let entry of this.entries) {
            this.prefixTree.add(entry.word, entry);
        }
    }

    public autocomplete(term: string): Entry[] {
        return this.prefixTree.getAllStartingWith(term);
    }

    public get(term: string): Entry | null {
        return this.prefixTree.get(term);
    }

    static loadStrict(dict : DictionaryShorthand): Dictionary {
        return this.load(dict);
    }

    static load(dict : any): Dictionary {
        const entries = dict.e.map((e : EntryShorthand) : Entry => {
            return {
            "word": e.w,
            "partOfSpeech": e.p,
            "variants": e.v,
            "seeAlso": e.s,
            "definitions": e.d.map((d : DefinitionShorthand) : Definition => {
                return {
                    "meaning": d.m,
                    "note": d.n != null ? d.n : "",
                    "example": (d.s != null && d.t != null) ? { 
                        "original": d.s, 
                        "translation": d.t 
                    } : null
                };
            })
            }
        })

        return new Dictionary(entries);
    }
}

