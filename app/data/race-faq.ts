import {eventDate, eventHours} from '~/lib/seo';

// Source: race-faq.md; the event date and hours follow the Shopify configuration.
export function getRaceFaq(startsAt: string) {
  return [
    {
      title: 'EVENT + VENUE',
      items: [
        {
          question: 'When and where will TENTH FIELD CIRCUIT take place?',
          answer: `TENTH FIELD CIRCUIT will take place at Lee Valley VeloPark in East London.\n\nEvent date: ${eventDate(startsAt)}\n\nEvent hours: ${eventHours(startsAt)}\n\nThe detailed race-day timetable will be published before the event.`,
        },
        {
          question: 'Is the event open to spectators?',
          answer:
            'Yes. Spectator entry is complimentary.\n\nAdmission may be subject to venue capacity. Any RSVP or spectator registration requirements will be announced before the event.',
        },
        {
          question: 'Can children attend as spectators?',
          answer:
            'Children may attend when accompanied and supervised by a responsible adult.\n\nChildren must remain within designated spectator areas and must not enter the course or restricted operational areas.',
        },
        {
          question: 'Are dogs permitted at the venue?',
          answer:
            'Dogs are permitted in the outdoor spectator areas surrounding the Trail course, provided they are kept on a lead and under control at all times.\n\nDogs are not permitted inside the indoor venue areas, on the race course or within restricted operational areas.\n\nAssistance dogs are permitted in both indoor and outdoor venue areas but must not enter the active race course.',
        },
        {
          question: 'Is the venue accessible?',
          answer:
            'Lee Valley VeloPark is accessible to wheelchair users.\n\nAccessible entrances, toilets and designated viewing areas are available. Anyone requiring additional assistance should contact the event team before attending.',
        },
      ],
    },
    {
      title: 'REGISTRATION',
      items: [
        {
          question: 'Which race formats can I enter?',
          answer:
            'TENTH FIELD CIRCUIT consists of two separate competitions:\n\n- Individual Field\n- Community Field Relay\n\nPublic entrants may apply for the Individual Field. Community and running clubs may apply separately for the Community Field Relay.\n\nInvited places are issued directly by TENTH.',
        },
        {
          question: 'How much does it cost to enter?',
          answer:
            'Individual Field entry costs £25 per runner.\n\nCommunity Field Relay entry costs £120 per six-person team.\n\nEntry fees secure a place in the selected race format. Full cancellation, transfer and refund terms will be provided during registration.\n\nSpectator entry is free.',
        },
        {
          question: 'What is the minimum age to compete?',
          answer:
            'All competitors must be aged 18 or over on the date of the event.\n\nParticipants may be required to provide photographic identification during race-bib collection.',
        },
        {
          question: 'What is included with registration?',
          answer:
            'Registration includes:\n\n- Entry to the selected race format\n- An official race bib\n- RFID race timing\n- Access to the designated course and competition areas\n- Race-day hydration support\n- On-course first-aid and event support\n\nAny additional items or participant benefits will be confirmed before the event.',
        },
        {
          question: 'Can I cancel, defer or transfer my entry?',
          answer:
            'Entry fees are non-refundable if a participant cancels or is unable to attend. Entries cannot be deferred to a future event.\n\nTransfers or participant substitutions are permitted only with prior written approval from the TENTH event team.\n\nFor questions about an existing entry, contact info@tenthathletic.com.',
        },
        {
          question: 'How do invited participants register?',
          answer:
            'Invited participants will receive a private registration link or access code directly from TENTH.\n\nAn invitation does not replace registration. Every participant must complete the registration form, provide the required information and accept the event terms before competing.',
        },
        {
          question:
            'Can I enter both the Individual Field and Community Field Relay?',
          answer:
            'No. Participants may enter either the Individual Field or the Community Field Relay, but not both.\n\nThis protects participant recovery, keeps the race-day schedule on time and ensures places remain available to more runners.',
        },
      ],
    },
    {
      title: 'INDIVIDUAL FIELD',
      items: [
        {
          question: 'Can public entrants qualify for the Final?',
          answer:
            'Yes.\n\nPublic entrants and invited participants compete under the same sporting rules. Qualification is determined by performance, regardless of how the participant entered the event.',
        },
        {
          question: 'How many athletes qualify for the Final?',
          answer:
            'Up to 48 athletes will progress to the Field Final.\n\nThe final qualification structure and any applicable category allocations will be confirmed in the official race rules.',
        },
        {
          question: 'How does the Individual Field format work?',
          answer:
            'The Individual Field progresses through three competition stages:\n\n1. Field Qualifying  \n2. Grid TT  \n3. Field Final\n\nField Qualifying is completed over eight laps. During laps 01–07, athletes complete four Trail laps and three Road laps in an open sequence. Lap 08 is completed on the Road loop.\n\nThe highest-placed qualifying athletes progress to Grid TT and the Field Final.\n\nBefore the Final, each qualified athlete completes one timed Road loop in Grid TT. Grid TT determines the starting order for the Final; its times do not carry into the Final result.\n\nThe Field Final is contested over 12 laps: six Trail laps and six Road laps. Athletes determine their own Road and Trail sequence before entering the final Road-only lap.',
        },
        {
          question: 'How long are the Road and Trail loops?',
          answer:
            'The course consists of:\n\n- Road Loop: approximately 660 metres\n- Trail Loop: approximately 1,230 metres\n\nFinal course measurements may be adjusted following installation, testing and official course verification.',
        },
        {
          question: 'How are Road and Trail laps recorded?',
          answer:
            'Each participant’s laps and times are recorded using an RFID timing system.\n\nCourse timing points and event officials will record which loop has been completed. Participants remain responsible for following the required Road and Trail sequence.',
        },
        {
          question:
            'What happens if I complete the wrong number of Road or Trail laps?',
          answer:
            'Participants must complete the prescribed number of Road and Trail laps.\n\nMissing a lap, completing an additional lap or entering the wrong terrain may result in a time penalty, loss of position or disqualification. The final decision will be made by the race officials under the published race rules.',
        },
      ],
    },
    {
      title: 'COMMUNITY FIELD RELAY',
      items: [
        {
          question: 'How many runners are required for a Relay team?',
          answer:
            'Each Community Field Relay team consists of six registered runners.\n\nAll six runners must complete their individual registration requirements before the team entry is confirmed.',
        },
        {
          question: 'How does the Community Field Relay work?',
          answer:
            'The Community Field Relay is a separate six-person team competition with its own timing, ranking and podium.\n\nOnly one runner from each team may be active on the course at a time. Runners must complete their assigned Road or Trail leg before making an exchange inside the designated Relay Exchange Zone.\n\nThe Relay does not affect qualification, Grid TT positions or results in the Individual Field.\n\nThe final leg order and terrain allocation will be published in the official Relay rules.',
        },
        {
          question: 'How is the Relay timed?',
          answer:
            'Each team is timed from the start of its first leg until the completion of its final leg.\n\nThe total time includes all running legs and exchanges. RFID timing and exchange-zone officials will be used to verify the result.\n\nPenalties may be applied for an invalid exchange, missed timing point or incorrect course sequence.',
        },
        {
          question: 'Does every Relay runner need to register separately?',
          answer:
            'Yes.\n\nThe team captain submits the team entry, but every runner must complete an individual participant form, provide emergency information and accept the event terms.\n\nThe team will not be confirmed until all six runners have completed registration.',
        },
      ],
    },
    {
      title: 'RACE DAY',
      items: [
        {
          question: 'Where do I collect my race bib?',
          answer:
            'Race bibs will be collected from the Check-in desk at Field Base.\n\nThe exact check-in location and opening time will be shown in the race guide and on the venue map.',
        },
        {
          question: 'What do I need to collect my bib?',
          answer:
            'Please bring:\n\n- Your registration confirmation or check-in QR code\n- Valid photographic identification\n- Any additional documentation requested by the event team\n\nRace bibs may not be collected on behalf of another participant unless this has been approved in advance.',
        },
        {
          question: 'When should I arrive?',
          answer:
            'Participants should arrive at least 60 minutes before their allocated race session.\n\nThis allows time for check-in, bib collection, bag drop, the mandatory race briefing and warm-up. Individual arrival times will be included in the final race-day information.',
        },
        {
          question: 'What facilities are available?',
          answer:
            'The planned race-day facilities include:\n\n- Toilets\n- Changing facilities\n- Bag drop\n- Drinking-water and hydration points\n- First aid\n- Accessible entrances and viewing areas\n- Food and drink\n- Spectator areas',
        },
        {
          question: 'Will food and drinks be available?',
          answer:
            'Food and drinks will be available at the venue.\n\nThe final catering offer, opening times and payment arrangements will be announced before the event. Participants should bring any personal race nutrition they require.',
        },
        {
          question: 'Can spectators bring their own food and drinks?',
          answer:
            'Venue food and drink rules will apply.\n\nSpectators should check the final venue guidance before attending. Personal medical supplies and dietary requirements should be discussed with the venue or event team in advance.\n\nParticipants may bring their own race nutrition and a refillable water bottle, subject to the final event rules.',
        },
        {
          question: 'Is there any mandatory kit?',
          answer:
            'Participants must wear their official race bib and suitable running footwear and clothing.\n\nTrail running shoes are recommended for the Trail loop. Any additional mandatory equipment required because of weather, lighting or course conditions will be listed in the final race guide.',
        },
        {
          question: 'Will the race continue if it rains?',
          answer:
            'The event is intended to continue in normal wet-weather conditions.\n\nThe organiser may change, delay, shorten or cancel part of the event if weather or course conditions create an unacceptable safety risk. Updates will be communicated through the registered participant email address and official TENTH channels.',
        },
      ],
    },
    {
      title: 'PHOTOGRAPHY + RESULTS',
      items: [
        {
          question: 'Will photography and filming take place?',
          answer:
            'Yes.\n\nOfficial photography and filming will take place throughout the event for event documentation, results coverage and TENTH communications.\n\nParticipants and spectators should review the event privacy notice before attending. Anyone with a specific concern should contact the event team or speak to the information desk on arrival.',
        },
        {
          question: 'How do community photographers apply for accreditation?',
          answer:
            'Photographers attending with a registered community or running crew must submit a separate Community Photographer Accreditation application.\n\nEach registered crew may nominate one photographer. Accreditation is subject to approval and does not provide unrestricted course access.\n\nApproved photographers must remain within designated media areas and follow all instructions issued by event officials.',
        },
        {
          question: 'Where will results be published?',
          answer:
            'Provisional results will be published on the TENTH FIELD CIRCUIT website following the event.\n\nResults will become official once timing data, penalties and any race-official decisions have been reviewed.',
        },
        {
          question: 'Where can I find official race photographs?',
          answer:
            'Official race photographs will be published in the TENTH FIELD CIRCUIT event gallery after the event.\n\nThe gallery link and publication timing will be shared through the event website, participant email and official TENTH channels.',
        },
      ],
    },
  ] as const;
}
