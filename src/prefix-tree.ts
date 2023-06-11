/**
 * A prefix tree or trie for fast text lookup.
 */

/**
 * Represents a single node in the prefix tree.
 */
class TreeNode {
    entry: null | any;
    children: Map<string, TreeNode>;

    constructor() {
        this.entry = null;
        this.children = new Map<string, TreeNode>();
    }
}

/**
 * Represents the prefix tree.
 */
export default class PrefixTree {
    head: TreeNode;

    constructor() {
        this.head = new TreeNode();
    }

    /**
     * Returns the node at the given key path, if it exists.
     */
    private _getNode(key: string): TreeNode | null {
        let node: TreeNode = this.head;

        for(let c of key) {
            let next = node.children.get(c);
            if(next === undefined) {
                return null;
            }

            node = next;
        }

        return node;
    }
    
    /**
     * Associates a piece of data with the given string.
     */
    public add(key: string, data: null | any) {
        if(key.length < 1) {
            return;
        }

        let node: TreeNode = this.head;

        for(let c of key) {
            let next = node.children.get(c);
            if(next === undefined) {
                next = new TreeNode();
                node.children.set(c, next);
            }

            node = next;
        }

        node.entry = data;
    }

    /**
     * Get the entry at the exact given key, if it exists.
     */
    public get(key: string): null | any {
        const node: TreeNode | null = this._getNode(key);
        if(node == null) {
            return null;
        }

        return node.entry;
    }

    /**
     * Fetches all pieces of data whose respective keys begin with the given prefix.
     */
    public getAllStartingWith(prefix: string): any[] {
        let output: any[] = [];

        const root: TreeNode | null = this._getNode(prefix);
        if(root == null) {
            return output;
        }

        // breadth first search
        let stack: TreeNode[] = [root];
        let cursor: TreeNode | undefined;
        while(true) {
            cursor = stack.shift();
            if(cursor === undefined) {
                break;
            }

            if(cursor.entry != null) {
                output.push(cursor.entry);
            }

            for (const c of Array.from(cursor.children.keys()).sort()) {
                let node = cursor.children.get(c);
                if(node !== undefined) { // redundant check for typescript
                    stack.push(node);
                }
            }
        }

        return output;
    }
}
