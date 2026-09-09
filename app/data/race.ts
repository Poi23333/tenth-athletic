export const raceProgramme = [
  ['15:00', 'CHECK-IN OPENS', 'Bib collection / ID verification / bag drop'],
  ['15:40', 'ATHLETE BRIEFING', 'Race rules / course entry points / safety'],
  ['16:00', 'FIELD QUALIFYING', 'One race / all Field Final places decided'],
  [
    '17:00',
    'RECOVERY WINDOW',
    'Finalist recovery / results verification / refuel',
  ],
  ['18:00', 'GRID TT', 'One full Road loop / starting grid positions only'],
  [
    '18:45',
    'COMMUNITY FIELD RELAY',
    'Six runners / two terrains / one team result',
  ],
  [
    '19:30',
    'NIGHT TRANSITION + GRID REVEAL',
    'Lighting / music / Pole Position reveal',
  ],
  ['20:15', 'FIELD FINAL', '12 laps / Road and Trail / final Road sprint'],
  ['21:25', 'AWARDS', 'Relay and Individual podiums / official photography'],
  ['22:00', 'EVENT CLOSE', 'End of programme.'],
] as const;

export const raceSpecifications = [
  ['EVENT CODE', ['FC.001 / LONDON 2026']],
  [
    'COURSE LOGIC',
    [
      'ONE CIRCUIT. TWO TERRAINS.\nA compact competition connecting Road and Trail within one continuously visible circuit.\nEvery athlete completes the same terrain total, while the order in which each terrain is run is determined by the athlete.\nAcross laps 01–11, athletes determine their own Road / Trail sequence.',
      'Every athlete must complete 6 Trail and 5 Road laps before entering the final Road-only lap.',
    ],
  ],
  ['LOCATION', ['LEE VALLEY VELOPARK / EAST LONDON']],
  [
    'TOTAL FIELD',
    [
      '500 ATHLETES',
      'FIELD COMPOSITION',
      'OPEN ENTRY / INVITED ENTRIES / RUN CLUB ALLOCATIONS',
    ],
  ],
  ['COURSE COMPOSITION', ['ROAD / TRAIL']],
  [
    'COURSE SYSTEM',
    [
      'A compact competition system connecting Road and Trail within one continuously visible course.',
      'Every athlete completes the same terrain total, while the order in which each terrain is run is determined by the athlete.',
      'RACE SEQUENCE',
      'OPEN SEQUENCE',
      'Across laps 01–11, athletes determine their own Road / Trail sequence.',
      'Every athlete must complete 6 Trail and 5 Road laps before entering the final Road-only lap.',
      'LAP 12',
      'FINAL ROAD LAP / TRAIL ENTRY CLOSED',
    ],
  ],
  [
    'RACE STRUCTURE',
    [
      'FIELD SESSIONS   FIELD QUALIFYING   GRID TT   FIELD FINAL',
      'PROVISIONAL SESSION LENGTHS',
      'FIELD SESSION 60 MIN / FIELD QUALIFYING 40 MIN / GRID TT 30 MIN / FINAL 60 MIN',
      'GRID TT',
      '1 × 660 M ROAD LOOP\nGrid TT determines the Final starting order only. Times do not carry into the Final.\nFINAL FIELD',
      '48 RUNNERS',
      'FINAL FORMAT',
      '12 LAPS / 6 TRAIL + 6 ROAD / FINAL LAP: ROAD ONLY',
    ],
  ],
  ['RACE CONDITIONS', ['OUTDOOR / DAY TO NIGHT / MIXED TERRAIN']],
] as const;
