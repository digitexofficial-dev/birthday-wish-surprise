import { useState, useEffect, useCallback, useRef } from 'react';

interface BirthdayCakeProps {
  onCandleBlown: () => void;
}

const BirthdayCake = ({ onCandleBlown }: BirthdayCakeProps) => {
  const [layersVisible, setLayersVisible] = useState([false, false, false]);
  const [candleVisible, setCandleVisible] = useState(false);
  const [flameOn, setFlameOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [blowStrength, setBlowStrength] = useState(0);
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Animate cake layers falling one by one
  useEffect(() => {
    const delays = [300, 900, 1500];
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setLayersVisible(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay);
    });

    // Show candle after all layers
    setTimeout(() => {
      setCandleVisible(true);
      setTimeout(() => setFlameOn(true), 500);
    }, 2200);
  }, []);

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  }, []);

  const blowOutCandle = useCallback(() => {
    setFlameOn(false);
    stopListening();
    setTimeout(() => {
      onCandleBlown();
    }, 800);
  }, [onCandleBlown, stopListening]);

  const startListening = useCallback(async () => {
    if (isListening) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } 
      });
      streamRef.current = stream;
      setMicPermission('granted');
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.3;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      let consecutiveHighValues = 0;

      const checkBlow = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Focus on lower frequencies (typical of blowing sound)
        const lowFreqData = dataArray.slice(0, 20);
        const average = lowFreqData.reduce((a, b) => a + b) / lowFreqData.length;
        
        setBlowStrength(Math.min(average * 2, 100));
        
        // Lower threshold and require consecutive high values for reliability
        if (average > 40) {
          consecutiveHighValues++;
          if (consecutiveHighValues >= 5) {
            blowOutCandle();
            return;
          }
        } else {
          consecutiveHighValues = Math.max(0, consecutiveHighValues - 1);
        }
        
        animationRef.current = requestAnimationFrame(checkBlow);
      };
      
      checkBlow();
    } catch (err) {
      console.error('Microphone access denied:', err);
      setMicPermission('denied');
    }
  }, [isListening, blowOutCandle]);

  useEffect(() => {
    if (flameOn && !isListening && micPermission !== 'denied') {
      startListening();
    }
    return () => {
      stopListening();
    };
  }, [flameOn, isListening, micPermission, startListening, stopListening]);

  // Manual click to blow out (fallback)
  const handleManualBlow = () => {
    if (flameOn) {
      blowOutCandle();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4">
      {/* Instruction text */}
      {flameOn && (
        <div className="absolute top-8 left-0 right-0 text-center animate-fade-in-up px-4">
          <p className="text-rose-light text-lg font-body mb-2">
            Surprisee, coba tiup lilinnya lewat mic 
          </p>
          {micPermission === 'denied' && (
            <p className="text-muted-foreground text-sm mb-2">
              Microphone blocked? Click the candle to blow it out!
            </p>
          )}
          {isListening && blowStrength > 10 && (
            <div className="mt-2 w-48 mx-auto bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${blowStrength}%` }}
              />
            </div>
          )}
          {!isListening && micPermission === 'pending' && (
            <p className="text-muted-foreground text-sm">
              Please allow microphone access...
            </p>
          )}
        </div>
      )}

      {/* Cake container - properly centered */}
      <div className="flex flex-col items-center">
        {/* Candle */}
        {candleVisible && (
          <div 
            className="relative mb-0 animate-candle-fall cursor-pointer"
            onClick={handleManualBlow}
            title="Click to blow out"
          >
            {/* Flame */}
            {flameOn && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div 
                  className="w-4 h-8 rounded-full bg-gradient-to-t from-candle-glow via-candle-flame to-gold-light animate-flame"
                  style={{
                    boxShadow: '0 0 20px hsl(var(--candle-flame)), 0 0 40px hsl(var(--candle-glow))',
                  }}
                />
              </div>
            )}
            {/* Smoke when blown out */}
            {!flameOn && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="w-2 h-8 bg-gradient-to-t from-muted-foreground/50 to-transparent rounded-full opacity-50 animate-fade-in-up" />
              </div>
            )}
            {/* Candle body */}
            <div className="w-3 h-16 bg-gradient-to-b from-cream to-rose-light rounded-sm mx-auto" />
          </div>
        )}

        {/* Layer 3 (top) - Pink */}
        {layersVisible[0] && (
          <div className="animate-cake-layer">
            <div className="w-32 h-16 bg-gradient-to-b from-rose to-rose-dark rounded-t-lg rounded-b-sm relative overflow-hidden">
              <div className="absolute top-2 left-0 right-0 h-2 bg-rose-light/30 rounded" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-chocolate" />
            </div>
          </div>
        )}

        {/* Layer 2 (middle) - Cream with sprinkles look */}
        {layersVisible[1] && (
          <div className="animate-cake-layer">
            <div className="w-48 h-20 bg-gradient-to-b from-cream to-rose-light/50 rounded-sm relative overflow-hidden">
              <div className="absolute top-2 left-0 right-0 h-2 bg-gold/30 rounded" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-chocolate" />
              {/* Decorative dots */}
              <div className="absolute top-6 left-4 w-2 h-2 bg-cherry rounded-full" />
              <div className="absolute top-8 left-12 w-2 h-2 bg-gold rounded-full" />
              <div className="absolute top-5 right-6 w-2 h-2 bg-rose rounded-full" />
              <div className="absolute top-10 right-14 w-2 h-2 bg-cherry rounded-full" />
            </div>
          </div>
        )}

        {/* Layer 1 (bottom) - Large pink base */}
        {layersVisible[2] && (
          <div className="animate-cake-layer">
            <div className="w-64 h-24 bg-gradient-to-b from-rose-light to-rose rounded-b-lg rounded-t-sm relative overflow-hidden">
              <div className="absolute top-3 left-0 right-0 h-2 bg-cream/40 rounded" />
              <div className="absolute top-8 left-0 right-0 h-2 bg-cream/30 rounded" />
            </div>
            {/* Plate */}
            <div className="w-72 h-4 bg-gradient-to-b from-gold to-gold-light rounded-full mx-auto -mt-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCake;
