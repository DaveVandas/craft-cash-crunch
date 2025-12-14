/**
 * Returns an emoji based on profession for avatar fallbacks
 */
export const getAvatarEmoji = (profession: string): string => {
  const lower = profession.toLowerCase();
  
  // Athletes
  if (lower.includes('athlete') || lower.includes('player') || lower.includes('sport') || 
      lower.includes('basketball') || lower.includes('football') || lower.includes('soccer') ||
      lower.includes('tennis') || lower.includes('golf') || lower.includes('boxing') ||
      lower.includes('mma') || lower.includes('racing') || lower.includes('nba') ||
      lower.includes('nfl') || lower.includes('mlb')) {
    return '🏆';
  }
  
  // Hollywood / Actors
  if (lower.includes('actor') || lower.includes('actress') || lower.includes('hollywood') ||
      lower.includes('director') || lower.includes('producer') || lower.includes('filmmaker')) {
    return '🎬';
  }
  
  // Musicians
  if (lower.includes('musician') || lower.includes('singer') || lower.includes('artist') ||
      lower.includes('rapper') || lower.includes('band') || lower.includes('dj') ||
      lower.includes('composer') || lower.includes('songwriter')) {
    return '🎵';
  }
  
  // Tech / Business
  if (lower.includes('tech') || lower.includes('ceo') || lower.includes('founder') ||
      lower.includes('entrepreneur') || lower.includes('investor') || lower.includes('executive') ||
      lower.includes('business') || lower.includes('billionaire')) {
    return '💻';
  }
  
  // Politicians
  if (lower.includes('politician') || lower.includes('president') || lower.includes('senator') ||
      lower.includes('governor') || lower.includes('congress') || lower.includes('minister')) {
    return '🏛️';
  }
  
  // Influencers
  if (lower.includes('influencer') || lower.includes('youtuber') || lower.includes('tiktok') ||
      lower.includes('streamer') || lower.includes('content creator') || lower.includes('social media')) {
    return '📱';
  }
  
  // Authors / Writers
  if (lower.includes('author') || lower.includes('writer') || lower.includes('journalist')) {
    return '📚';
  }
  
  // Models / Fashion
  if (lower.includes('model') || lower.includes('fashion') || lower.includes('designer')) {
    return '✨';
  }
  
  // Default - money bag for wealth context
  return '💰';
};
