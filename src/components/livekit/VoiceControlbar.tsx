import { Track } from 'livekit-client';
import * as React from 'react';
import { MediaDeviceMenu } from '@livekit/components-react';
import { TrackToggle } from '@livekit/components-react';
import {
  useLocalParticipantPermissions,
  usePersistentUserChoices,
} from '@livekit/components-react';

/** @beta */
export type VoiceAssistantControlBarControls = {
  microphone?: boolean;
  leave?: boolean;
};

/** @beta */
export interface VoiceAssistantControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  controls?: VoiceAssistantControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enables the user to have the same device choices when they rejoin the room.
   * @defaultValue true
   */
  saveUserChoices?: boolean;
}

/**
 * @example
 * ```tsx
 * <LiveKitRoom ... >
 *   <VoiceAssistantControlBar />
 * </LiveKitRoom>
 * ```
 * @beta
 */
export function VoiceControlBar({
  saveUserChoices = true,
  onDeviceError,
}: VoiceAssistantControlBarProps) {
  const visibleControls = { leave: false, microphone: true};

  const localPermissions = useLocalParticipantPermissions();
  // const { microphoneTrack, localParticipant } = useLocalParticipant();

  if (!localPermissions) {
    visibleControls.microphone = false;
  } else {
    visibleControls.microphone ??= localPermissions.canPublish;
  }


  const { saveAudioInputEnabled, saveAudioInputDeviceId } = usePersistentUserChoices({
    preventSave: !saveUserChoices,
  });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) => {
      if (isUserInitiated) {
        saveAudioInputEnabled(enabled);
      }
    },
    [saveAudioInputEnabled],
  );

  return (
    <div>
      {visibleControls.microphone && (
        <div className='flex gap-2 bg-blue-500 rounded-lg'>
          <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
            />
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={true}
            onChange={microphoneOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
          </TrackToggle>
        </div>
      )}
    </div>
  );
}
