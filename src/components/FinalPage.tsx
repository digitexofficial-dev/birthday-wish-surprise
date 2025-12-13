import { useEffect, useState } from 'react';

const FinalPage = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 1000);
  }, []);

  // Generate floating hearts
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 4,
    size: 20 + Math.random() * 30,
  }));

  // Generate flowers
  const flowers = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 8 + Math.random() * 4,
    size: 30 + Math.random() * 20,
    type: ['🌸', '🌺', '🌷', '💐', '🌹'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'hsl(340 30% 8%)' }}>
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={`heart-${heart.id}`}
          className="absolute text-rose pointer-events-none"
          style={{
            left: `${heart.x}%`,
            bottom: '-50px',
            fontSize: `${heart.size}px`,
            animation: `floatUp ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Floating Flowers */}
      {flowers.map((flower) => (
        <div
          key={`flower-${flower.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${flower.x}%`,
            bottom: '-50px',
            fontSize: `${flower.size}px`,
            animation: `floatUp ${flower.duration}s ease-in-out ${flower.delay}s infinite`,
          }}
        >
          {flower.type}
        </div>
      ))}

      {/* Center Content */}
      <div className="text-center z-10 px-4">
        {/* Animated Heart */}
        <div className="mb-8">
          <div 
            className="text-8xl md:text-9xl animate-heartbeat inline-block"
            style={{
              filter: 'drop-shadow(0 0 30px hsl(var(--rose)))',
            }}
          >
            💖
          </div>
        </div>

        {/* Main Text */}
        {showText && (
          <div className="animate-fade-in-up">
            <h1 
              className="font-romantic text-6xl md:text-8xl text-rose mb-4"
              style={{
                textShadow: '0 0 40px hsl(var(--rose) / 0.5), 0 0 80px hsl(var(--rose) / 0.3)',
              }}
            >
              Happy Birthday
            </h1>
            <h2 
              className="font-romantic text-5xl md:text-7xl text-gold"
              style={{
                textShadow: '0 0 30px hsl(var(--gold) / 0.5)',
              }}
            >
              My Love 💕
            </h2>
            
            <p className="mt-8 text-rose-light/80 font-body text-xl max-w-md mx-auto">
              Thank you for being the most amazing person in my life.
              Here's to your 19th year! 🎂✨
            </p>
          </div>
        )}

        {/* Decorative Flowers at bottom */}
        <div className="mt-12 flex justify-center gap-4 animate-sway">
          <span className="text-4xl">🌹</span>
          <span className="text-4xl">🌸</span>
          <span className="text-4xl">💐</span>
          <span className="text-4xl">🌺</span>
          <span className="text-4xl">🌷</span>
        </div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `flameFlicker ${1 + Math.random()}s ease-in-out ${Math.random() * 2}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FinalPage;
