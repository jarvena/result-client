import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import resultService from './services/results'

import { Autocomplete, TextField } from '@mui/material'
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper } from '@mui/material'

const seconds2time = (secondsOfDay) => {
  const hours = `${Math.floor(secondsOfDay / 60 / 60)}`.padStart(2, '0')
  const minutes = `${Math.floor(secondsOfDay / 60 % 60)}`.padStart(2, '0')
  const seconds = `${Math.floor(secondsOfDay % 60)}`.padStart(2, '0')
  return `${hours}:${minutes}`
}

const parseClubResults = (clubId, competitors, results, eventData) => {
  const clubCompetitors = competitors.filter(competitor => competitor.clubId === clubId)
  console.log('clubCompetitors',clubCompetitors)
  const flatResults =  results.flatMap(competitionClass =>
    competitionClass.Results.map((results, index) => ({
      ...competitionClass,
      Results: results,
      Splits: competitionClass.Splits[index]
    }))
  );
  const clubCompetitorIds = clubCompetitors.map(competitor => competitor.id)
  const clubResults = flatResults.filter(result => clubCompetitorIds.includes(result.Results[0]))
  console.log('clubResults',clubResults)
  return clubResults.map(result => ({
    className: eventData.Classes[result.ClassID].ClassNameLong,
    name: clubCompetitors.find(competitor => competitor.id === result.Results[0]).namefirst + ' ' + clubCompetitors.find(competitor => competitor.id === result.Results[0]).namelast,
    startTime: seconds2time(result.Results[5]),
    status: result.Results[2] === 'OK' ?parseLastSplit(result, eventData) : result.Results[2],
  }))
}
const parseLastSplit = (result, eventData) => {
  const timingData = result.Results[8]
  const latestSplitIndex = timingData.map((split, index) => [split[1], index]).reduce((prev, current) => (prev[0] > current[0] ? prev : current), [0, 0])[1]
  const startTime = result.Results[5]
  const latestSplitTime = timingData[latestSplitIndex][1]
  const classSplits = eventData.Classes[result.ClassID].Races[0].TimingPoints
  return(`${seconds2time(startTime+latestSplitTime)}, ${classSplits[latestSplitIndex].DistanceMeters/1000} / ${classSplits.find(s => s.TimingMethod === 'Finish line').DistanceMeters/1000} km`)
}

function App() {
  const [count, setCount] = useState(0)
  const [eventSelection, setEventSelection] = useState(undefined)
  const [eventsList, setEventsList] = useState([])
  const [clubs, setClubs] = useState([])
  const [competitors, setCompetitors] = useState([])
  const [clubSelection, setClubSelection] = useState(undefined)
  const [clubInput, setClubInput] = useState(null)
  const [resultData, setResultData] = useState([])
  const [eventData, setEventData] = useState([])

  useEffect(() => {
    resultService.getEvents()
      .then((response) => {
        console.log('Events', response.data)
        setEventsList(response.data.data)
      })
  }, [])

  useEffect(() => {
    if (eventSelection !== undefined) {
      resultService.getCompetitors(eventSelection)
        .then((response) => {
          console.log('Competitors', response.data)
          setClubs(response.data.Clubs.map(club => {return ({'id': club[0], 'name': club[1]})}) )
          setCompetitors(response.data.Competitors.map(competitor => {return ({'id': competitor[0], 'clubId': competitor[1], 'namefirst': competitor[7], 'namelast': competitor[8]})}) )})
    }
  }, [eventSelection])

  useEffect(() => {
    if (eventSelection !== undefined) {
      resultService.getResults(eventSelection)
        .then((response) => {
          console.log('Results', response.data)
          setResultData(response.data.Results)
        })
    }
  }, [eventSelection])

  useEffect(() => {
    if (eventSelection !== undefined) {
      resultService.getEvent(eventSelection)
        .then((response) => {
          console.log('Event', response.data)
          setEventData(response.data)
        })
    }
  }, [eventSelection])

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
      <h1 style={{textAlign: 'center'}}>Seurakuvaajan tulospalvelu</h1>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center'}}>
        <Autocomplete
          disablePortal
          id="event-select"
          options={Array.from(new Set(eventsList.map(event => event.EventTitle)))}
          sx={{ width: 300 }}
          onChange={(event, value) => {
            setEventSelection(eventsList.find(event => event.EventTitle === value)?.EventID)
            setClubSelection(undefined)
            setClubInput(null) // clear the club-select value
          }}
          renderInput={(params) => <TextField {...params} label="Event" />}
        />
        <Autocomplete
          disabled={eventSelection === undefined}
          disablePortal
          id="club-select"
          options={clubs.map(club => club.name)}
          sx={{ width: 300 }}
          value={clubInput}
          onChange={(event, value) => (setClubInput(value), setClubSelection(clubs.find(club => club.name === value)?.id))}
          noOptionsText={eventSelection === undefined ? "Select the event first" : "No clubs found in this event"}
          renderInput={(params) => <TextField {...params} label="Club" />}
        />
      </div>
      {clubSelection !== undefined && (
        <TableContainer component={Paper} style={{marginTop: '1rem'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Start time</TableCell>
                <TableCell>Last split</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parseClubResults(clubSelection, competitors, resultData, eventData).map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.className}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </div>
    </>
  )
}

export default App

