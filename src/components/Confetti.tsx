import { useEffect, useState } from 'react';

const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  useEffect(() => {
    // Inject the keyframes into the document head (assuming you don't have global CSS)
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes confettiFall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(1440deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Revised: Softer, smoother pastel colors
    const colors = [
      'hsl(48, 93%, 73%)',  // Soft Yellow (Lemon Chiffon vibe)
      'hsl(356, 68%, 71%)', // Soft Red/Pink (Coral Pink)
      'hsl(204, 71%, 74%)', // Soft Blue (Sky Blue)
      'hsl(122, 60%, 70%)', // Soft Green (Mint)
      'hsl(266, 45%, 72%)', // Soft Purple (Lavender)
      'hsl(180, 50%, 75%)', // Soft Cyan (Aqua)
      'hsl(30, 80%, 70%)',  // Soft Orange (Peach)
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 8 + Math.random() * 8,
    }));

    setParticles(newParticles);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            // Added slight transparency for smoothness
            opacity: 0.85, 
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
