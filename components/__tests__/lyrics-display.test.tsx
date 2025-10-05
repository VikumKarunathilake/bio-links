import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LyricsDisplay from '../lyrics-display';

const lyrics = [
  { time: 0, text: 'First lyric' },
  { time: 5, text: 'Second lyric' },
  { time: 10, text: 'Third lyric' },
];

describe('LyricsDisplay', () => {
  it('should display the correct lyric even when the timeupdate event is delayed', () => {
    // Create a mock audio element that the component can attach listeners to.
    const mockAudioElement = document.createElement('audio');

    // The component expects a ref object with a `current` property.
    const audioRef = { current: mockAudioElement };

    // Render the component, passing the mock ref.
    render(<LyricsDisplay lyrics={lyrics} audioRef={audioRef} hasEntered={true} />);

    // Simulate the audio playing and the time updating.
    // Set the currentTime on our mock element.
    audioRef.current.currentTime = 5.6;
    // Dispatch a timeupdate event from that element. The component's useEffect
    // should have attached a listener for this.
    fireEvent.timeUpdate(audioRef.current);

    // Check if the component updated correctly.
    expect(screen.getByText('Second lyric')).toBeInTheDocument();
  });
});