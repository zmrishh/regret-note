import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/store';
import { confessionService } from '@/services/api';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Emotion {
  value: string;
  label: string;
  emoji: string;
}

const EMOTIONS: Emotion[] = [
  { value: 'regret', label: 'Regret', emoji: '😔' },
  { value: 'sadness', label: 'Sadness', emoji: '😢' },
  { value: 'anger', label: 'Anger', emoji: '😠' },
  { value: 'fear', label: 'Fear', emoji: '😨' },
  { value: 'hope', label: 'Hope', emoji: '🌟' },
  { value: 'joy', label: 'Joy', emoji: '😊' },
  { value: 'guilt', label: 'Guilt', emoji: '😳' },
  { value: 'relief', label: 'Relief', emoji: '😌' }
];

const JournalPage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [anonymityLevel, setAnonymityLevel] = useState<string>('full');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { latitude, longitude } = useGeolocation();
  const { user } = useUserStore();

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Voice recording error:', error);
      setSubmitMessage('Failed to start voice recording. Please check microphone permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioBlob) {
      setSubmitMessage('No audio recorded');
      return;
    }

    // Convert audio blob to base64 or upload to cloud storage
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      try {
        setIsSubmitting(true);
        const response = await confessionService.create({
          content: base64Audio,
          emotions: selectedEmotions,
          anonymityLevel,
          location: { 
            latitude: latitude || undefined, 
            longitude: longitude || undefined 
          },
          isPublic: true,
          contentType: 'audio'
        });

        setContent('');
        setSelectedEmotions([]);
        setAudioBlob(null);
        setSubmitMessage('Voice confession submitted successfully! 🎙️');
      } catch (error) {
        console.error('Voice submission error:', error);
        setSubmitMessage('Failed to submit voice confession. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setSubmitMessage('Please enter your confession');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await confessionService.create({
        content,
        emotions: selectedEmotions,
        anonymityLevel,
        location: { 
          latitude: latitude || undefined, 
          longitude: longitude || undefined 
        },
        isPublic: true,
        contentType: 'text'
      });

      setContent('');
      setSelectedEmotions([]);
      setSubmitMessage('Confession submitted successfully! 🌈');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Failed to submit confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-page">
      <h1>Share Your Emotional Journey 🌈</h1>
      
      <div className="submission-tabs">
        <div className="tab text-tab">
          <h2>Text Confession</h2>
          <form onSubmit={handleTextSubmit} className="journal-form">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your confession here..."
              maxLength={1000}
              rows={6}
              required
            />

            <div className="emotion-selector">
              <h3>Select Emotions</h3>
              <div className="emotion-grid">
                {EMOTIONS.map(emotion => (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => handleEmotionToggle(emotion.value)}
                    className={`emotion-button ${
                      selectedEmotions.includes(emotion.value) ? 'selected' : ''
                    }`}
                  >
                    {emotion.emoji} {emotion.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="anonymity-selector">
              <h3>Anonymity Level</h3>
              <select 
                value={anonymityLevel}
                onChange={(e) => setAnonymityLevel(e.target.value)}
              >
                <option value="full">Completely Anonymous</option>
                <option value="location">Show Location</option>
                {user && <option value="username">Show Username</option>}
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting Text...' : 'Submit Text Confession'}
            </button>
          </form>
        </div>

        <div className="tab voice-tab">
          <h2>Voice Confession</h2>
          <div className="voice-recorder">
            {!isRecording ? (
              <button 
                onClick={startVoiceRecording}
                className="start-recording-button"
              >
                🎙️ Start Recording
              </button>
            ) : (
              <button 
                onClick={stopVoiceRecording}
                className="stop-recording-button"
              >
                ⏹️ Stop Recording
              </button>
            )}

            {audioBlob && (
              <div className="audio-preview">
                <audio 
                  src={URL.createObjectURL(audioBlob)} 
                  controls 
                  className="audio-player"
                />
                <button 
                  onClick={handleVoiceSubmit}
                  disabled={isSubmitting}
                  className="submit-voice-button"
                >
                  {isSubmitting ? 'Submitting Voice...' : 'Submit Voice Confession'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {submitMessage && (
        <div className={`submit-message ${
          submitMessage.includes('successfully') ? 'success' : 'error'
        }`}>
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
