const HISTORY_KEY = 'carscan_history';
const MAX_HISTORY = 15;

export const saveScanToHistory = (report, imageUrl) => {
  try {
    const history = getScanHistory();
    const newScan = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      report,
      imageUrl
    };
    
    // Add to beginning of array
    history.unshift(newScan);
    
    // Keep only the latest MAX_HISTORY items
    const trimmedHistory = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Failed to save scan history. Storage might be full.", error);
    // If quota exceeded, clear older halves
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      try {
        const history = getScanHistory();
        const trimmedHistory = history.slice(0, Math.max(1, Math.floor(history.length / 2)));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
      } catch (e) {
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  }
};

export const getScanHistory = () => {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (error) {
    console.error("Failed to parse history", error);
    return [];
  }
};

export const clearScanHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
