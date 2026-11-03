import { useEffect, useState, useMemo } from 'react';
import './App.css';
import {
  type BreedOption,
  type DogPet,
  fetchDog,
  getBreedOptions,
  soundPlayer,
} from './dogService';

export default function App() {
  const [breeds, setBreeds] = useState<BreedOption[]>([]);
  const [selectedBreedKey, setSelectedBreedKey] = useState<string>('random');
  const [currentDog, setCurrentDog] = useState<DogPet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready when you are.');
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<DogPet[]>([]);
  const [favorites, setFavorites] = useState<DogPet[]>(() => {
    try {
      const saved = localStorage.getItem('mypetapp_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundPlayer.isMuted());
  const [copied, setCopied] = useState<boolean>(false);

  // Load available breeds on mount
  useEffect(() => {
    let isSubscribed = true;
    getBreedOptions()
      .then((list) => {
        if (isSubscribed) {
          setBreeds(list);
        }
      })
      .catch((err) => {
        console.error('Failed to load breed directory:', err);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mypetapp_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore storage errors
    }
  }, [favorites]);

  const selectedBreedOption = useMemo<BreedOption | undefined>(() => {
    if (selectedBreedKey === 'random') return undefined;
    return breeds.find((b) => `${b.breed}__${b.subBreed}` === selectedBreedKey);
  }, [breeds, selectedBreedKey]);

  const isFavorited = useMemo(() => {
    if (!currentDog) return false;
    return favorites.some((f) => f.imageUrl === currentDog.imageUrl);
  }, [favorites, currentDog]);

  const handleFetch = async (overrideOption?: BreedOption) => {
    setIsLoading(true);
    setIsError(false);
    setImageLoaded(false);
    setStatusMessage('Finding your new friend...');

    try {
      const optionToUse = overrideOption !== undefined ? overrideOption : selectedBreedOption;
      const dog = await fetchDog(optionToUse);
      setCurrentDog(dog);
      setStatusMessage('A new friend is here! 🐾');
      soundPlayer.playChime();

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.imageUrl !== dog.imageUrl);
        return [dog, ...filtered].slice(0, 10);
      });
    } catch (err) {
      setIsError(true);
      setStatusMessage(
        err instanceof Error
          ? `${err.message} Please check your connection and try again.`
          : 'Something went wrong while fetching a dog. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (dog: DogPet) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.imageUrl === dog.imageUrl);
      if (exists) {
        return prev.filter((f) => f.imageUrl !== dog.imageUrl);
      } else {
        soundPlayer.playHeart();
        return [dog, ...prev];
      }
    });
  };

  const handleCopyLink = async () => {
    if (!currentDog) return;
    try {
      await navigator.clipboard.writeText(currentDog.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundPlayer.setMuted(nextMuted);
  };

  const handleSelectHistoryDog = (dog: DogPet) => {
    setCurrentDog(dog);
    setImageLoaded(true);
    setStatusMessage(`Viewing ${dog.label}`);
  };

  return (
    <div className="app-container">
      {/* TOPBAR */}
      <header className="topbar">
        <div
          className="wordmark"
          onClick={() => {
            setSelectedBreedKey('random');
            handleFetch(undefined);
          }}
          title="Click to fetch a new friend"
        >
          <span className="wordmark-icon" aria-hidden="true">🐾</span>
          <span>FETCH A FRIEND</span>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="topbar-btn mute-btn"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button
            type="button"
            className="topbar-btn"
            onClick={() => setShowFavoritesModal(true)}
            aria-label="View Saved Favorites"
          >
            <span>❤️ Saved</span>
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="main-content">
        <section className="intro">
          <p className="eyebrow">Your Daily Dose of Dog</p>
          <h1 className="intro-title">
            Meet a new<br />
            <span>kind of friend.</span>
          </h1>
          <p className="description">
            Discover charming dog breeds from around the globe in a single click.
            Learn fun breed traits, save your favorite companions, and find your daily smile.
          </p>

          <div className="controls-group">
            <div className="selector-box">
              <label htmlFor="breed-select" className="selector-label">
                Choose a Breed (or Surprise Me)
              </label>
              <select
                id="breed-select"
                className="breed-select"
                value={selectedBreedKey}
                onChange={(e) => setSelectedBreedKey(e.target.value)}
                disabled={isLoading}
              >
                <option value="random">✨ Any Breed (Surprise Me)</option>
                {breeds.map((b) => (
                  <option key={`${b.breed}__${b.subBreed}`} value={`${b.breed}__${b.subBreed}`}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="fetch-button"
                onClick={() => handleFetch()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span>Fetching pup...</span>
                  </>
                ) : (
                  <>
                    <span className="button-sparkle" aria-hidden="true">✦</span>
                    <span>{currentDog ? 'Fetch another dog' : 'Fetch a dog'}</span>
                    <span className="button-arrow" aria-hidden="true">→</span>
                  </>
                )}
              </button>

              {selectedBreedKey !== 'random' && (
                <button
                  type="button"
                  className="randomize-btn"
                  onClick={() => {
                    setSelectedBreedKey('random');
                    handleFetch(undefined);
                  }}
                  disabled={isLoading}
                >
                  🎲 Random Breed
                </button>
              )}
            </div>
          </div>

          <p className={`status ${isError ? 'error' : ''}`} role="status">
            {statusMessage}
          </p>

          {/* RECENT DOGS STRIP */}
          {history.length > 0 && (
            <div className="history-section">
              <p className="history-heading">Recently Met Friends ({history.length})</p>
              <div className="history-strip">
                {history.map((dog) => (
                  <div
                    key={dog.id}
                    className={`history-item ${currentDog?.id === dog.id ? 'active' : ''}`}
                    onClick={() => handleSelectHistoryDog(dog)}
                    title={dog.label}
                  >
                    <img src={dog.imageUrl} alt={dog.label} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT: DOG CARD */}
        <section className="display-card-wrap">
          {currentDog ? (
            <article className="result-card">
              <div className="photo-wrap">
                {!imageLoaded && (
                  <div className="image-loader" aria-hidden="true">
                    🐶
                  </div>
                )}
                <img
                  src={currentDog.imageUrl}
                  alt={`${currentDog.label} dog`}
                  className={imageLoaded ? 'loaded' : 'loading'}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    setIsError(true);
                    setStatusMessage('Could not load image. Try fetching another!');
                  }}
                />
                <span className="photo-label">YOUR NEW PAL</span>
              </div>

              <div className="card-body">
                <div className="card-header-row">
                  <div>
                    <p className="breed-label">Breed</p>
                    <h2 className="breed-name">{currentDog.label}</h2>
                  </div>
                  <button
                    type="button"
                    className={`fav-btn ${isFavorited ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(currentDog)}
                    title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    {isFavorited ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="fact-box">
                  <p className="fact-title">Breed Insight & Charm</p>
                  <p className="breed-fact">{currentDog.fact}</p>
                </div>

                <div className="card-actions-row">
                  <button
                    type="button"
                    className="card-btn"
                    onClick={handleCopyLink}
                    title="Copy direct photo URL"
                  >
                    {copied ? '✓ Copied URL!' : '🔗 Copy Photo'}
                  </button>

                  <button
                    type="button"
                    className="card-btn primary"
                    onClick={() => handleFetch()}
                    disabled={isLoading}
                  >
                    🔄 Another Pup
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="placeholder-card">
              <div className="placeholder-emoji">🐕</div>
              <h2 className="placeholder-title">No dog fetched yet</h2>
              <p className="placeholder-text">
                Click the <strong>Fetch a dog</strong> button to discover a lovely dog breed and cute photo!
              </p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <span>Made for dog people</span>
          <span className="footer-dot" aria-hidden="true">•</span>
          <span>Powered by Dog CEO API</span>
        </div>
        <span className="footer-tagline">Every dog deserves a warm home 🐾</span>
      </footer>

      {/* FAVORITES MODAL */}
      {showFavoritesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowFavoritesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Saved Friends ({favorites.length})</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowFavoritesModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {favorites.length === 0 ? (
                <div className="empty-favorites">
                  <span>🐶</span>
                  <p>You haven't saved any favorite dogs yet.</p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>
                    Click the ❤️ icon on any dog card to save it here!
                  </p>
                </div>
              ) : (
                <div className="fav-grid">
                  {favorites.map((dog) => (
                    <div key={dog.id} className="fav-card">
                      <img
                        src={dog.imageUrl}
                        alt={dog.label}
                        className="fav-thumb"
                        onClick={() => {
                          handleSelectHistoryDog(dog);
                          setShowFavoritesModal(false);
                        }}
                      />
                      <div className="fav-details">
                        <span className="fav-name" title={dog.label}>
                          {dog.label}
                        </span>
                        <button
                          type="button"
                          className="fav-remove"
                          onClick={() => toggleFavorite(dog)}
                          title="Remove"
                          aria-label={`Remove ${dog.label}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
