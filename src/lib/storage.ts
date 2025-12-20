// LocalStorage wrapper for persisting app data

export const storage = {
  // User management
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  setCurrentUser: (user: any) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  clearCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  // Generic data storage
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  
  // Get all items of a type for current user
  getUserItems: (type: string) => {
    const user = storage.getCurrentUser();
    if (!user) return [];
    
    const allItems = storage.get(type) || [];
    return allItems.filter((item: any) => item.userId === user.id);
  },
  
  // Add item to a collection
  addItem: (type: string, item: any) => {
    const items = storage.get(type) || [];
    items.push(item);
    storage.set(type, items);
    return item;
  },
  
  // Update item in a collection
  updateItem: (type: string, id: string, updates: any) => {
    const items = storage.get(type) || [];
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      storage.set(type, items);
      return items[index];
    }
    return null;
  },
  
  // Delete item from a collection
  deleteItem: (type: string, id: string) => {
    const items = storage.get(type) || [];
    const filtered = items.filter((item: any) => item.id !== id);
    storage.set(type, filtered);
  }
};
