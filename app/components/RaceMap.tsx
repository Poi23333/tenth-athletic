import {useEffect, useRef, useState} from 'react';
import type {Map as MapboxMap} from 'mapbox-gl';
import {loadMapbox} from '~/lib/mapbox.client';

// Venue centre, not a confirmed race check-in entrance.
const VENUE: [number, number] = [-0.0153, 51.5504];

export function RaceMap({accessToken}: {accessToken: string | null}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Loading interactive map…');
  const [failed, setFailed] = useState(false);
  const configured = Boolean(accessToken?.startsWith('pk.'));

  useEffect(() => {
    const element = container.current;
    if (!element || !configured || !accessToken) return;
    let disposed = false;
    let map: MapboxMap | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    setFailed(false);
    setStatus('Loading interactive map…');

    const fail = () => {
      if (disposed) return;
      clearTimeout(timeout);
      setFailed(true);
      setStatus(
        'The interactive map could not load. Please reload the page to try again.',
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeout = setTimeout(fail, 20000);
        void loadMapbox()
          .then(({default: mapboxgl}) => {
            if (disposed) return;
            map = new mapboxgl.Map({
              container: element,
              accessToken,
              style: 'mapbox://styles/mapbox/light-v11',
              center: VENUE,
              zoom: 13.5,
              cooperativeGestures: true,
              attributionControl: true,
            });
            map.on('error', fail);
            map.once('load', () => {
              clearTimeout(timeout);
              if (!disposed) {
                setFailed(false);
                setStatus('');
              }
            });
            map.addControl(
              new mapboxgl.NavigationControl({showCompass: false}),
              'top-right',
            );
            const marker = new mapboxgl.Marker({color: '#5f3058'})
              .setLngLat(VENUE)
              .setPopup(
                new mapboxgl.Popup({offset: 30}).setText('Lee Valley VeloPark'),
              )
              .addTo(map);
            marker
              .getElement()
              .setAttribute('aria-label', 'Lee Valley VeloPark');
            marker.togglePopup();
          })
          .catch(fail);
      },
      {rootMargin: '200px'},
    );
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      clearTimeout(timeout);
      map?.remove();
    };
  }, [accessToken, configured]);

  return (
    <div className="race-map">
      <div
        ref={container}
        className="race-map-canvas"
        aria-label="Interactive map of Lee Valley VeloPark"
      />
      {(!configured || status) && (
        <p
          className="race-map-status"
          role={!configured || failed ? 'alert' : 'status'}
        >
          {!configured ? 'The interactive map is not configured.' : status}
        </p>
      )}
      <noscript>Enable JavaScript to view the interactive map.</noscript>
    </div>
  );
}
