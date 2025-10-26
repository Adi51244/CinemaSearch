import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { MovieFilter as MovieIcon } from '@mui/icons-material';
import MovieCard from './MovieCard';

const MovieGrid = ({ 
  movies, 
  onMovieClick, 
  onAddToFavorites, 
  isMovieFavorite, 
  searchQuery 
}) => {
  if (movies.length === 0 && searchQuery) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          p: 4,
        }}
      >
        <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          No Movies Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          We couldn't find any movies matching "{searchQuery}". Try searching with a different movie title.
        </Typography>
        <Button 
          variant="outlined" 
          size="large"
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Try Another Search
        </Button>
      </Box>
    );
  }

  if (movies.length === 0 && !searchQuery) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          p: 4,
        }}
      >
        <MovieIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h3" gutterBottom>
          Discover Amazing Movies
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Search for your favorite movies above to get started. Find ratings, plots, and save them to your favorites!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Try searching for: "Avengers", "Inception", "Titanic", "The Matrix"
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {movies.length > 0 && (
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Found {movies.length} movie{movies.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={movie.imdbID}
          >
            <MovieCard
              movie={movie}
              onMovieClick={onMovieClick}
              onAddToFavorites={onAddToFavorites}
              isMovieFavorite={isMovieFavorite(movie.imdbID)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;