# Dictionary app

A dictionary app written in React and TypeScript with Jest and ESLint for testing.

## Features

- Base layer of easily testable pure functions (ex. [prefix-tree.ts](src/prefix-tree.ts)).
- [useContext](src/HistoryContext.tsx) to avoid prop drilling.
- [Testable](src/Search.test.tsx) and reusable [components](src/Search.tsx).
- [Composable CSS](src/style.css) similar to Tailwind.

## Screenshots

Home page:

<img src="assets/initial.png" height=300>

Fast text search via a prefix tree (trie):

<img src="assets/search.png" height=300>

Result page:

<img src="assets/result.png" height=300>

Clickable links (ex. <u>tequin</u>) inside result:

<img src="assets/linked.png" height=300>

Editable search history:

<img src="assets/history.png" height=300>

©️ Derek Cheung 2023
