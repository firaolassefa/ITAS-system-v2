import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';

interface BookmarkButtonProps {
  courseId: number;
  size?: 'small' | 'medium' | 'large';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ courseId, size = 'medium' }) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Load bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('itas_bookmarks') || '[]');
    setBookmarked(bookmarks.includes(courseId));
  }, [courseId]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const bookmarks = JSON.parse(localStorage.getItem('itas_bookmarks') || '[]');
    
    if (bookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter((id: number) => id !== courseId);
      localStorage.setItem('itas_bookmarks', JSON.stringify(updated));
      setBookmarked(false);
    } else {
      // Add bookmark
      bookmarks.push(courseId);
      localStorage.setItem('itas_bookmarks', JSON.stringify(bookmarks));
      setBookmarked(true);
    }
  };

  return (
    <Tooltip title={bookmarked ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton
        onClick={toggleBookmark}
        size={size}
        sx={{
          color: bookmarked ? 'warning.main' : 'text.secondary',
          '&:hover': {
            color: 'warning.main',
          },
        }}
      >
        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;
