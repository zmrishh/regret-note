import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { confessionService } from '../../services/api';
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { cn } from '@/lib/utils';

const VoiceJournalMode = ({ onTranscriptChange, mood }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [visualizerData, setVisualizerData] = useState(Array(20).fill(0));
  const [placeholder, setPlaceholder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRecorderRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
        if (interimTranscript) {
          // Show interim results in a different style
          document.getElementById('interim').textContent = interimTranscript;
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Set dynamic placeholder based on mood
    if (mood === 'regret') {
      const regretPrompts = [
        'Speak about the moment you regret...',
        'Share the experience that\'s been weighing on you...',
        'What lesson can you extract from this situation?',
        'Describe how this moment impacted you...'
      ];
      setPlaceholder(regretPrompts[Math.floor(Math.random() * regretPrompts.length)]);
    } else {
      const reflectionPrompts = [
        'Talk about what you\'re grateful for today...',
        'Share a moment of joy or peace...',
        'Reflect on your personal growth recently...',
        'Express how you\'re feeling right now...'
      ];
      setPlaceholder(reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]);
    }
  }, [mood]);

  useEffect(() => {
    if (isRecording) {
      // Start audio visualization
      startAudioVisualization();
    } else {
      // Stop visualization
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  useEffect(() => {
    onTranscriptChange?.(transcript);
  }, [transcript, onTranscriptChange]);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const updateVisualizer = () => {
        if (!isRecording) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Convert frequency data to visualization data
        const normalized = Array.from(dataArray).map(val => val / 255);
        setAudioLevel(Math.max(...normalized));
        setVisualizerData(normalized.slice(0, 20));

        requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleRecordingToggle = () => {
    if (!isRecording) {
      // Start recording
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setSubmitMessage('Please record your thoughts before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Stop recording if still in progress
      if (isRecording) {
        stopRecording();
      }

      // Get audio blob if available
      let audioBase64 = null;
      if (audioRecorderRef.current) {
        const audioBlob = await audioRecorderRef.current.stop();
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        audioBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
      }

      const response = await confessionService.create({
        content: transcript,
        audioContent: audioBase64,
        emotions: [mood || 'neutral'],
        anonymityLevel: 'full',
        contentType: 'audio',
        isPublic: true
      });

      setSubmitMessage('Voice confession submitted successfully! 🎙️');
      setTranscript('');
      onTranscriptChange?.('');
      
      // Reset audio recorder
      if (audioRecorderRef.current) {
        audioRecorderRef.current = null;
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Voice Recording Bubble with Visualizer */}
      <motion.div 
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        {/* Circular Visualizer */}
        <div className="absolute inset-0 flex items-center justify-center">
          {visualizerData.map((level, index) => (
            <motion.div
              key={index}
              className="absolute w-1 bg-white/40 rounded-full"
              style={{
                height: '20px',
                transform: `rotate(${(index * 360) / 20}deg) translateY(-70px)`
              }}
              animate={{
                height: isRecording ? `${level * 60 + 20}px` : '20px',
                opacity: isRecording ? 0.8 : 0.2
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Ripple Effects */}
        <AnimatePresence>
          {isRecording && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full bg-accent-orange/30"
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ 
                    scale: 1.5 + (i * 0.2), 
                    opacity: 0,
                    rotate: i * 120 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                  exit={{ opacity: 0, scale: 2 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Recording Button */}
        <motion.button
          className={`w-40 h-40 rounded-full flex items-center justify-center relative overflow-hidden
            ${isRecording ? 'bg-red-500' : 'bg-accent-orange'} cursor-pointer
            hover:shadow-lg hover:shadow-accent-orange/20 transition-shadow`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRecordingToggle}
        >
          {/* Audio Level Indicator */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: audioLevel }}
            transition={{ duration: 0.1 }}
            style={{ originY: 1 }}
          />
          
          <span className="text-2xl font-medium relative z-10">
            {isRecording ? 'Recording...' : 'Tap to Record'}
          </span>
        </motion.button>
      </motion.div>

      {/* Transcription Area */}
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 -z-10
                        group-hover:bg-white/10 transition-colors duration-300" />
          <div className="p-6 min-h-[200px]">
            <h3 className="text-xl mb-4 text-white/80 font-medium flex items-center">
              <span>Transcription</span>
              {isRecording && (
                <motion.div
                  className="ml-3 px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-semibold"
                  animate={{ opacity: [0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  LIVE
                </motion.div>
              )}
            </h3>
            <div className="space-y-4">
              {transcript && (
                <p className="text-lg text-white/90 leading-relaxed">
                  {transcript}
                </p>
              )}
              <p id="interim" className="text-lg text-white/50 italic"></p>
              {!transcript && !isRecording && (
                <p className="text-lg text-white/30 italic">
                  {placeholder}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div 
        className="mt-4 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <HoverBorderGradient
          onClick={handleSubmit}
          disabled={isSubmitting || !transcript.trim()}
          containerClassName={cn(
            transcript.trim() 
              ? "opacity-100 cursor-pointer" 
              : "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Sharing your voice..." : "Share Voice Anonymously"}
        </HoverBorderGradient>
      </motion.div>

      {/* Submit Message */}
      <AnimatePresence>
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`mt-4 p-4 rounded-xl text-center
              ${submitMessage.includes('successfully') 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
              }`}
          >
            {submitMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Status */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2
                     bg-red-500/20 backdrop-blur-sm rounded-full px-6 py-2
                     border border-red-500/30"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-sm font-medium">Recording in progress</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceJournalMode;
