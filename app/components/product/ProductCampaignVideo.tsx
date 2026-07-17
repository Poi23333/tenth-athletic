import {forwardRef, useEffect, useRef} from 'react';

export const ProductCampaignVideo = forwardRef<HTMLElement>(
  function ProductCampaignVideo(_props, forwardedRef) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const motionPreference = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );

      function syncPlayback() {
        const activeVideo = videoRef.current;

        if (!activeVideo) {
          return;
        }

        if (motionPreference.matches) {
          activeVideo.pause();
          activeVideo.currentTime = 0;
          return;
        }

        void activeVideo.play().catch((error: unknown) => {
          console.error('AuraLite campaign video playback failed.', error);
        });
      }

      syncPlayback();
      motionPreference.addEventListener('change', syncPlayback);

      return () => {
        motionPreference.removeEventListener('change', syncPlayback);
      };
    }, []);

    return (
      <section
        aria-label="AuraLite campaign film"
        className="product-campaign-video"
        ref={forwardedRef}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          ref={videoRef}
        >
          <source src="/videos/auralite-performance.mp4" type="video/mp4" />
        </video>
      </section>
    );
  },
);
