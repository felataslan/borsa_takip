import dbConnect from '@/lib/mongodb';
import Alert from '@/models/Alert';

export interface UserAlert {
  id: string; // This will map to _id from MongoDB
  contact: {
    email?: string;
    phone?: string;
  };
  symbols: string[];
  lastBreakStatus: Record<string, boolean>;
  createdAt: string;
}

export const alertStorage = {
  getAll: async (): Promise<UserAlert[]> => {
    await dbConnect();
    const alerts = await Alert.find({}).lean();
    return (alerts as unknown[]).map((a) => {
      const alert = a as {
        _id: { toString: () => string };
        contact: { email?: string; phone?: string };
        symbols: string[];
        lastBreakStatus: Map<string, boolean>;
        createdAt: Date;
      };
      return {
        id: alert._id.toString(),
        contact: alert.contact,
        symbols: alert.symbols,
        lastBreakStatus: Object.fromEntries(alert.lastBreakStatus || new Map()),
        createdAt: alert.createdAt.toISOString()
      };
    });
  },

  /**
   * MongoDB ile save işlemi genellikle addOrUpdate içinde veya otomatik yapılır.
   * Bu metod toplu güncelleme için bırakıldı.
   */
  save: async (alerts: UserAlert[]) => {
    await dbConnect();
    for (const alert of alerts) {
      await Alert.findByIdAndUpdate(alert.id, {
        contact: alert.contact,
        symbols: alert.symbols,
        lastBreakStatus: alert.lastBreakStatus
      });
    }
  },

  addOrUpdate: async (newAlert: Omit<UserAlert, 'id' | 'createdAt' | 'lastBreakStatus'>) => {
    await dbConnect();
    
    // Find existing by email or phone
    const query = [];
    if (newAlert.contact.email) query.push({ 'contact.email': newAlert.contact.email });
    if (newAlert.contact.phone) query.push({ 'contact.phone': newAlert.contact.phone });

    if (query.length === 0) return;

    const existing = await Alert.findOne({ $or: query });

    if (existing) {
      // Update symbols (add unique ones)
      const combinedSymbols = Array.from(new Set([...existing.symbols, ...newAlert.symbols]));
      existing.symbols = combinedSymbols;
      await existing.save();
    } else {
      // Create new
      await Alert.create({
        contact: newAlert.contact,
        symbols: newAlert.symbols,
        lastBreakStatus: {}
      });
    }
  }
};
