import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingDown, TrendingUp } from 'lucide-react';
import { Stock } from '@/types/stock.types';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';

interface StockCardProps {
  stock: Stock;
  index?: number;
  onClick?: (stock: Stock) => void;
}

export default function StockCard({ stock, index = 0, onClick }: StockCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(stock.symbol);

  const isPositive = stock.regularMarketChange >= 0;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorite) {
      removeFavorite(stock.symbol);
    } else {
      addFavorite(stock);
    }
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick && onClick(stock)}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        bgcolor: 'background.paper', 
        border: '1px solid',
        borderColor: 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'divider',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: 128,
          width: 128,
          transform: 'translate(32px, -32px)',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, rgba(156, 163, 175, 0.1), transparent)',
          filter: 'blur(24px)',
          transition: 'all 0.2s',
          '.MuiCard-root:hover &': {
            background: 'linear-gradient(to bottom right, rgba(156, 163, 175, 0.2), transparent)',
          },
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
              {stock.symbol.replace('.IS', '')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={stock.shortName}
            >
              {stock.shortName}
            </Typography>
          </Box>
          <IconButton
            onClick={toggleFavorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            sx={{
              color: favorite ? '#eab308' : 'text.secondary', // yellow-500
              '&:hover': { color: favorite ? '#facc15' : 'text.primary', bgcolor: 'rgba(156, 163, 175, 0.1)' },
            }}
          >
            <Star
              size={20}
              fill={favorite ? '#eab308' : 'none'}
              style={{ transition: 'all 0.2s' }}
            />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', letterSpacing: '-0.05em' }}>
              {stock.regularMarketPrice.toFixed(2)}{' '}
              <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                ₺
              </Typography>
            </Typography>
          </Box>

          <Chip
            icon={isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            label={`${stock.regularMarketChangePercent.toFixed(2)}%`}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isPositive ? '#4ade80' : '#f87171',
              backdropFilter: 'blur(12px)',
              '& .MuiChip-icon': {
                color: isPositive ? '#4ade80' : '#f87171',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
