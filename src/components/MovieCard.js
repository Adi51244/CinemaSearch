import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const MovieCard = ({ 
  movie, 
  onMovieClick, 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  isMovieFavorite,
  showRemoveButton = false 
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isMovieFavorite) {
      onRemoveFromFavorites(movie.imdbID);
    } else {
      onAddToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    onMovieClick(movie);
  };

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster';

  const getImdbRating = () => {
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
      return parseFloat(movie.imdbRating) / 2; // Convert to 5-star scale
    }
    return 0;
  };

  const getYear = () => {
    return movie.Year || movie.Released?.split(' ')[2] || 'Unknown';
  };

  const getGenre = () => {
    if (movie.Genre && movie.Genre !== 'N/A') {
      return movie.Genre.split(',')[0].trim(); // Show only first genre
    }
    return 'Unknown';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={posterUrl}
          alt={movie.Title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Favorite button overlay */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: isMovieFavorite ? '#ff4444' : '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
          onClick={handleFavoriteClick}
        >
          {isMovieFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Info button overlay */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <InfoIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.6em',
          }}
        >
          {movie.Title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={getYear()} 
            size="small" 
            sx={{ 
              mr: 1,
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
              color: '#ffffff',
              fontWeight: 500,
            }} 
          />
          <Chip 
            label={getGenre()} 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(118, 75, 162, 0.2)',
              color: '#ffffff',
              fontWeight: 500,
            }} 
          />
        </Box>

        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Rating
              value={getImdbRating()}
              precision={0.1}
              size="small"
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {movie.imdbRating}/10
            </Typography>
          </Box>
        )}

        {movie.Plot && movie.Plot !== 'N/A' && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {movie.Plot}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;