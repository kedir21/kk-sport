export const formatMatchTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If match is today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If match is tomorrow, show "Tomorrow, HH:MM"
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Otherwise show Date and Time
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getSportIconName = (sportId: string): string => {
  const map: Record<string, string> = {
    football: 'trophy',
    basketball: 'activity',
    tennis: 'circle-dot',
    hockey: 'snowflake',
    baseball: 'diamond',
    mma: 'swords',
    boxing: 'swords',
    f1: 'wind',
    cricket: 'target',
  };
  return map[sportId] || 'activity';
};

// Helper to fix image URLs if they are relative
export const getImageUrl = (url?: string) => {
    if (!url) return 'https://picsum.photos/50/50?grayscale'; // Fallback
    if (url.startsWith('http')) return url;
    return `https://livesport.su${url}`;
};