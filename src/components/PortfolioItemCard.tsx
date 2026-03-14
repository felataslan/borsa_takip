'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { Stock } from '@/types/stock.types';

export interface PortfolioItemData {
  symbol: string;
  lots: number;
  averageCost?: number;
  liveStock?: Stock;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface PortfolioItemCardProps {
  item: PortfolioItemData;
  onRemove: (symbol: string) => void;
}

export default function PortfolioItemCard({ item, onRemove }: PortfolioItemCardProps) {
  return (
    <Card sx={{  
      bgcolor: 'background.paper', 
      borderRadius: 3, 
      border: '1px solid', 
      borderColor: 'divider',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.symbol.replace('.IS', '')}</Typography>
            <Typography variant="body2" color="text.secondary">{item.liveStock?.shortName || 'Yükleniyor...'}</Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => onRemove(item.symbol)}
            sx={{ color: 'text.secondary', '&:hover': { color: '#f43f5e', bgcolor: 'rgba(244, 63, 94, 0.1)' } }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Adet (Lot)</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.lots}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Maliyet Fiyatı</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.averageCost?.toFixed(2) || '0.00'} ₺</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Anlık Fiyat</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.currentPrice.toFixed(2)} ₺</Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Box>
              <Typography variant="caption" color="text.secondary" display="block">Toplam Değer</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</Typography>
           </Box>
           <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">Kâr/Zarar</Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 'bold', 
                color: item.profitLoss >= 0 ? '#10b981' : '#f43f5e' 
              }}>
                {item.profitLoss > 0 ? '+' : ''}{item.profitLoss.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
              </Typography>
           </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
