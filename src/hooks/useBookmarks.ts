
import { useState, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const addBookmark = (url: string) => {
    const newBookmarks = [...bookmarks, url];
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const removeBookmark = (url: string) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark !== url);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (url: string) => bookmarks.includes(url);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    count: bookmarks.length
  };
};
