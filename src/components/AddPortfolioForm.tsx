'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { Stock } from '@/types/stock.types';

interface AddPortfolioFormProps {
  stocks: Stock[];
  onAdd: (symbol: string, lots: number, averageCost?: number) => void;
}

export default function AddPortfolioForm({ stocks, onAdd }: AddPortfolioFormProps) {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [inputLots, setInputLots] = useState<string>('');
  const [inputCost, setInputCost] = useState<string>('');

  const handleAddStock = () => {
    if (selectedStock && inputLots) {
      const parsedCost = inputCost !== '' ? Number(inputCost.replace(',', '.')) : undefined;
      onAdd(selectedStock, Number(inputLots), parsedCost);
      setSelectedStock(null);
      setInputLots('');
      setInputCost('');
    }
  };

  return (
    <Card sx={{ mb: 6, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4, position: 'relative', zIndex: 10 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Portföye Hisse Ekle</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Autocomplete
              options={stocks.map(s => s.symbol)}
              value={selectedStock}
              onChange={(_, newValue) => setSelectedStock(newValue)}
              renderInput={(params) => <TextField {...params} label="Hisse Seç (Örn: THYAO.IS)" variant="outlined" />}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField 
              fullWidth 
              label="Lot Adeti" 
              type="number" 
              value={inputLots} 
              onChange={(e) => setInputLots(e.target.value)} 
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField 
              fullWidth 
              label="Maliyet Fiyatı (₺)" 
              type="number" 
              value={inputCost} 
              onChange={(e) => setInputCost(e.target.value)} 
              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={!selectedStock || !inputLots}
              onClick={handleAddStock}
              startIcon={<Plus size={20} />}
              sx={{ height: 56, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Ekle
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
