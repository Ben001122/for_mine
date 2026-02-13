import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "./config";

function App() {
  const [noLabel, setNoLabel] = useState(config.content.noButtonText);
  const [showHoverPopup, setShowHoverPopup] = useState(false);
  const [showProsConsPopup, setShowProsConsPopup] = useState(false);
  const [hoveredOnce, setHoveredOnce] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [view, setView] = useState("home");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [giftsOpened, setGiftsOpened] = useState(new Set());
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  // Media player state
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef(null);

  // Falling items effect
  useEffect(() => {
    const createFallingItem = () => {
      const container = document.querySelector('.falling-items');
      if (!container) return;

      const item = document.createElement('div');
      item.className = 'falling-item';
      const items = config.animations?.fallingItems || ["💖", "💕", "✨"];
      item.textContent = items[Math.floor(Math.random() * items.length)];
      item.style.left = Math.random() * 100 + '%';
      item.style.animationDuration = (Math.random() * 3 + 2) + 's';
      item.style.fontSize = (Math.random() * 20 + 12) + 'px';
      container.appendChild(item);

      setTimeout(() => item.remove(), 5000);
    };

    const interval = setInterval(createFallingItem, 400);
    return () => clearInterval(interval);
  }, []);

  const songs = useMemo(() => Array.isArray(config.songs) ? config.songs : (config.songs?.playlist || []), []);
  const slides = useMemo(() => config.prosCons || [], []);
  const currentSong = useMemo(() => songs[currentSongIndex] || {}, [songs, currentSongIndex]);

  const handleNoEnter = useCallback(() => {
    if (!hoveredOnce) {
      setShowHoverPopup(true);
      setHoveredOnce(true);
    } else {
      setNoLabel("YESSS! 💖");
    }
  }, [hoveredOnce]);

  const handleNoLeave = useCallback(() => {
    if (hoveredOnce) {
      setNoLabel(config.content.noButtonText);
    }
  }, [hoveredOnce]);

  const closeHoverPopup = useCallback(() => {
    setShowHoverPopup(false);
    setNoLabel(config.content.noButtonText);
  }, []);

  const openProsConsPopup = useCallback(() => {
    setShowHoverPopup(false);
    setShowProsConsPopup(true);
  }, []);

  const closeProsConsPopup = useCallback(() => setShowProsConsPopup(false), []);

  const nextSlide = useCallback(() => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleGiftClick = useCallback((giftType) => setGiftsOpened((prev) => new Set(prev).add(giftType)), []);
  const allGiftsOpened = useMemo(() => giftsOpened.size === 3, [giftsOpened]);
  const handleGift1Click = useCallback(() => { handleGiftClick("songs"); setView("songs"); }, [handleGiftClick]);
  const handleGift2Click = useCallback(() => { handleGiftClick("letter"); setView("letter"); }, [handleGiftClick]);
  const handleGift3Click = useCallback(() => { handleGiftClick("photos"); setView("photos"); }, [handleGiftClick]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(console.error);
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
      setIsPlaying(false);
    }
  }, [songs.length]);

  const handlePrevious = useCallback(() => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setIsPlaying(false);
    }
  }, [songs.length]);

  const handleSongSelect = useCallback((index) => {
    setCurrentSongIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, []);

  const handleTimeUpdate = useCallback(() => audioRef.current && setCurrentTime(audioRef.current.currentTime), []);
  const handleLoadedMetadata = useCallback(() => audioRef.current && setDuration(audioRef.current.duration), []);
  const handleEnded = useCallback(() => handleNext(), [handleNext]);

  const handleProgressClick = useCallback((e) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      audioRef.current.currentTime = (clickX / rect.width) * duration;
    }
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  }, []);

  const createCelebration = useCallback(() => {
    const container = document.querySelector('.falling-items');
    if (!container) return;
    const items = config.animations?.celebrationItems || ["💖", "🎉", "✨"];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = items[Math.floor(Math.random() * items.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.animationDuration = `${Math.random() * 2 + 1}s`;
        item.style.fontSize = `${Math.random() * 25 + 15}px`;
        container.appendChild(item);
        setTimeout(() => item.remove(), 3000);
      }, i * 50);
    }
  }, []);

  const couplePhotos = useMemo(() => config.couplePhotos || config.photos?.gallery || [], []);

  if (view === "success") {
    return (
      <div className="valentine-root success">
        <div className="falling-items"></div>
        <div className="card success-card">
          <h1 className="yay">{config.content.successMessage}</h1>
          <p className="subtitle small">{config.content.successSubtitle}</p>
          <div className="image-card">
            <img src={config.media?.loveBearGif || config.media?.loveBearGif} alt="love you" loading="lazy" />
          </div>
          <motion.div
            className="love-text-container"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}>
            <motion.h2
              className="love-text"
              style={{ fontFamily: "'Great Vibes', cursive" }} // <-- Classy Font Applied Here
              animate={{ scale: [1, 1.05, 1], }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              I Love You, <span style={{ fontFamily: "inherit", fontSize: "0.9em" }}>Thangame!</span>
            </motion.h2>
          </motion.div>
          <div className="secret-envelope" onClick={() => setShowSecretMessage(!showSecretMessage)}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
              <span style={{ fontSize: '3em' }}>💌</span>
              <div className="envelope-hint">✨ Click to read my secret message ✨</div>
            </motion.div>
          </div>
          <AnimatePresence>
            {showSecretMessage && (
              <motion.div className="secret-message-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p><strong>{config.secretMessage?.title}</strong></p>
                {config.secretMessage?.content?.map((line, idx) => (<p key={idx}>{line}</p>))}
                <button className="close-envelope" onClick={() => setShowSecretMessage(false)}>
                  Close Letter 💌
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ height: 20 }} />
          <motion.button className="btn romantic-gift-btn" onClick={() => { setView("gifts"); createCelebration(); }} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
            {config.content.giftsSubtitle || "Open Your Gifts 🎁"}
          </motion.button>
        </div>
      </div>
    );
  }

  if (view === "gifts") {
    const giftEntries = Object.entries(config.gifts || {});
    const giftHandlers = [handleGift1Click, handleGift2Click, handleGift3Click];
    const giftTypes = ["songs", "letter", "photos"];
    return (
      <div className="valentine-root gifts">
        <div className="falling-items"></div>
        <div className="card gifts-card">
          <h1 className="yay">{config.content.giftsTitle}</h1>
          <div className="gifts-container">
            {giftEntries.map(([key, gift], index) => (
              <motion.div key={key} className={`gift-card ${giftsOpened.has(giftTypes[index]) ? 'opened' : ''}`} onClick={giftHandlers[index]} whileHover={{ scale: 1.05, y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <h3 className="gift-title">{gift.title}</h3>
                <div className="gift-image"><img src={gift.image} alt={gift.title} loading="lazy" /></div>
                <p className="subtitle small">{gift.description}</p>
              </motion.div>
            ))}
          </div>

          {allGiftsOpened ? (
            <motion.div className="all-gifts-opened" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="love-you-bear-container"><img src={config.media?.loveYouBearGif || config.media?.loveYouBearGif} alt="love you bear" loading="lazy" /></div>
              <p 
                className="all-gifts-text" 
                style={{ 
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '1.9em',
                  lineHeight: '1.6' 
                }}
              >
                Yayyyy!! You opened all the gifts, Thangame! 💕<br /><span style={{ fontSize: '1.2em' }}>I Love You Sooooo Muchhhhhh! 🥰</span>
              </p>
            </motion.div>
          ) : (
            <><div style={{ height: 15 }} /><button className="btn yes" onClick={() => setView("success")}>{config.navigation?.backToLove || "💖 Back to Love"}</button></>
          )}
        </div>
      </div>
    );
  }

  if (view === "songs") {
    return (
      <div className="valentine-root songs"><div className="falling-items"></div><div className="card songs-card"><h1 className="yay">{config.content.songsTitle}</h1><p className="subtitle">{config.content.songsSubtitle}</p><div className="media-player-container"><motion.div className="media-player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="album-art-section"><motion.div className="album-art-frame" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}><div className="album-art"><img src={currentSong.cover} alt="Album Cover" loading="lazy" className="album-image" onError={(e) => { e.target.src = '/assets/album-covers/default.jpg'; }} /></div></motion.div><div className="album-info"><h2 className="album-title">{currentSong.album || "Album"}</h2><p className="album-artist">{currentSong.artist || "Artist"}</p></div></div><div className="media-controls"><div className="current-song-info"><h3 className="current-title">{currentSong.title || "Song Title"}</h3><p className="current-artist">{currentSong.memory || currentSong.emotion || ""}</p></div>{currentSong.story && (<div className="song-story"><p>{currentSong.story}</p></div>)}<div className="progress-section"><div className="time-display"><span className="current-time">{formatTime(currentTime)}</span><span className="duration">{formatTime(duration)}</span></div><div className="progress-bar-container" onClick={handleProgressClick}><div className="progress-bar"><div className="progress-fill" style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }} /></div></div></div><div className="control-buttons"><motion.button className="control-btn" onClick={handlePrevious} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={config.tooltips?.previous || "Previous"}>⏪</motion.button><motion.button className="play-btn-large" onClick={handlePlayPause} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={isPlaying ? (config.tooltips?.pause || "Pause") : (config.tooltips?.play || "Play")}>{isPlaying ? "⏸️" : "▶️"}</motion.button><motion.button className="control-btn" onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={config.tooltips?.next || "Next"}>⏩</motion.button></div><div className="volume-section"><span className="volume-icon">{volume > 0.5 ? "🔊" : volume > 0 ? "🔉" : "🔇"}</span><div className="volume-bar-container"><input type="range" className="volume-bar" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} /></div></div></div></motion.div><div className="song-playlist"><h3 className="playlist-title">🎵 Our Musical Journey</h3><div className="playlist-container">{songs.map((song, index) => (<motion.div key={song.id || index} className={`playlist-item ${index === currentSongIndex ? "active" : ""}`} onClick={() => handleSongSelect(index)} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}><div className="playlist-item-left"><div className="playlist-number">{String(index + 1).padStart(2, "0")}</div><div className="playlist-info"><h4 className="playlist-title-text">{song.title}</h4><p className="playlist-artist">{song.memory || song.emotion || ""}</p></div></div><div className="playlist-duration">{song.duration}</div></motion.div>))}</div></div></div>{currentSong.audio && (<audio ref={audioRef} src={currentSong.audio} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} />)}<div style={{ height: 15 }} /><button className="btn yes" onClick={() => setView("gifts")}>{config.navigation?.backToGifts || "🎁 Back to Gifts"}</button></div></div>
    );
  }

  if (view === "photos") {
    return (
      <div className="valentine-root photos"><div className="falling-items"></div><div className="card photos-card"><h1 className="yay">{config.content.photosTitle}</h1><p className="subtitle">{config.content.photosSubtitle}</p><div className="photos-grid">{couplePhotos.map((photo, index) => (<motion.div key={photo.id || index} className="photo-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05, rotate: Math.random() > 0.5 ? 2 : -2 }}><div className={`photo-frame vintage-${(index % 6) + 1}`}><img src={photo.image} alt={photo.memory || `Memory ${index + 1}`} loading="lazy" onError={(e) => { e.target.src = '/assets/couple_photo/placeholder.jpg'; }} /></div><p className="photo-caption">{photo.caption}</p>{photo.date && <small style={{ color: 'var(--text-secondary)' }}>{photo.date}</small>}</motion.div>))}</div><div style={{ height: 15 }} /><button className="btn yes" onClick={() => setView("gifts")}>{config.navigation?.backToGifts || "🎁 Back to Gifts"}</button></div></div>
    );
  }

  if (view === "letter") {
    return (
      <div className="valentine-root letter"><div className="falling-items"></div><div className="card letter-card"><h1 className="yay">{config.content.letterTitle}</h1><motion.div className="envelope-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><motion.div className="envelope" onClick={() => setEnvelopeOpen(!envelopeOpen)} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}><div className="envelope-flap"><div className="envelope-triangle"></div></div><div className="envelope-body"><div className="envelope-seal"><span className="heart-symbol">{config.media?.envelopeSeal || "💖"}</span></div></div></motion.div><AnimatePresence>{envelopeOpen && (<motion.div className="letter-paper" initial={{ rotateX: 90, opacity: 0, y: -20 }} animate={{ rotateX: 0, opacity: 1, y: 0 }} exit={{ rotateX: 90, opacity: 0, y: -20 }}><div className="letter-content"><h2 className="letter-title">{config.letter?.title || "My Dearest..."}</h2>{(config.letter?.content || []).map((p, i) => (<p key={i} className="letter-text">{p}</p>))}<p className="letter-text" style={{ marginTop: '20px' }}>{config.letter?.closing}</p><p className="letter-signature">{config.letter?.signature}</p></div></motion.div>)}</AnimatePresence></motion.div><div style={{ height: 15 }} /><button className="btn yes" onClick={() => setView("gifts")}>{config.navigation?.backToGifts || "🎁 Back to Gifts"}</button></div></div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} className="valentine-root" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <div className="falling-items"></div>
        <motion.div className="card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: "backOut" }}>
          <motion.img src={config.media?.mainBearGif} alt="cute bear" className="card-image" loading="lazy" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} onError={(e) => { e.target.style.display = 'none'; }} />
          <motion.h1 className="title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <span className="name">{config.names?.nickname?.toUpperCase() || "THANGAME"},</span>
            <span className="ask">{config.content?.title || config.content?.mainTitle}</span>
          </motion.h1>
          <p className="subtitle">{config.content?.subtitle}</p>
          <motion.div className="choices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <motion.button className="btn yes" onClick={() => { setView("success"); createCelebration(); }} whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              {config.content?.yesButtonText || "YES! 💖"}
            </motion.button>
            <motion.button className="btn no" onMouseEnter={handleNoEnter} onMouseLeave={handleNoLeave} onClick={handleNoEnter}  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              {noLabel}
            </motion.button>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {showHoverPopup && (
            <motion.div className="overlay" onClick={closeHoverPopup} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="popup" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <button className="close-btn" onClick={closeHoverPopup}>✕</button>
                <p className="popup-text">Wait, Thangame! 😢 Let me tell you why you should say YES...</p>
                <motion.button className="btn okay-btn" onClick={openProsConsPopup} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Okay, convince me 😏</motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showProsConsPopup && slides.length > 0 && (
            <motion.div className="overlay" onClick={closeProsConsPopup} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="pros-cons-popup" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <button className="close-btn" onClick={closeProsConsPopup}>✕</button>
                <h2 className="pros-cons-title">{config.content?.prosConsTitle || "Why You Should Say YES 💖"}</h2>
                <div className="cards-container">
                  <motion.div className="card pros-card" whileHover={{ y: -5 }}>
                    <h3 className="card-title">💖 Why YES</h3>
                    <div className="pros-list">
                      <div className="pro-item">
                        {slides[currentSlide]?.gif && (<img src={slides[currentSlide].gif} alt="pro" className="pro-gif" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />)}
                        <p className="pro-text">{slides[currentSlide]?.icon} {slides[currentSlide]?.text}</p>
                      </div>
                    </div>
                    <div className="pros-nav">
                      <motion.button className="nav-btn" onClick={prevSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>◀</motion.button>
                      <span className="slide-indicator">{currentSlide + 1} / {slides.length}</span>
                      <motion.button className="nav-btn" onClick={nextSlide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>▶</motion.button>
                    </div>
                  </motion.div>
                  <motion.div className="card cons-card" whileHover={{ y: -5 }}>
                    <h3 className="card-title">❌ Why NO</h3>
                    <div className="cons-content">
                      {config.media?.childGif && (<img src={config.media.childGif} alt="no cons" className="cons-gif" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />)}
                      <p className="cons-text">{config.content?.prosConsSubtitle || "Nothing!!! 🥰"}</p>
                    </div>
                  </motion.div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <motion.button className="btn yes" onClick={() => { closeProsConsPopup(); setView("success"); createCelebration(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Fine, I'll say YES! 💖</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;