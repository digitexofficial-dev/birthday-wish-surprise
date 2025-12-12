import { useState } from 'react';
import BirthdayCake from '@/components/BirthdayCake';
import Confetti from '@/components/Confetti';
import MessagePopup from '@/components/MessagePopup';
import MemoriesPage from '@/components/MemoriesPage';
import FinalPage from '@/components/FinalPage';

type PageState = 'cake' | 'popup' | 'memories' | 'final';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('cake');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleCandleBlown = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowPopup(true);
      setCurrentPage('popup');
    }, 1500);
  };

  const handleYesClick = () => {
    setShowConfetti(false);
    setShowPopup(false);
    setCurrentPage('memories');
  };

  const handleNextToFinal = () => {
    setCurrentPage('final');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Message Popup */}
      {showPopup && currentPage === 'popup' && (
        <MessagePopup onYes={handleYesClick} />
      )}

      {/* Pages */}
      {currentPage === 'cake' && (
        <BirthdayCake onCandleBlown={handleCandleBlown} />
      )}

      {currentPage === 'memories' && (
        <MemoriesPage onNext={handleNextToFinal} />
      )}

      {currentPage === 'final' && <FinalPage />}
    </div>
  );
};

export default Index;
