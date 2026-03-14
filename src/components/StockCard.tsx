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
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onClick && onClick(stock)}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        bgcolor: 'background.paper', 
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        '&:hover': {
          borderColor: isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
          boxShadow: isPositive 
            ? '0 20px 40px -10px rgba(16, 185, 129, 0.15)' 
            : '0 20px 40px -10px rgba(244, 63, 94, 0.15)',
        },
      }}
    >
      {/* Decorative Gradient Orb */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: 140,
          width: 140,
          transform: 'translate(40px, -40px)',
          borderRadius: '50%',
          background: isPositive 
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transition: 'all 0.4s ease',
          '.MuiCard-root:hover &': {
            background: isPositive 
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 70%)',
            transform: 'translate(30px, -30px) scale(1.1)',
          },
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {stock.symbol.replace('.IS', '')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}
              title={stock.shortName}
            >
              {stock.shortName}
            </Typography>
          </Box>
          <IconButton
            onClick={toggleFavorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            edge="end"
            sx={{
              color: favorite ? '#f59e0b' : 'text.disabled',
              p: 0.5,
              '&:hover': { color: favorite ? '#fbbf24' : 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <Star
              size={20}
              fill={favorite ? '#f59e0b' : 'none'}
              strokeWidth={favorite ? 1 : 2}
              style={{ transition: 'all 0.2s' }}
            />
          </IconButton>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="span" sx={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {stock.regularMarketPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 600, ml: 0.5 }}>
                ₺
              </Typography>
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 0.5, 
                fontWeight: 600, 
                color: isPositive ? '#10b981' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
               {isPositive ? '+' : ''}{stock.regularMarketChange.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
            </Typography>
          </Box>

          <Chip
            icon={isPositive ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
            label={`${isPositive ? '+' : ''}${stock.regularMarketChangePercent.toFixed(2)}%`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 24,
              borderRadius: 1.5,
              bgcolor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              color: isPositive ? '#10b981' : '#f43f5e',
              border: '1px solid',
              borderColor: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
              '& .MuiChip-icon': {
                color: isPositive ? '#10b981' : '#f43f5e',
                marginLeft: '6px'
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
