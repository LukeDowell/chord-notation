import {FLAT, genericInterval, layNotesOnKeyboard, Note, SHARP, sortNotes, standardizeNote, toNote} from "./Note";

describe('Musical Notes', () => {
  test.each([
    ["A0", 'C#3'],
    ["G#1", 'G#7'],
    ["E4", 'F4'],
    ["C1", 'C2'],
    ["C1", 'C1'],
    ['D#4', 'E4'],
    ['C#4', 'D#4'],
    ['B3', 'C#4'],
    ['C3', 'A3']
  ])(
    `%s should be lower than %s`,
    (lower: string, higher: string) => expect(toNote(lower).isLowerThan(toNote(higher))).toBeTruthy()
  )

  test.each([
    [["C4", "C4"], 1],
    [["C4", "D4"], 2],
    [["C4", "E4"], 3],
    [["C4", "B4"], 7],
    [["D4", "D5"], 8],
    [["D4", "F5"], 10],
    [["C4", "F5"], 11],
  ])(
    `%s should have a generic interval of %d`,
    (noteStrings: string[], interval: number) => {
      const notes = noteStrings.map(toNote)
      expect(genericInterval(notes[0], notes[1])).toEqual(interval)
    }
  )

  it('should throw an error when trying to compare two notes without an octave', () => {
    expect(() => {
      genericInterval(toNote('C'), toNote('G'))
    }).toThrow()
  })

  test.each([
    [["C3", "C2"], ["C2", "C3"]],
    [["F#5", "G#4", "G6"], ["G#4", "F#5", "G6"]],
    [["G4", "C4", "A#4"], ["C4", "G4", "A#4"]],
    [["G4", "C4", "A#4", "A4"], ["C4",  "G4", "A4", "A#4"]],
    [['B3', 'C#4', 'D#4', 'E4'], ['B3', 'C#4', 'D#4', 'E4']]
  ])(
    `%s should be sorted to %s`,
    (unsorted: string[], expected: string[]) => {
      const unsortedNotes = unsorted.map(toNote)
      const expectedNotes = expected.map(toNote)
      expect(sortNotes(unsortedNotes)).toEqual(expectedNotes)
    }
  )

  test.each([
    ["Fb", "E"],
    ["Cb", "B"],
    ["C#", "C#"],
    ["Db", "C#"],
  ])(
    `%s should be standardized to %s`,
    (unstandard, standard) => expect(standardizeNote(toNote(unstandard))).toEqual(toNote(standard))
  )

  test.each([
    ["C2", new Note("C", undefined, 2)],
    ["Cb2", new Note("C", FLAT, 2)],
    ["F#5", new Note("F", SHARP, 5)],
  ])(
    `%s should be parsed to %s`,
    (input: string, expectedNote: Note) => expect(toNote(input)).toEqual(expectedNote)
  )

  test.each([
    [""],
    ["        "],
    ["Cb2, G2, C#"],
    ["F#53"],
  ])(
    `%s should be unable to be parsed`,
    (input: string) => expect(() => toNote(input)).toThrow()
  )

  test.each([
    [['Db', 'F', 'Ab', 'C'], ['Db4', 'F4', 'Ab4', 'C5']]
  ])(
    `%s should be placed on an octave to match %s`,
    (input: string[], expected: string[]) => {
      const result = layNotesOnKeyboard(input.map(toNote), 4)
      expect(result).toEqual(expected.map(toNote))
    }
  )
})
