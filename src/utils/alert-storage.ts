import fs from 'fs';
import path from 'path';

export interface UserAlert {
  id: string;
  contact: {
    email?: string;
    phone?: string;
  };
  symbols: string[];
  lastBreakStatus: Record<string, boolean>; // symbol -> true if ceiling was broken last time
  createdAt: string;
}

const STORAGE_PATH = path.join(process.cwd(), 'src/data/alerts.json');

/**
 * Ensures the data directory and file exist
 */
function ensureStorage() {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify([], null, 2));
  }
}

export const alertStorage = {
  getAll: (): UserAlert[] => {
    ensureStorage();
    try {
      const data = fs.readFileSync(STORAGE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  save: (alerts: UserAlert[]) => {
    ensureStorage();
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(alerts, null, 2));
  },

  addOrUpdate: (newAlert: Omit<UserAlert, 'id' | 'createdAt' | 'lastBreakStatus'>) => {
    const alerts = alertStorage.getAll();
    const existingIndex = alerts.findIndex(a => 
      (newAlert.contact.email && a.contact.email === newAlert.contact.email) ||
      (newAlert.contact.phone && a.contact.phone === newAlert.contact.phone)
    );

    if (existingIndex > -1) {
      // Update symbols
      alerts[existingIndex].symbols = Array.from(new Set([...alerts[existingIndex].symbols, ...newAlert.symbols]));
    } else {
      // Add new
      alerts.push({
        id: Math.random().toString(36).substr(2, 9),
        contact: newAlert.contact,
        symbols: newAlert.symbols,
        lastBreakStatus: {},
        createdAt: new Date().toISOString()
      });
    }
    alertStorage.save(alerts);
  }
};
