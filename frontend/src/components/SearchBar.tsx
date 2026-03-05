import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Search, School, Article, VideoLibrary } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search courses, topics...' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayDebounce = setTimeout(() => {
        performSearch();
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setOpen(false);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setOpen(true);
      
      const response = await axios.get(
        `${API_BASE_URL}/courses`,
        getAuthHeaders()
      );
      
      const courses = response.data.data || response.data || [];
      
      // Filter courses based on search query
      const filtered = courses.filter((course: any) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (courseId: number) => {
    setOpen(false);
    setSearchQuery('');
    navigate(`/taxpayer/course/${courseId}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: 400,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          }
        }}
      />

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { position: 'fixed', top: 100 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Search />
            <Typography variant="h6">Search Results</Typography>
            {loading && <CircularProgress size={20} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          {searchResults.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchQuery.length >= 2 
                  ? 'No courses found. Try different keywords.'
                  : 'Type at least 2 characters to search'}
              </Typography>
            </Box>
          ) : (
            <List>
              {searchResults.map((course) => (
                <ListItem key={course.id} disablePadding>
                  <ListItemButton onClick={() => handleResultClick(course.id)}>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {course.title}
                          </Typography>
                          <Chip 
                            label={course.category} 
                            size="small" 
                            color="primary"
                          />
                          <Chip 
                            label={course.difficulty} 
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {course.description}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
