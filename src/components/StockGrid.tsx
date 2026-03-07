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
                <Search color="#9ca3af" size={20} />
              </InputAdornment>
            ),
            sx: { bgcolor: 'background.paper', backdropFilter: 'blur(12px)' },
          }}
        />
      </Box>

      {stocks.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 4,
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Search size={48} color="rgba(55, 65, 81, 1)" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h6" color="text.primary" gutterBottom>
            Arama kriterlerinize uygun hisse bulunamadı.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lütfen farklı bir arama terimi girerek tekrar deneyin.
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
            <StockCard key={stock.symbol} stock={stock} index={idx} />
          ))}
        </Box>
      )}
    </>
  );
}
