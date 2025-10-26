import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
  AttachMoney as BoxOfficeIcon,
} from '@mui/icons-material';

const MovieModal = ({
  movie,
  open,
  onClose,
  onAddToFavorites,
  onRemoveFromFavorites,
  isMovieFavorite,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!movie) return null;

  const handleFavoriteClick = () => {
    if (isMovieFavorite) {
      onRemoveFromFavorites(movie.imdbID);
    } else {
      onAddToFavorites(movie);
    }
  };

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster';

  const getImdbRating = () => {
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
      return parseFloat(movie.imdbRating) / 2;
    }
    return 0;
  };

  const formatRuntime = (runtime) => {
    if (!runtime || runtime === 'N/A') return 'Unknown';
    return runtime;
  };

  const formatBoxOffice = (boxOffice) => {
    if (!boxOffice || boxOffice === 'N/A') return 'Not Available';
    return boxOffice;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: fullScreen ? 0 : '16px',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Movie Poster */}
            <Box
              sx={{
                flex: { xs: 'none', md: '0 0 300px' },
                height: { xs: 300, md: 450 },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={posterUrl}
                alt={movie.Title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: { xs: 0, md: '16px 0 0 16px' },
                }}
              />
              
              {/* Favorite overlay on poster */}
              <IconButton
                onClick={handleFavoriteClick}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: isMovieFavorite ? '#ff4444' : '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {isMovieFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Movie Details */}
            <Box sx={{ flex: 1, p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, pr: 4 }}>
                {movie.Title}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={movie.Year} 
                  icon={<CalendarIcon />}
                  sx={{ 
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: '#ffffff',
                  }} 
                />
                <Chip 
                  label={formatRuntime(movie.Runtime)} 
                  icon={<AccessTimeIcon />}
                  sx={{ 
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    color: '#ffffff',
                  }} 
                />
                {movie.Language && movie.Language !== 'N/A' && (
                  <Chip 
                    label={movie.Language} 
                    icon={<LanguageIcon />}
                    sx={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      color: '#ffffff',
                    }} 
                  />
                )}
              </Box>

              {movie.Genre && movie.Genre !== 'N/A' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Genres
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie.Genre.split(',').map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre.trim()}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: '#ffffff',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2 }}>
                    Rating:
                  </Typography>
                  <Rating
                    value={getImdbRating()}
                    precision={0.1}
                    readOnly
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2">
                    {movie.imdbRating}/10 IMDb
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

              {movie.Plot && movie.Plot !== 'N/A' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Plot
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {movie.Plot}
                  </Typography>
                </Box>
              )}

              {movie.Director && movie.Director !== 'N/A' && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                    Director: 
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {movie.Director}
                  </Typography>
                </Box>
              )}

              {movie.Writer && movie.Writer !== 'N/A' && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                    Writer: 
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {movie.Writer}
                  </Typography>
                </Box>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                    Cast: 
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {movie.Actors}
                  </Typography>
                </Box>
              )}

              {movie.BoxOffice && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                    Box Office: 
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {formatBoxOffice(movie.BoxOffice)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleFavoriteClick}
            startIcon={isMovieFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            variant={isMovieFavorite ? "contained" : "outlined"}
            sx={{
              background: isMovieFavorite ? 'linear-gradient(45deg, #ff4444, #ff6666)' : 'transparent',
              borderColor: isMovieFavorite ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: isMovieFavorite 
                  ? 'linear-gradient(45deg, #ff3333, #ff5555)' 
                  : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MovieModal;