
import { useState, useEffect } from 'react';

interface BookmarkItem {
  id: string;
  type: 'news' | 'publication' | 'program' | 'opportunity';
  title: string;
  url: string;
  description?: string;
  image?: string;
  bookmarkedAt: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lsf_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('lsf_bookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.warn('Failed to save bookmarks:', error);
      }
    }
  }, [bookmarks, isLoading]);

  const addBookmark = (item: Omit<BookmarkItem, 'bookmarkedAt'>) => {
    const newBookmark: BookmarkItem = {
      ...item,
      bookmarkedAt: new Date().toISOString()
    };
    setBookmarks(prev => [newBookmark, ...prev.filter(b => b.id !== item.id)]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(b => b.id === id);
  };

  const toggleBookmark = (item: Omit<BookmarkItem, 'bookmarkedAt'>) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  const getBookmarksByType = (type: BookmarkItem['type']) => {
    return bookmarks.filter(b => b.type === type);
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    getBookmarksByType,
    clearAllBookmarks,
    count: bookmarks.length
  };
};
