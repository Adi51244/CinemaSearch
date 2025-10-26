import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Alert, 
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Fade
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from 'axios';

const SearchBar = ({ onSearch, setLoading, searchQuery, setSearchQuery }) => {
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const suggestionTimeoutRef = useRef(null);

  // You can get a free API key from http://www.omdbapi.com/apikey.aspx
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'f5597186'; // Replace YOUR_API_KEY_HERE with your actual key

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  // Fetch suggestions as user types
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2 || justSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&type=movie`);
      
      if (response.data.Response === 'True') {
        const limitedSuggestions = response.data.Search.slice(0, 5); // Limit to 5 suggestions
        setSuggestions(limitedSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounce suggestions to avoid too many API calls
  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [searchQuery, justSelected]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError('Please enter a movie name to search');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&type=movie`);
      
      if (response.data.Response === 'True') {
        // Fetch detailed information for each movie
        const moviesWithDetails = await Promise.all(
          response.data.Search.map(async (movie) => {
            try {
              const detailResponse = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`);
              return detailResponse.data.Response === 'True' ? detailResponse.data : movie;
            } catch (error) {
              console.error('Error fetching movie details:', error);
              return movie;
            }
          })
        );
        
        onSearch(moviesWithDetails);
      } else {
        setError(response.data.Error || 'No movies found. Please try a different search term.');
        onSearch([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search movies. Please check your internet connection and try again.');
      onSearch([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setError('');
    setSuggestions([]);
    setShowSuggestions(false);
    setJustSelected(false);
    onSearch([]);
  };

  const handleSuggestionClick = (suggestion) => {
    // Clear any existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    
    // Immediately hide suggestions
    setJustSelected(true);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Set the search query and perform search
    setSearchQuery(suggestion.Title);
    handleSearch(suggestion.Title);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    suggestionTimeoutRef.current = setTimeout(() => {
      if (!justSelected) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for movies... (e.g., Avengers, Inception, Titanic)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (justSelected) {
              setJustSelected(false);
            }
          }}
          onKeyPress={handleKeyPress}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          sx={{
            mb: error ? 2 : 0,
            '& .MuiOutlinedInput-root': {
              fontSize: '1.1rem',
              padding: '4px',
              color: '#ffffff',
              '& input': {
                color: '#ffffff !important',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset',
                  WebkitTextFillColor: '#ffffff',
                },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton 
                  onClick={() => handleSearch(searchQuery)}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClear}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      {/* Movie Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && !justSelected && (
        <Fade in={showSuggestions && !justSelected}>
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 0.5,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            <List sx={{ py: 0 }}>
              {suggestions.map((movie, index) => (
                <ListItem
                  key={movie.imdbID}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(movie);
                  }}
                  sx={{
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={movie.Poster !== 'N/A' ? movie.Poster : ''}
                      alt={movie.Title}
                      sx={{ 
                        width: 40, 
                        height: 60, 
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      🎬
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {movie.Title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {movie.Year} • {movie.Type}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      )}

      {/* Loading indicator for suggestions */}
      {isLoadingSuggestions && searchQuery.length >= 2 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 0.5,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Loading suggestions...
          </Typography>
        </Paper>
      )}
      
      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            mt: 2,
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            '& .MuiAlert-message': {
              color: '#ffffff',
            },
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SearchBar;