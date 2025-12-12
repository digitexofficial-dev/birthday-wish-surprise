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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      const checkBlow = () => {
        if (!analyserRef.current || !flameOn) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        setBlowStrength(average);
        
        // Detect strong blow (threshold around 80-100)
        if (average > 70) {
          setFlameOn(false);
          setTimeout(() => {
            onCandleBlown();
          }, 800);
          stopListening();
          return;
        }
        
        if (flameOn) {
          requestAnimationFrame(checkBlow);
        }
      };
      
      checkBlow();
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }, [flameOn, onCandleBlown]);

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  };

  useEffect(() => {
    if (flameOn && !isListening) {
      startListening();
    }
    return () => {
      stopListening();
    };
  }, [flameOn, isListening, startListening]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Instruction text */}
      {flameOn && (
        <div className="absolute top-8 text-center animate-fade-in-up">
          <p className="text-rose-light text-lg font-body">
            🎂 Blow into your microphone to blow out the candle! 🎂
          </p>
          {blowStrength > 30 && (
            <div className="mt-2 w-48 mx-auto bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(blowStrength, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Cake container */}
      <div className="relative">
        {/* Candle */}
        {candleVisible && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 -top-24 animate-candle-fall"
            style={{ animationDelay: '0s' }}
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
            {!flameOn && candleVisible && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="w-2 h-8 bg-gradient-to-t from-muted-foreground/50 to-transparent rounded-full opacity-50 animate-fade-in-up" />
              </div>
            )}
            {/* Candle body */}
            <div className="w-3 h-16 bg-gradient-to-b from-cream to-rose-light rounded-sm" />
          </div>
        )}

        {/* Layer 3 (top) - Pink */}
        {layersVisible[0] && (
          <div 
            className="animate-cake-layer"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-32 h-16 bg-gradient-to-b from-rose to-rose-dark rounded-t-lg rounded-b-sm relative overflow-hidden">
              <div className="absolute top-2 left-0 right-0 h-2 bg-rose-light/30 rounded" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-chocolate" />
            </div>
          </div>
        )}

        {/* Layer 2 (middle) - Cream with sprinkles look */}
        {layersVisible[1] && (
          <div 
            className="animate-cake-layer"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-48 h-20 bg-gradient-to-b from-cream to-rose-light/50 rounded-sm relative overflow-hidden mx-auto">
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
          <div 
            className="animate-cake-layer"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-64 h-24 bg-gradient-to-b from-rose-light to-rose rounded-b-lg rounded-t-sm relative overflow-hidden mx-auto">
              <div className="absolute top-3 left-0 right-0 h-2 bg-cream/40 rounded" />
              <div className="absolute top-8 left-0 right-0 h-2 bg-cream/30 rounded" />
              {/* Plate */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-72 h-4 bg-gradient-to-b from-gold to-gold-light rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCake;
