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
    // Inject the keyframes into the document head
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

    const colors = [
      '#FF0', // Yellow
      '#F00', // Red
      '#00F', // Blue
      '#0F0', // Green
      '#800080', // Purple
    ];
    
    // Using hex codes for simplicity as the HSL variables might be undefined
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 8 + Math.random() * 8,
    }));

    setParticles(newParticles);
    
    // Cleanup the style tag on component unmount
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
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
