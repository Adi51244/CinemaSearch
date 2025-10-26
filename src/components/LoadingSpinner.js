import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { MovieFilter as MovieIcon } from '@mui/icons-material';

const LoadingSpinner = ({ message = "Searching for amazing movies..." }) => {
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box sx={{ position: 'relative', mb: 3 }}>
          <CircularProgress
            size={80}
            thickness={3}
            sx={{
              color: '#667eea',
              animationDuration: '1.5s',
            }}
          />
          <MovieIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 32,
              color: '#764ba2',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
                '50%': {
                  opacity: 0.7,
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
              },
            }}
          />
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            mb: 1,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {message}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Please wait while we fetch the latest movie data...
        </Typography>

        {/* Animated dots */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#667eea',
              fontWeight: 'bold',
              animation: 'dots 1.5s ease-in-out infinite',
              '@keyframes dots': {
                '0%, 20%': {
                  color: 'rgba(102, 126, 234, 1)',
                  textShadow: '0.25em 0 0 rgba(102, 126, 234, 1), 0.5em 0 0 rgba(102, 126, 234, 0.3), 0.75em 0 0 rgba(102, 126, 234, 0.3)',
                },
                '40%': {
                  color: 'rgba(102, 126, 234, 0.3)',
                  textShadow: '0.25em 0 0 rgba(102, 126, 234, 1), 0.5em 0 0 rgba(102, 126, 234, 1), 0.75em 0 0 rgba(102, 126, 234, 0.3)',
                },
                '60%': {
                  color: 'rgba(102, 126, 234, 0.3)',
                  textShadow: '0.25em 0 0 rgba(102, 126, 234, 0.3), 0.5em 0 0 rgba(102, 126, 234, 1), 0.75em 0 0 rgba(102, 126, 234, 1)',
                },
                '80%, 100%': {
                  color: 'rgba(102, 126, 234, 1)',
                  textShadow: '0.25em 0 0 rgba(102, 126, 234, 0.3), 0.5em 0 0 rgba(102, 126, 234, 0.3), 0.75em 0 0 rgba(102, 126, 234, 1)',
                },
              },
            }}
          >
            • • •
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;