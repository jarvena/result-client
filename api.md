# Documentation of the result service api

## Events
[Example](https://online4.tulospalvelu.fi/tulokset-new/online/online_events_dt.json)

- data: Array, events in time order
    - EventID: Text, event identifier in the result URL
    - EventTitle: Text, event name

## Event
[Example](https://online4.tulospalvelu.fi/tulokset-new/online/online_2024_esijukola_h_event.json)

- Classes, Array, list of competition classes
    - ClassNameLong: Text
    - ClassNameShort: Text
    - ID: Number
- Districts, Array, list of regions

## Competitors
[Example](https://online4.tulospalvelu.fi/tulokset-new/online/online_2024_esijukola_h_competitors.json)


- Clubs: Array, list of represented clubs in random (registration?) order
    1. Club identifier: Number
    2. Club name: Text
    3. Club abbr: Text, club name in short format
    4. District id: Number, identifyer specifying the club region
- Competitors: Array, list of participant information
    1. Id: Number
    2. Club identifier: Number, links to club
    3. Nationality: Text, nationality in short format
    4. Bib, Bumber
    5. ?, Number
    6. Emit, Number
    7. ?, Text
    8. Lastname, Text
    9. Firstname, Text
    10. ?, Text

## Competitor
[Example](https://online4.tulospalvelu.fi/tulokset-new/online/online_2024_esijukola_h_competitor.json?BaseBib=101)

- BaseBib: Number
- ClubNameLong: Text
- Name: Text, full name
- Nationality: Text, nationality in short format
- Races: Array, details per start
    - Bib: Number
    - ClassID: Number
    - ClassNameLong: Text
    - ClassNameShort: Text
    - RaceNo: Number, race identifier for multi-day events used in URL
    - Results: Array, results and intermediate times
        - Point: Number, intermediate identifier
        - km: Text, distance label
    - Splits: Array, punching details
        - ControlNumber
        - ControlCode
        - SplitTime
    - StartTime: Text

## Results
[Example](https://online4.tulospalvelu.fi/tulokset-new/online/online_2024_esijukola_h_results.json)

- Results: Array, results per class
    - ClassID: Number, connects to event information
    - Results: Array, results per participant
        1. CompetitorId: Number, links to competitor data
        2. ?: Number
        3. Status: Text, "OK"/"DNF"/"DNS"
        4. ?: None
        5. ?: Array
        6. Start time: Number, in seconds-of-the-day
        9. Splits: Array, split time data
            1. Split id: Number
            2. Split time: Number, in seconds?
            3. Split time: Number, in seconds, maybe for total times?
        10. Bib: Number, connects to competitor information
