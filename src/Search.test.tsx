/**
 * Tests for the Search component.
 */
import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { DictionaryProvider } from './DictionaryContext';
import { Dictionary } from './dictionary';
import Search from './Search';

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

test('Search input updates', async () => {
    render(
        <DictionaryProvider dictionary={ mockDict }>
            <Search />
        </DictionaryProvider>
    );

    const ele = screen.getByPlaceholderText("Search");
    await act(async () => {
        await userEvent.type(ele, 'testing');
    });
    expect(ele).toHaveValue("testing");
});

test('Search returns all matches', async () => {
    render(
        <DictionaryProvider dictionary={ mockDict }>
            <Search />
        </DictionaryProvider>
    );

    const ele = screen.getByPlaceholderText("Search");

    await act(async () => {
        await userEvent.type(ele, 'A');
    });

    expect(screen.queryByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();
});

test('Search shows preview', async () => {
    render(
        <DictionaryProvider dictionary={ mockDict }>
            <Search />
        </DictionaryProvider>
    );

    const ele = screen.getByPlaceholderText("Search");

    await act(async () => {
        await userEvent.type(ele, 'A');
    });

    expect(screen.queryByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("One")).toBeInTheDocument();

    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();
    expect(screen.queryByText("Three")).not.toBeInTheDocument();
});

test('Search returns exact match', async () => {
    render(
        <DictionaryProvider dictionary={ mockDict }>
            <Search />
        </DictionaryProvider>
    );

    const ele = screen.getByPlaceholderText("Search");

    await act(async () => {
        await userEvent.type(ele, 'Alpha');
    });

    expect(screen.queryByText("Alpha")).toBeInTheDocument();

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();
});

test('Search hides substring match', async () => {
    render(
        <DictionaryProvider dictionary={ mockDict }>
            <Search />
        </DictionaryProvider>
    );

    const ele = screen.getByPlaceholderText("Search");

    await act(async () => {
        await userEvent.type(ele, 'Alphaz');
    });

    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("One")).not.toBeInTheDocument();
});
