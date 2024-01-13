/**
 * Tests for the prefix tree.
 */
import PrefixTree from './prefix-tree';

describe("prefix tree tests", () => {
    test("Sort results when returning", () => {
        const tree = new PrefixTree();
        // relevant
        tree.add("aa", 1);
        tree.add("aab", 2);
        tree.add("aac", 3);
        tree.add("aaba", 4);
        tree.add("aabc", 5);
    
        // not relevant
        tree.add("a", -1);
        tree.add("ab", -2);
        tree.add("foo", -3);
    
        expect(tree.getAllStartingWith("aa")).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("Handle no matching results", () => {
        const tree = new PrefixTree();
        expect(tree.getAllStartingWith("aa")).toStrictEqual([]);
    });

    test("Handle empty search string", () => {
        const tree = new PrefixTree();
        tree.add("foo", 1);
        tree.add("bar", 2);

        // return in alphabetical order
        expect(tree.getAllStartingWith("")).toStrictEqual([2, 1]);
    });

    test("Return single best matching result", () => {
        const tree = new PrefixTree();
        tree.add("foo", 1);
        tree.add("foobar", 2);
        expect(tree.get("foo")).toStrictEqual(1);
    });

    test("Return null on no exact match", () => {
        const tree = new PrefixTree();
        tree.add("foo", 1);
        tree.add("bar", 2);
        expect(tree.get("f")).toStrictEqual(null);
    });
});
