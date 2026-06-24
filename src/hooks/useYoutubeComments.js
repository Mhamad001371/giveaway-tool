import { useState, useCallback } from 'react';

export function useYoutubeComments(apiKey) {
  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [totalFetched, setTotalFetched] = useState(0);

  const fetchComments = useCallback(async (videoId) => {
    setIsFetching(true);
    setError(null);
    setComments([]);
    setTotalFetched(0);

    let allComments = [];
    let pageToken = '';

    try {
      do {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100${pageToken ? `&pageToken=${pageToken}` : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          // Comprehensive error handling
          let errorMessage = 'Failed to fetch comments.';
          if (data.error?.message) {
            errorMessage = data.error.message;
          } else if (response.status === 403) {
            errorMessage = 'Comments disabled or API key invalid.';
          } else if (response.status === 404) {
            errorMessage = 'Video not found.';
          }
          throw new Error(errorMessage);
        }

        if (data.items) {
          allComments = [...allComments, ...data.items];
          setTotalFetched(allComments.length);
          // Progressive update to UI
          setComments([...allComments]);
        }

        pageToken = data.nextPageToken;

      } while (pageToken);
      
      setIsFetching(false);
      return allComments;

    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message);
      setIsFetching(false);
      return null;
    }
  }, [apiKey]);

  return { comments, isFetching, error, fetchComments, totalFetched };
}
