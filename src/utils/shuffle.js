export function deduplicateAndShuffle(comments, numberOfWinners) {
  // Deduplicate using Map mapped to authorChannelId.value
  const uniqueMap = new Map();
  comments.forEach(comment => {
    // Navigate safely through the YouTube comment structure
    const snippet = comment?.snippet?.topLevelComment?.snippet;
    const authorId = snippet?.authorChannelId?.value;
    
    // We also include authorDisplayName and authorProfileImageUrl for convenience later
    if (authorId && !uniqueMap.has(authorId)) {
      uniqueMap.set(authorId, {
        id: comment.id,
        authorId,
        authorName: snippet.authorDisplayName,
        authorProfileImageUrl: snippet.authorProfileImageUrl,
        textOriginal: snippet.textOriginal,
        likeCount: snippet.likeCount,
        publishedAt: snippet.publishedAt,
      });
    }
  });

  const uniqueComments = Array.from(uniqueMap.values());

  // Pure Fisher-Yates shuffle algorithm
  const shuffled = [...uniqueComments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Safely select 'N' winners randomly from the pool
  const selectedWinners = shuffled.slice(0, Math.min(numberOfWinners, shuffled.length));

  return {
    totalOriginal: comments.length,
    totalUnique: uniqueComments.length,
    winners: selectedWinners,
    pool: shuffled // Return the rest of the pool for the slot machine animation
  };
}
