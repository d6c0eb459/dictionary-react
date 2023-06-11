import React from 'react';
import { render, screen } from '@testing-library/react';

import { Entry } from './dictionary';
import Card from './Card';

test('Card renders', () => {
    const entry: Entry = {
        "word": "alpha",
        "partOfSpeech": "bar",
        "definitions": [
            { "meaning": "apple", "note": "fruit", example: null }
        ],
        variants: [],
        seeAlso: []
    };

    render(<Card entry={ entry } />);
    expect(screen.queryByText(entry.word)).toBeInTheDocument();
});
