'use client';

import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Search } from 'lucide-react';
import { Stock } from '@/types/stock.types';
import StockCard from './StockCard';
import StockDetailModal from './StockDetailModal';

interface StockGridProps {
  stocks: Stock[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const GRID_COLS = {
  xs: '1fr',
  sm: 'repeat(2, 1fr)',
  md: 'repeat(3, 1fr)',
  lg: 'repeat(4, 1fr)',
  xl: 'repeat(5, 1fr)',
};

/** Reusable stock grid: search field + responsive card grid + empty state. */
export default function StockGrid({
  stocks,
  searchQuery,
  onSearchChange,
  placeholder = 'Hisse sembolü veya adı ara...',
}: StockGridProps) {
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

  return (
    <>
      <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="#64748b" size={20} />
              </InputAdornment>
            ),
            sx: { 
              bgcolor: 'background.paper', 
              backdropFilter: 'blur(12px)',
              borderRadius: 3,
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.secondary' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
            },
          }}
        />
      </Box>

      {stocks.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 4,
            p: 6,
            bgcolor: 'background.paper',
            borderRadius: 6,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Search size={48} color="var(--mui-palette-text-disabled)" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }} gutterBottom>
            Sonuç Bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &quot;{searchQuery}&quot; aramasına uygun hisse senedi bulunamadı. Lütfen başka bir terim deneyin.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: GRID_COLS,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {stocks.map((stock, idx) => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              index={idx} 
              onClick={(s) => setSelectedStock(s)} 
            />
          ))}
        </Box>
      )}

      <StockDetailModal 
        open={!!selectedStock} 
        onClose={() => setSelectedStock(null)} 
        stock={selectedStock} 
      />
    </>
  );
}
