import React from 'react'
import styled from "@emotion/styled";
import {genericInterval, Note, noteToSymbol, toNote} from "../music/Note";
import {ReactComponent as WholeNoteSvg} from '../images/whole-note.svg'


export interface Props {
  cleff?: 'treble' | 'bass',
  notes?: Note[],
  style?: MeasureStyles
}

export interface MeasureStyles {
  width: number,
  height: number,
}

const StyledRoot = styled('div')<MeasureStyles>(props => ({
  display: 'flex',
  flexDirection: 'column',
  border: "1px solid black",
  borderBottom: '0px solid black',
  borderTop: 'none',
  minWidth: props.width,
  minHeight: props.height,
  position: 'relative'
}))

const WhiteBar = styled('div')({
  height: '25%',
  width: '100%',
  backgroundColor: 'white',
})

const BlackLine = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '1px',
  width: '100%',
  backgroundColor: 'black',
})

interface WholeNoteProps {
  top: string,
  height: string,
  left?: string,
  lineHint?: 'center' | 'bottom' | 'top'
}

const WholeNote = styled(WholeNoteSvg)<WholeNoteProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  width: 'auto',
  height: props?.height || '20px',
  left: props?.left || '50%',
  top: props.top,
  backgroundImage: props.lineHint ? 'linear-gradient(black, black)' : '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '125% 1px',
  backgroundPosition: `-10px ${props.lineHint}`,
}))

export const Measure = ({
                          cleff = 'treble',
                          notes = [],
                          style = {
                            width: 400,
                            height: 80
                          }
                        }: Props) => {

  const noteComponents = notes.map((n, i, a) => {
    const key = `${noteToSymbol(n)}-note`.toLowerCase()
    const cleffBase = toNote(cleff === 'treble' ? 'F5' : 'A3')
    const interval = genericInterval(cleffBase, n)

    // Vertically Position
    let topValue = (interval - 1) * (style.height / 8)
    if (cleffBase.isLowerThan(n)) topValue = -topValue
    const top = `${topValue}px`

    // Horizontally Position
    let left
    const unfilteredNeighbors: Note[] = notes.filter((maybeNeighbor) => genericInterval(maybeNeighbor, n) === 2)
    const neighbors = unfilteredNeighbors.filter((dn) => {
      // Remove neighbors who themselves have two neighbors so that we alternate notes if necessary
      const neighborsNeighbors = notes.filter((mn) => genericInterval(dn, mn) === 2)
      return neighborsNeighbors.length < 2 && unfilteredNeighbors.length === 2
    })

    if (neighbors.length == 2) left = "42.5%"
    else if (neighbors.length == 1 && neighbors[0].isLowerThan(n)) left = "42.5%"

    // Accidental

    // Line Hint
    const topOfStaff = toNote(cleff === 'treble' ? 'F5' : 'A3')
    const bottomOfStaff = toNote(cleff === 'treble' ? 'E4' : 'A0')
    let lineHint: 'center' | 'bottom' | 'top' | undefined
    if (n.isLowerThan(bottomOfStaff)) {
      lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'bottom' : 'center'
    } else if (topOfStaff.isLowerThan(n)) {
      lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'top' : 'center'
    }

    return <WholeNote data-testid={key} key={key}
                      height={`${style?.height / 4}`}
                      top={top}
                      left={left}
                      lineHint={lineHint}
    />
  })

  return <StyledRoot width={style.width} height={style.height}>
    {noteComponents}
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
  </StyledRoot>
}
