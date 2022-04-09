import React from 'react'
import {render, screen} from "@testing-library/react";
import {Measure} from "./Measure";
import {toNote} from "../music/Note";


describe('a measure', () => {
  it('should render notes', () => {
    const notes = ['C4', 'E4', 'G4'].map(toNote)

    render(<Measure notes={notes} />)

    expect(screen.getByTestId('c4-note')).toBeInTheDocument()
    expect(screen.getByTestId('e4-note')).toBeInTheDocument()
    expect(screen.getByTestId('g4-note')).toBeInTheDocument()
  })
})
