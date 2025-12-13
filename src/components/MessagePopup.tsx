import { useState } from 'react';

interface MessagePopupProps {
  onYes: () => void;
}

const MessagePopup = ({ onYes }: MessagePopupProps) => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noClicks, setNoClicks] = useState(0);

  const handleNoClick = () => {
    const newX = (Math.random() - 0.5) * 200;
    const newY = (Math.random() - 0.5) * 100;
    setNoButtonPosition({ x: newX, y: newY });
    setYesScale(prev => Math.min(prev + 0.15, 2));
    setNoClicks(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-background/80 backdrop-blur-sm">
      <div className="bg-card p-8 rounded-2xl shadow-2xl text-center animate-pop-in glow-sage max-w-md mx-4">
        <div className="text-4xl mb-4">💌</div>
        <h2 className="font-romantic text-3xl text-sage-dark mb-2">
          Ada notif buat kamu
        </h2>
        <p className="text-foreground/80 mb-6 font-body">
          Mau di buka???
        </p>
        
        <div className="flex gap-4 justify-center items-center relative min-h-[60px]">
          <button
            onClick={onYes}
            className="px-8 py-3 bg-gradient-to-r from-sage to-sage-dark text-primary-foreground rounded-full font-body font-semibold transition-all duration-300 hover:shadow-lg glow-sage"
            style={{ 
              transform: `scale(${yesScale})`,
              zIndex: 10,
            }}
          >
            Maudeh
          </button>
          
          <button
            onClick={handleNoClick}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-full font-body transition-all duration-300 hover:bg-secondary/80"
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
              opacity: Math.max(0.3, 1 - noClicks * 0.15),
              fontSize: `${Math.max(0.7, 1 - noClicks * 0.1)}rem`,
            }}
          >
            mok, gamau
          </button>
        </div>

        {noClicks >= 3 && (
          <p className="mt-4 text-muted-foreground text-sm animate-fade-in-up">
            Ayodong, masih ngambek?
          </p>
        )}
      </div>
    </div>
  );
};

export default MessagePopup;
