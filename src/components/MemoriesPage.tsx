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
      url: "https://images.uns",
      caption: "One of the best things that had happened to me", // Edit this caption
    },
    {
      url: "https://photos.app.goo.gl/ahu1AdkzqNEWTV9w7",
      caption: "test", // Edit this caption
    },
    {
      url: "httpsp",
      caption: "Waktu kita makan pizza bareng", // Edit this caption
    },
    {
      url: "ht",
      caption: "Terakhir kali kita sempet ketemu", // Edit this caption
    },
  ];

  // ============================================
  // 📝 EDIT YOUR MESSAGE HERE
  // Write your heartfelt message to your girlfriend below
  // ============================================
  const loveMessage = `
    Haloo wkwk maafin aku ya, aku hari ini baru sempat finishing program ini, aku telat,
    bikin kamu kecewa dan mungkin aku keliatan ga peduli, but its not true

    Happy 18th Birthday to the best thing that ever happened to me 🎂

    Every moment with you has been a beautiful adventure. From our first meeting to today, 
    you've filled my life with so much joy, laughter, and love.

    The things you achieved, the things you have gone through this year is a lot and its awesome,
    yeah it's a lot I know, I feel you and i'm so proud of you, cause you're amazing. The things you
    achieved this year makes me so proud of you, banyak banget dan kamu keren banget. you successfully gone 
    through 2025, gone through your problems like a champ. dont worry though there will be another and another 
    next year and so on hahah, but thats life for you and its okay, i think

    don't forget to cheer up, there's more to life and more problems and joy to catch up to in the future.
    You are my sunshine on cloudy days and my comfort in every storm, and I hope you could feel the same way
    with me.

    As you turn 18, I want you to know that I'm so grateful to have you in my life. 
    You make everything better just by being you.

    I'm sorry of all my actions that you don't like, wether its intentional or not. maafin aku kalau selama ini
    I haven't been a good partner for you.

    Maafin aku untuk hari ini ya cantik, happiest birthday for you, wish you all the best and I love you.
    tungguin hadiah dari aku yang nyusul kesana yaa

    - Presented to you by me, made with typescript & css, aku udah ngerjain project ini dari lumayan lama dan begadang juga, ada 2 project 
    lainnya yang aku kasih liat nanti dari phyton. tapi hari ini masih ada bug dan gatau kenapa ada masalah yang lain juga (nanti aku ceritain), 
    dan foto2 kita ada di hp lamaku semua jadi aku gabisa export ke program ini :/, dan tadi ribet banget waktu mau ngeattach foto2 corrupt terus..

    maafin aku ya, aku tadi juga belum sempet ngefinalisasiin ini semua. aku mungkin bakal ketiduran karena aku belum sempat istirahat
    sama sekali dan kurang tidur banget, kabarin aku ya nanti, dari kemarin belum sempet ngobrol. 
    aku tadi niatnya mau pura2 lupa ke kamu dan surprise gitu nanti/nanti malemnya...
  `;
  // ============================================
  // END OF EDITABLE SECTION
  // ============================================

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="font-romantic text-5xl md:text-6xl text-sage-dark text-center mb-8 text-glow animate-fade-in-up">
          Happy b-day Andrarirurero
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
            👊
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage;
