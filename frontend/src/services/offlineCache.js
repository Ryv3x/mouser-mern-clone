// simple offline cache helpers

export const saveToCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to cache', err);
  }
};

export const loadFromCache = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Failed to load from cache', err);
    return null;
  }
};
