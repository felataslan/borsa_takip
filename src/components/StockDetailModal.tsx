import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Chip,
  Divider,
} from '@mui/material';
import { X, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Stock } from '@/types/stock.types';
import StockHistoryChart from './StockHistoryChart';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface StockDetailModalProps {
  open: boolean;
  onClose: () => void;
  stock: Stock | null;
}

export default function StockDetailModal({ open, onClose, stock }: StockDetailModalProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [dynamicChange, setDynamicChange] = React.useState<{
    label: string;
    pct: number | null;
    val: number | null;
  } | null>(null);

  // Reset dynamic state when modal closes or stock changes
  React.useEffect(() => {
    if (open) {
      setDynamicChange(null);
    }
  }, [open, stock?.symbol]);

  if (!stock) return null;

  const favorite = isFavorite(stock.symbol);

  const displayPct = dynamicChange?.pct ?? stock.regularMarketChangePercent;
  const displayVal = dynamicChange?.val ?? stock.regularMarketChange;
  const displayLabel = dynamicChange?.label ?? 'Günlük';
  const isPositive = displayPct >= 0;

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(stock.symbol);
    } else {
      addFavorite(stock);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }
      }}
    >
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* Header Info */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {stock.symbol.replace('.IS', '')}
            </Typography>
            <Chip 
              label={stock.sector || 'Genel'} 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: '0.7rem', 
                bgcolor: 'rgba(156, 163, 175, 0.1)', 
                color: 'text.secondary',
                fontWeight: 600
              }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '80%' }}>
            {stock.shortName}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={handleFavoriteClick}
            sx={{ 
              color: favorite ? '#eab308' : 'text.disabled',
              bgcolor: favorite ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: favorite ? 'rgba(234, 179, 8, 0.2)' : 'rgba(156, 163, 175, 0.1)',
              }
            }}
          >
             <Star size={20} fill={favorite ? 'currentColor' : 'none'} />
          </IconButton>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              bgcolor: 'rgba(156, 163, 175, 0.1)',
              '&:hover': { bgcolor: 'rgba(156, 163, 175, 0.2)' }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, gap: 4 }}>
          
          {/* Main Chart Section */}
          <Box sx={{ height: 350 }}>
            <StockHistoryChart 
              symbol={stock.symbol} 
              onDataUpdate={(label, pct, val) => setDynamicChange({ label, pct, val })}
            />
          </Box>

           {/* Right Sidebar Stats Sections */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
             <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                  {displayLabel} Değişim
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="text.primary" mb={1}>
                   ₺{stock.regularMarketPrice?.toFixed(2) || '0.00'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    icon={isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />} 
                    label={`${isPositive ? '+' : ''}${displayPct?.toFixed(2)}%`}
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      bgcolor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      color: isPositive ? '#10b981' : '#f43f5e',
                      '& .MuiChip-icon': { color: isPositive ? '#10b981' : '#f43f5e' }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {isPositive ? '+' : ''}₺{displayVal?.toFixed(2)}
                  </Typography>
                </Box>
             </Box>
             
             <Divider />
             
             {/* If it's an IPO stock, show IPO details */}
             {stock.ipoPrice && (
                <Box>
                   <Typography variant="subtitle2" fontWeight={600} mb={2}>Halka Arz Bilgileri</Typography>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                     <Typography variant="body2" color="text.secondary">Arz Fiyatı</Typography>
                     <Typography variant="body2" fontWeight={500}>₺{stock.ipoPrice.toFixed(2)}</Typography>
                   </Box>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                     <Typography variant="body2" color="text.secondary">İşlem Tarihi</Typography>
                     <Typography variant="body2" fontWeight={500}>{stock.ipoDate}</Typography>
                   </Box>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 1, borderTop: '1px dashed rgba(156, 163, 175, 0.2)' }}>
                     <Typography variant="body2" color="text.secondary">Arzdan Bugüne Getiri</Typography>
                     <Typography variant="body2" fontWeight="bold" color={stock.regularMarketPrice >= stock.ipoPrice ? '#10b981' : '#f43f5e'}>
                       {stock.regularMarketPrice >= stock.ipoPrice ? '+' : ''}
                       {(((stock.regularMarketPrice - stock.ipoPrice) / stock.ipoPrice) * 100).toFixed(2)}%
                     </Typography>
                   </Box>
                </Box>
             )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
