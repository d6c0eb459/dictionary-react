import PrefixTree from './prefix-tree';

test('prefix tree returns results in order', () => {
    const tree = new PrefixTree();
    tree.add("aa", 1);
    tree.add("aab", 2);
    tree.add("aac", 3);
    tree.add("aaba", 4);
    tree.add("aabc", 5);

    tree.add("a", -1);
    tree.add("ab", -2);
    tree.add("foo", -3);

    expect(tree.getAllStartingWith("aa")).toStrictEqual([1, 2, 3, 4, 5]);
});
