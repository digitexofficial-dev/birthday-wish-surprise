import { useState, useEffect, useCallback, useRef } from 'react';

interface BirthdayCakeProps {
  onCandleBlown: () => void;
}

const BirthdayCake = ({ onCandleBlown }: BirthdayCakeProps) => {
  const [layersVisible, setLayersVisible] = useState([false, false, false]);
  const [candleVisible, setCandleVisible] = useState(false);
  const [flameOn, setFlameOn] = useState(false);
  const [blowStrength, setBlowStrength] = useState(0);
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isListening, setIsListening] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const isListeningRef = useRef(false);
  const hasStartedRef = useRef(false);

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

    setTimeout(() => {
      setCandleVisible(true);
      setTimeout(() => setFlameOn(true), 500);
    }, 2200);
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
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
    analyserRef.current = null;
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
    if (isListeningRef.current || hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      if (audioContext.state === 'suspended') await audioContext.resume();
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      isListeningRef.current = true;
      setIsListening(true);

      let consecutiveHighValues = 0;

      const checkBlow = () => {
        if (!isListeningRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const lowFreqData = dataArray.slice(0, 30);
        const average = lowFreqData.reduce((a, b) => a + b) / lowFreqData.length;
        const timeDataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(timeDataArray);
        let maxAmplitude = 0;
        for (let i = 0; i < timeDataArray.length; i++) {
          const amplitude = Math.abs(timeDataArray[i] - 128);
          if (amplitude > maxAmplitude) maxAmplitude = amplitude;
        }
        const strength = Math.max(average, maxAmplitude) * 1.5;
        setBlowStrength(Math.min(strength, 100));
        if (average > 25 || maxAmplitude > 30) {
          consecutiveHighValues++;
          if (consecutiveHighValues >= 8) {
            blowOutCandle();
            return;
          }
        } else {
          consecutiveHighValues = Math.max(0, consecutiveHighValues - 2);
        }
        animationRef.current = requestAnimationFrame(checkBlow);
      };
      checkBlow();
    } catch (err) {
      setMicPermission('denied');
      hasStartedRef.current = false;
    }
  }, [blowOutCandle]);

  useEffect(() => {
    if (flameOn && !isListeningRef.current && micPermission !== 'denied') {
      startListening();
    }
    return () => {
      if (!flameOn) {
        stopListening();
        hasStartedRef.current = false;
      }
    };
  }, [flameOn, micPermission, startListening, stopListening]);

  const handleManualBlow = () => {
    if (flameOn) {
      blowOutCandle();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4">
      {/* Instruction text (simplified colors) */}
      {flameOn && (
        <div className="absolute top-8 left-0 right-0 text-center animate-fade-in-up px-4">
          <p className="text-lg font-bold text-gray-800 mb-2">
            Surprisee, coba tiup lilinnya lewat mic 🌬️
          </p>
          {micPermission === 'denied' && (
            <p className="text-gray-600 text-sm mb-2">
              Microphone blocked? Click the candle to blow it out!
            </p>
          )}
          {isListening && (
            <div className="mt-2 w-48 mx-auto bg-gray-300 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${blowStrength}%` }}
              />
            </div>
          )}
          {!isListening && micPermission === 'pending' && (
            <p className="text-gray-600 text-sm">
              Please allow microphone access...
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center">
        {candleVisible && (
          <div 
            className="relative mb-0 animate-candle-fall cursor-pointer"
            onClick={handleManualBlow}
            title="Click to blow out"
          >
            {/* Flame/Smoke (Assuming CSS keyframes exist) */}
            {flameOn && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div 
                  className="w-4 h-8 rounded-full bg-yellow-400"
                  style={{
                    boxShadow: '0 0 20px yellow, 0 0 40px orange',
                  }}
                />
              </div>
            )}
            {!flameOn && candleVisible && (
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-8">
                 <div className="w-full h-full bg-gray-400 rounded-full opacity-50 animate-smoke-puff"></div>
               </div>
            )}

            {/* Candle Stick */}
            <div className="w-3 h-16 bg-white border border-gray-300 rounded-sm shadow-md" />
            <div className="w-4 h-1 bg-white mx-auto shadow-sm" />
          </div>
        )}
        
        {/* Cake Layers - USING ARBITRARY VALUES FOR CHOCOLATE COLORS */}
        <div className="relative">
          {/* Layer 3 (Bottom) - Dark Chocolate Body, Slightly Lighter Chocolate Icing */}
          <div 
            className={`w-64 h-16 bg-[#3E2723] rounded-t-none rounded-b-xl shadow-lg transition-all duration-700 ease-out transform ${ //
              layersVisible[2] ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            {/* Icing for Layer 3 */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#6E5235] rounded-t-xl" /> {/* */}
          </div>

          {/* Layer 2 (Middle) */}
          <div 
            className={`w-52 h-14 bg-[#3E2723] rounded-b-xl shadow-lg mt-1 mx-auto relative transition-all duration-700 ease-out transform ${
              layersVisible[1] ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            {/* Icing for Layer 2 */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-[#6E5235] rounded-t-lg" />
            
            {/* "18" Decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-4xl font-extrabold text-white font-serif tracking-tighter" style={{ textShadow: '2px 2px 0px #1a1a1a' }}>
                18
              </span>
            </div>
            
          </div>

          {/* Layer 1 (Top) */}
          <div 
            className={`w-40 h-12 bg-[#3E2723] rounded-b-xl shadow-lg mt-1 mx-auto relative transition-all duration-700 ease-out transform ${
              layersVisible[0] ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            {/* Icing for Layer 1 */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-[#6E5235] rounded-t-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;
