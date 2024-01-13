/**
 * Data definitions for the dictionary.
 */
import PrefixTree from './prefix-tree'; 

/**
 * A word used in context.
 *
 * @param original      A sentence in the original language.
 * @param translation   The same sentence translated to the target language.
 */
export interface Example {
    original: string,
    translation: string,
}

/**
 * A definition for a word.
 *
 * @param meaning     The meaning of the word in the target language.
 * @param note        (optional) A note to clarify the meaning.
 * @param example     (optional) An example usage of the word in context.
 */
export interface Definition {
    meaning: string,
    note: string | null,
    example: Example | null,
}

/**
 * A word along with a collection of definitions, variants, and more.
 *
 * @param word          The word in question.
 * @param partOfSpeech  A part of speech tag, ex. "v".
 * @param example     An example usage of the word in context.
 */
export interface Entry {
    word: string,
    partOfSpeech: string,
    definitions: Definition[],
    variants: string[],
    seeAlso: string[],
}

/**
 * A list of short hand entries.
 */
export interface DictionaryShorthand {
    e: EntryShorthand[],
}

/**
 * A short form for Definition that allows for a smaller JSON data file.
 */
interface DefinitionShorthand {
    m: string,
    n: string | null,
    s: string | null,
    t: string | null,
}

/**
 * A short form for Entry that allows for a smaller JSON data file.
 */
interface EntryShorthand {
    w: string,
    v: string[],
    s: string[],
    p: string,
    d: DefinitionShorthand[],
}

/**
 * A collection of words and meanings.
 */
export class Dictionary {
    entries: Entry[];
    prefixTree: PrefixTree;

    /**
     * Constructor.
     *
     * To load from a JSON file use the load() function.
     */
    constructor(entries: Entry[]) {
        this.entries = entries

        // Build a prefix tree for fast search.
        this.prefixTree = new PrefixTree();
        for(let entry of this.entries) {
            this.prefixTree.add(entry.word.toLowerCase(), entry);
        }
    }

    /**
     * Returns all entries that start with the given term.
     *
     * @param term The search term.
     */
    public autocomplete(term: string): Entry[] {
        return this.prefixTree.getAllStartingWith(term);
    }

    /**
     * Returns a single entry exactly matching the given term.
     *
     * @param term The search term.
     */
    public get(term: string): Entry | null {
        return this.prefixTree.get(term);
    }

    /**
     * Load from a DictionaryShorthand object.
     */
    static loadStrict(dict : DictionaryShorthand): Dictionary {
        return this.load(dict);
    }

    /**
     * Load from any object.
     */
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

