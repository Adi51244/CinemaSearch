import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { Favorite as FavoriteIcon, MovieFilter as MovieIcon } from '@mui/icons-material';
import MovieCard from './MovieCard';

const FavoritesList = ({ favorites, onMovieClick, onRemoveFromFavorites }) => {
  if (favorites.length === 0) {
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
        <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h3" gutterBottom>
          No Favorites Yet
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Start building your movie collection! Search for movies and click the heart icon to add them to your favorites.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<MovieIcon />}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
            },
          }}
        >
          Discover Movies
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <FavoriteIcon sx={{ color: '#ff4444', fontSize: '2rem' }} />
        My Favorite Movies ({favorites.length})
      </Typography>
      
      <Grid container spacing={3}>
        {favorites.map((movie) => (
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
              onRemoveFromFavorites={onRemoveFromFavorites}
              isMovieFavorite={true}
              showRemoveButton={true}
            />
          </Grid>
        ))}
      </Grid>

      {favorites.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Your favorites are automatically saved to your browser's local storage
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FavoritesList;