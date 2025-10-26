import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { MovieFilter as MovieIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import theme from './theme';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import FavoritesList from './components/FavoritesList';
import MovieModal from './components/MovieModal';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (searchResults) => {
    setMovies(searchResults);
    setCurrentTab(0); // Switch to movies tab after search
  };

  const handleAddToFavorites = (movie) => {
    if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  const handleRemoveFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.imdbID !== movieId));
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const isMovieFavorite = (movieId) => {
    return favorites.some(fav => fav.imdbID === movieId);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <MovieIcon sx={{ mr: 2, fontSize: 32, color: '#ffffff' }} />
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                flexGrow: 1, 
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                background: 'none',
                WebkitTextFillColor: '#ffffff'
              }}
            >
              CinemaSearch
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <SearchBar 
              onSearch={handleSearch} 
              setLoading={setLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ffffff',
                  height: 3,
                  borderRadius: '2px',
                },
              }}
            >
              <Tab 
                icon={<MovieIcon />} 
                label={`Movies (${movies.length})`} 
                iconPosition="start"
              />
              <Tab 
                icon={<FavoriteIcon />} 
                label={`Favorites (${favorites.length})`} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {loading && <LoadingSpinner />}

          {!loading && (
            <>
              {currentTab === 0 && (
                <MovieGrid
                  movies={movies}
                  onMovieClick={handleMovieClick}
                  onAddToFavorites={handleAddToFavorites}
                  isMovieFavorite={isMovieFavorite}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === 1 && (
                <FavoritesList
                  favorites={favorites}
                  onMovieClick={handleMovieClick}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                />
              )}
            </>
          )}

          <MovieModal
            movie={selectedMovie}
            open={modalOpen}
            onClose={handleModalClose}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            isMovieFavorite={selectedMovie ? isMovieFavorite(selectedMovie.imdbID) : false}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;