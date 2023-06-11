import React from 'react';
import { render, screen } from '@testing-library/react';

import { Dictionary } from './dictionary';
import { App } from './App';

const mockDict: Dictionary = Dictionary.load({
    "e": [
        {
            "w": "Alpha",
            "p": "s",
            "d": [
                { "m": "One", "s": "foo", "t": "bar", "n": "baz" }
            ],
            "v": [],
            "s": []
        },
        {
            "w": "Apple",
            "p": "s",
            "d": [
                { "m": "Two", "s": null, "t": null, "n": null },
            ],
            "v": [],
            "s": []
        },
        {
            "w": "Bravo",
            "p": "s",
            "d": [
                { "m": "Three", "s": null, "t": null, "n": null }
            ],
            "v": [],
            "s": []
        },
    ]
});

test('App renders', () => {
    render(<App dictionary={ mockDict } />);

    expect(screen.queryByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).toBeInTheDocument();
});
