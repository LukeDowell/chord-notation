import React from 'react'
import styled from "@emotion/styled";
import {Note} from "../music/Note";
import _ from "lodash";
import { ReactComponent as WholeNoteSvg } from '../images/whole-note.svg'

export interface Props {
  cleff?: 'treble' | 'bass',
  notes?: Note[]
}

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  border: "1px solid black",
  borderBottom: 'none',
  borderTop: 'none',
  width: '100%',
  height: '100%'
})

const WhiteBar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const WholeNote = styled(WholeNoteSvg)({
  zIndex: 2
})

export const Measure = ({
                          cleff = 'treble',
                          notes = []
                        }: Props) => {
  const noteComponents = notes.map((n) => {
    return [n, ]
  })
  const groupedNotes = _.groupBy(notes,(n) => n?.root)

  return <StyledRoot>
    <BlackLine>
    </BlackLine>
    <WhiteBar>
    </WhiteBar>

    <BlackLine>
    </BlackLine>
    <WhiteBar>
    </WhiteBar>

    <BlackLine>
    </BlackLine>
    <WhiteBar>
    </WhiteBar>

    <BlackLine>
    </BlackLine>
    <WhiteBar>
    </WhiteBar>

    <BlackLine>
    </BlackLine>
  </StyledRoot>
}
