import React from 'react';
import { Series, Audio } from 'remotion';
import { WeddingVideoProps } from './types';
import { AuspiciousScene } from './scenes/AuspiciousScene';
import { PersonIntroScene } from './scenes/PersonIntroScene';
import { EventsTimelineScene } from './scenes/EventsTimelineScene';
import { WeddingVenueScene } from './scenes/WeddingVenueScene';
import { WatermarkOverlay } from './WatermarkOverlay';

export const WeddingVideoComposition: React.FC<WeddingVideoProps> = ({
  template,
  values,
  audioUrl,
  isWatermarked = true,
}) => {
  return (
    <div className="relative w-full h-full bg-black">
      {/* Background Audio Track */}
      {audioUrl && <Audio src={audioUrl} volume={0.85} />}

      {/* Series of sequential animated scenes */}
      <Series>
        {/* Scene 1: Auspicious Mantra / Save the date */}
        <Series.Sequence durationInFrames={150}>
          <AuspiciousScene
            mantra={values['auspiciousMantra']}
            heading={values['invitationHeading'] || values['tagline']}
            subtext={values['invitationSubtext'] || values['weddingDateBrief']}
            backgroundUrl={template.scenes[0]?.background.url}
          />
        </Series.Sequence>

        {/* Scene 2: Bride Intro */}
        <Series.Sequence durationInFrames={180}>
          <PersonIntroScene
            roleBadge="Bride"
            name={values['brideName'] || values['brideDetails']}
            relation={values['brideRelation'] || 'Daughter of'}
            parents={values['brideParents']}
            photoUrl={values['bridePhoto'] || values['couplePhoto']}
            backgroundUrl={template.scenes[1]?.background.url}
          />
        </Series.Sequence>

        {/* Scene 3: Groom Intro */}
        <Series.Sequence durationInFrames={180}>
          <PersonIntroScene
            roleBadge="Groom"
            name={values['groomName'] || values['groomDetails']}
            relation={values['groomRelation'] || 'Son of'}
            parents={values['groomParents']}
            photoUrl={values['groomPhoto']}
            backgroundUrl={template.scenes[2]?.background.url}
          />
        </Series.Sequence>

        {/* Scene 4: Pre-Wedding Celebrations (Haldi / Mehendi / Sangeet) */}
        <Series.Sequence durationInFrames={180}>
          <EventsTimelineScene
            event1Name={values['event1Name'] || values['ringCeremony']}
            event1Time={values['event1Time']}
            event2Name={values['event2Name'] || values['sangeetCeremony']}
            event2Time={values['event2Time']}
            backgroundUrl={template.scenes[3]?.background.url}
          />
        </Series.Sequence>

        {/* Scene 5: Wedding Ceremony & Reception */}
        <Series.Sequence durationInFrames={210}>
          <WeddingVenueScene
            weddingDate={values['weddingDate']}
            weddingMuhurat={values['weddingMuhurat']}
            venueName={values['venueName']}
            venueAddress={values['venueAddress']}
            rsvpContact={values['rsvpContact'] || values['rsvpInfo']}
            backgroundUrl={template.scenes[4]?.background.url || template.scenes[0]?.background.url}
          />
        </Series.Sequence>
      </Series>

      {/* Watermark for free preview */}
      {isWatermarked && <WatermarkOverlay />}
    </div>
  );
};

