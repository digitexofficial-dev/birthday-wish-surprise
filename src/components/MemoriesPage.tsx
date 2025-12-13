interface MemoriesPageProps {
  onNext: () => void;
}

const MemoriesPage = ({ onNext }: MemoriesPageProps) => {
  // ============================================
  // 📝 EDIT YOUR PHOTOS HERE
  // Replace these placeholder URLs with your actual photo URLs
  // You can use URLs from Google Photos, Imgur, or any image hosting
  // ============================================
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop",
      caption: "Our first date 💕", // Edit this caption
    },
    {
      url: "https://imgur.com/a/jTNjP83",
      caption: "test", // Edit this caption
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop",
      caption: "Adventures together 🌟", // Edit this caption
    },
    {
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop",
      caption: "Making memories 💖", // Edit this caption
    },
  ];

  // ============================================
  // 📝 EDIT YOUR MESSAGE HERE
  // Write your heartfelt message to your girlfriend below
  // ============================================
  const loveMessage = `
    My dearest love,

    Happy 19th Birthday! 🎂

    Every moment with you has been a beautiful adventure. From our first meeting to today, 
    you've filled my life with so much joy, laughter, and love.

    I cherish every smile you give me, every laugh we share, and every quiet moment we spend together. 
    You are my sunshine on cloudy days and my comfort in every storm.

    As you turn 19, I want you to know that I'm so grateful to have you in my life. 
    You make everything better just by being you.

    Here's to many more birthdays together, many more adventures, 
    and a lifetime of love and happiness.

    I love you more than words can say. 💕

    Forever yours,
    [Your Name]
  `;
  // ============================================
  // END OF EDITABLE SECTION
  // ============================================

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="font-romantic text-5xl md:text-6xl text-sage-dark text-center mb-8 text-glow animate-fade-in-up">
          Our Precious Memories
        </h1>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-square">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-foreground text-sm font-body">{photo.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Love Message */}
        <div 
          className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-sage/20 animate-fade-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="text-center mb-6">
            <span className="text-4xl">💌</span>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/90 font-body text-lg leading-relaxed whitespace-pre-line text-center">
              {loveMessage}
            </p>
          </div>
        </div>

        {/* Next Button */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <button
            onClick={onNext}
            className="px-12 py-4 bg-gradient-to-r from-sage to-sage-dark text-primary-foreground rounded-full font-body font-semibold text-lg transition-all duration-300 hover:scale-105 glow-sage"
          >
            Continue to Final Surprise ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage;
