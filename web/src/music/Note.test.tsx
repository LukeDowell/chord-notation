import {FLAT, lowerNote, Note, SHARP, sortNotes, standardizeNote, toNote} from "./Note";

describe('Musical Notes', () => {
  test.each([
    ["A0", 'C#3'],
    ["G#1", 'G#7'],
    ["E4", 'F4'],
    ["C1", 'C2'],
    ["C1", 'C1'],
  ])(
    `%s should be lower than %s`,
    (lower: string, higher: string) => expect(lowerNote(toNote(lower), toNote(higher))).toEqual(toNote(lower))
  )

  test.each([
    [["C3", "C2"], ["C2", "C3"]],
    [["F#5", "G#4", "G6"], ["G#4", "F#5", "G6"]],
    [["G4", "C4", "A#4"], ["A#4", "C4", "G4"]],
    [["G4", "C4", "A#4", "A4"], ["A4", "A#4", "C4", "G4"]],
  ])(
    `%s should be sorted to %s`,
    (unsorted: string[], expected: string[]) => {
      const unsortedNotes = unsorted.map(toNote)
      const expectedNotes = expected.map(toNote)
      expect(sortNotes(unsortedNotes)).toEqual(expectedNotes)
    }
  )

  test.each([
    ["F\u266d", "E"],
    ["C\u266d", "B"],
    ["C#", "C#"],
    ["D\u266d", "C#"],
  ])(
    `%s should be standardized to %s`,
    (unstandard, standard) => expect(standardizeNote(toNote(unstandard))).toEqual(toNote(standard))
  )

  test.each([
    ["C2", {root: "C", octave: 2} as Note],
    ["C\u266d2", {root: "C", octave: 2, accidental: FLAT} as Note],
    ["F#5", {root: "F", octave: 5, accidental: SHARP} as Note],
  ])(
    `%s should be parsed to %s`,
    (input: string, expectedNote: Note) => expect(toNote(input)).toEqual(expectedNote)
  )

  test.each([
    [""],
    ["        "],
    ["C\u266d2, G2, C#"],
    ["F#53"],
  ])(
    `%s should be unable to be parsed`,
    (input: string) => expect(() => toNote(input)).toThrow()
  )
})
