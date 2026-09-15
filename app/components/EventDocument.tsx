import {Fragment} from 'react';

const DOCUMENT_HEADINGS = new Set([
  'TENTH FIELD CIRCUIT 2026',
  'TENTH FIELD CIRCUIT',
  'EVENT ENTRY TERMS',
  'Event Privacy Notice',
  'Important Booking Information',
  'Individual Field',
  'Community Field Relay',
  'Identity and contact information',
  'Registration and transaction information',
  'Participation and performance information',
  'Health, medical and accessibility information',
  'Communications and incident information',
  'Photography and recordings',
]);

export function EventDocument({text}: {text: string}) {
  return (
    <div className="event-document">
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph, index) => {
          const lines = paragraph.split('\n').map((line) => line.trim());
          if (index === 0) {
            return (
              <div className="event-document-intro" key={index}>
                {lines.map((line, lineIndex) => (
                  <p key={lineIndex}>
                    {DOCUMENT_HEADINGS.has(line) ||
                    /^(Version|Last updated|Event date):/.test(line) ? (
                      <strong>{line}</strong>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            );
          }
          const hasHeading = /^\d+\.\s/.test(lines[0]);
          const tableRows = lines.filter((line) => line.includes('\t'));
          if (tableRows.length > 0) {
            const [headings, ...rows] = tableRows.map((line) =>
              line.split('\t'),
            );
            return (
              <Fragment key={index}>
                <table className="info-page-table">
                  <thead>
                    <tr>
                      {headings.map((heading) => (
                        <th key={heading} scope="col">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {lines
                  .filter((line) => !line.includes('\t'))
                  .map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
              </Fragment>
            );
          }

          return (
            <Fragment key={index}>
              {hasHeading && (
                <h2 className="info-page-heading event-document-heading">
                  {lines.shift()}
                </h2>
              )}
              {lines.length > 0 && (
                <p>
                  {lines.map((line, lineIndex) => (
                    <Fragment key={lineIndex}>
                      {lineIndex > 0 && <br />}
                      {DOCUMENT_HEADINGS.has(line.replace(/:$/, '')) ||
                      line.endsWith('?') ? (
                        <strong>{line}</strong>
                      ) : (
                        line
                      )}
                    </Fragment>
                  ))}
                </p>
              )}
            </Fragment>
          );
        })}
    </div>
  );
}
