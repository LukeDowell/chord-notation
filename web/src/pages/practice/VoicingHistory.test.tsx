import * as React from 'react'
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {render, screen} from "@testing-library/react";
import {toNote} from "../../music/Note";
import {toChord} from "../../music/Chord";

describe('the voicing history component', () => {
  it('should render a voicing', async () => {
    const validNotes = ["C2", "Eb2", "G2"].map(toNote)
    const voicingResults: VoicingResult[] = [
      {
        chord: {root: "C", quality: "Minor"},
        validNotes
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, Eb, G/)
    expect(expected).toBeInTheDocument()
  })

  it('should render the required notes for a voicing if none are provided', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: toChord("B#dim")!!,
        validNotes: []
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, D#, F#/)
    expect(expected).toBeInTheDocument()
  })

  it('should render the required notes for a seventh voicing if none are provided', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: toChord("DbM7")!!,
        validNotes: []
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/Db, F, Ab, C/)
    expect(expected).toBeInTheDocument()
  })
})
