'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { IPOStock } from '@/types/stock.types';

interface IpoStockCardProps {
  stock: IPOStock;
  index: number;
  userLots: number;
  onLotChange: (symbol: string, value: string) => void;
}

export default function IpoStockCard({ stock, index, userLots, onLotChange }: IpoStockCardProps) {
  const isPos = stock.totalReturnPercent >= 0;

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {stock.symbol.replace('.IS', '')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stock.ipoName}
            </Typography>
          </Box>
          <Chip
            icon={<Clock size={14} />}
            label={stock.ipoDate}
            size="small"
            sx={{
              bgcolor: 'rgba(156, 163, 175, 0.1)',
              color: 'text.secondary',
              '& .MuiChip-icon': { color: 'text.secondary' },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Halka Arz Fiyatı
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {stock.ipoPrice.toFixed(2)} ₺
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Anlık Fiyat
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {stock.regularMarketPrice.toFixed(2)} ₺
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            type="number"
            placeholder="0"
            label="Elimdeki Lot"
            value={userLots || ''}
            onChange={(e) => onLotChange(stock.symbol, e.target.value)}
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Lot</InputAdornment>,
                inputMode: 'numeric',
              }
            }}
            sx={{ width: '45%' }}
          />
          <Box sx={{ textAlign: 'right', width: '50%' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              ₺ Kâr/Zarar
            </Typography>
            {userLots > 0 ? (
              <Typography
                variant="body1"
                sx={{ color: isPos ? '#4ade80' : '#f87171', fontWeight: 'bold' }}
              >
                {isPos ? '+' : ''}
                {(
                  (stock.regularMarketPrice - stock.ipoPrice) * userLots
                ).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                -
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 1,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Yüzdesel Getiri:
          </Typography>
          <Chip
            icon={isPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            label={`${isPos ? '+' : ''}${stock.totalReturnPercent.toFixed(2)}%`}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: isPos ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isPos ? '#4ade80' : '#f87171',
              '& .MuiChip-icon': { color: isPos ? '#4ade80' : '#f87171' },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
