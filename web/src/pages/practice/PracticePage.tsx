import React, {useCallback, useEffect, useState} from 'react';
import MIDIPiano from "../../music/MIDIPiano";
import styled from "@emotion/styled";
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "../../utility";
import {Close as CloseIcon, Settings as SettingsIcon} from "@mui/icons-material";
import {PracticeSettings} from "./PracticeSettings";
import flashchordsLogo from '../../images/icon.svg'
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "./Settings";
import {LinearProgress} from "@mui/material";
import {
  Chord,
  ChordQuality,
  toSymbol,
  generateRandomChord,
  isValidVoicing,
  SeventhQuality
} from "../../music/Chord";
import {Accidental, FLAT, Note, Root, SHARP} from "../../music/Note";
import _ from "lodash";
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {Measure} from "../../components/measure/Measure";

export interface Props {
  piano: MIDIPiano,
  initialChord?: Chord,
  initialSettings?: Partial<Settings>
}

export const generateChordFromSettings = (settings: Settings) => {
  const roots = ["A", "B", "C", "D", "E", "F", "G"] as Root[]
  const qualities: Array<ChordQuality> = []
  const accidentals: Array<Accidental> = []
  const addedThirds: Array<SeventhQuality> = []

  if (!settings.majorEnabled && !settings.minorEnabled) {
    qualities.push("Major")
  } else {
    if (settings.minorEnabled) qualities.push("Minor")
    if (settings.majorEnabled) qualities.push("Major")
  }

  if (settings.flatRootsEnabled) accidentals.push(FLAT)
  if (settings.sharpRootsEnabled) accidentals.push(SHARP)

  if (settings.seventhsEnabled) {
    if (settings.minorEnabled) addedThirds.push("Minor")
    if (settings.majorEnabled) addedThirds.push("Major")
  }

  if (settings.augmentedEnabled) qualities.push("Augmented")
  if (settings.diminishedEnabled) qualities.push("Diminished")

  return generateRandomChord(roots, qualities, accidentals, addedThirds)
}

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  ".prompt-header": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between ",
    padding: "0 1rem 0 1rem",
    width: "100%",
    ".logo": {
      width: "4rem",
      height: "4rem",
    },
    ".button": {
      width: "3rem",
      height: "4rem",
      color: "grey"
    }
  },

  ".timer": {
    marginTop: 0,
    width: "50%",
    height: "1vmax",
    marginBottom: "5rem"
  }
})

const ChordSymbolPrompt = styled('div')({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  ".current-chord-symbol": {
    fontSize: "10vmax",
    marginTop: "0",
    marginBottom: "0"
  }
})

export default function PracticePage({
                                       piano,
                                       initialChord = generateRandomChord(),
                                       initialSettings = DEFAULT_PRACTICE_SETTINGS
                                     }: Props) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [timeLastChordEnded, setTimeLastChordEnded] = useState(Date.now())
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timerProgress, setTimerProgress] = useState(100)
  const [settings, setSettings] = useState({...DEFAULT_PRACTICE_SETTINGS, ...initialSettings})
  const [voicingResults, setVoicingResults] = useState<VoicingResult[]>([])
  const [activeNotes, setActiveNotes] = useState<Note[]>([])

  const onCorrectVoicing = useCallback((chord: Chord, notes: Note[]) => {
    setShouldDisplaySuccess(true)
    setTimeLastChordEnded(Date.now())
    setVoicingResults([...voicingResults, {chord, validNotes: notes}])
  }, [voicingResults, currentChord, settings])

  useEffect(() => {
    const callback = (activeNotes: Note[]) => {
      if (!shouldDisplaySuccess) {
        setActiveNotes(activeNotes)
        if (isValidVoicing(currentChord, activeNotes)) {
          onCorrectVoicing(currentChord, activeNotes)
        }
      }
    };
    piano.setListener("PracticePage", callback)
    return () => piano.removeListener("PracticePage")
  }, [currentChord, piano, settings, onCorrectVoicing])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeLastChordEnded <= 1000
    if (!inTimeWindow && shouldDisplaySuccess) {
      setShouldDisplaySuccess(false)
      let newChord = generateChordFromSettings(settings)
      while (_.isEqual(currentChord, newChord)) {
        newChord = generateChordFromSettings(settings)
      }
      setCurrentChord(newChord)
    }
  }, 100)

  useInterval(() => {
    if (!settings?.timerEnabled) return
    const timeLeft = (timeLastChordEnded + (settings.timerSeconds * 1000)) - Date.now()
    if (timeLeft <= 0) {
      setVoicingResults([...voicingResults, {chord: currentChord, validNotes: []}])
      let newChord = generateChordFromSettings(settings)
      while (_.isEqual(currentChord, newChord)) {
        newChord = generateChordFromSettings(settings)
      }
      setCurrentChord(newChord)
      setTimeLastChordEnded(Date.now())
    } else setTimerProgress(Math.floor((timeLeft / (settings.timerSeconds * 1000)) * 100))
  }, 100)

  return <StyledRoot>
    <div className="prompt-header">
      <img src={flashchordsLogo} className="logo" alt="flashchords logo"/>
      {
        (isSettingsOpen
          && <CloseIcon className="button" onClick={() => setIsSettingsOpen(false)}/>
        ) || <SettingsIcon className="button" onClick={() => setIsSettingsOpen(true)}/>
      }
    </div>
    {isSettingsOpen &&
    <PracticeSettings settings={settings} onSettingsUpdate={setSettings}/>
    }
    <ChordSymbolPrompt>
      <h2 className="current-chord-symbol">{toSymbol(currentChord)}</h2>
      {shouldDisplaySuccess &&
      <CheckIcon style={{color: "green"}}/>}
    </ChordSymbolPrompt>
    {settings?.timerEnabled &&
    <LinearProgress className="timer" variant="determinate" value={timerProgress}/>
    }
    <Measure notes={activeNotes}/>
    <VoicingHistory voicingResults={voicingResults}/>
  </StyledRoot>
}
