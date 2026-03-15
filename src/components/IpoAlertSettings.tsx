'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import { Bell, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { IPOStock } from '@/types/stock.types';

interface IpoAlertSettingsProps {
  stocks: IPOStock[];
}

export default function IpoAlertSettings({ stocks }: IpoAlertSettingsProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(
    stocks.map(s => s.symbol)
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSymbolToggle = (symbol: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol) 
        : [...prev, symbol]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setError('Lütfen e-posta veya telefon numarası giriniz.');
      return;
    }
    if (selectedSymbols.length === 0) {
      setError('Lütfen en az bir hisse seçiniz.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { email, phone },
          symbols: selectedSymbols
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Bir hata oluştu');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
        mb: 6,
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex' }}>
          <Bell size={24} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
            Tavan Bozma Bildirimi (SMS/E-posta)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Seçtiğiniz halka arz hisseleri ilk günlerinde tavan bozduğunda anında bildirim alın.
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="E-posta Adresi"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Mail size={18} style={{ marginRight: 8, opacity: 0.5 }} />
              }
            }}
          />
          <TextField
            fullWidth
            label="Telefon Numarası"
            placeholder="05xx xxx xx xx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Phone size={18} style={{ marginRight: 8, opacity: 0.5 }} />
              }
            }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, opacity: 0.8 }}>
          İzlenecek Hisseleri Seçin:
        </Typography>
        
        <FormGroup sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 1,
          mb: 4 
        }}>
          {stocks.map((stock) => (
            <FormControlLabel
              key={stock.symbol}
              control={
                <Checkbox 
                  size="small"
                  checked={selectedSymbols.includes(stock.symbol)}
                  onChange={() => handleSymbolToggle(stock.symbol)}
                  sx={{ color: '#ec4899', '&.Mui-checked': { color: '#ec4899' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stock.symbol.replace('.IS', '')}
                </Typography>
              }
            />
          ))}
        </FormGroup>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Collapse in={!!error}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </Collapse>
          
          <Collapse in={success}>
            <Alert 
              icon={<CheckCircle2 size={20} />} 
              severity="success" 
              sx={{ borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
              Bildirim ayarlarınız kaydedildi. Hisseleriniz izlenmeye başlandı!
            </Alert>
          </Collapse>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth={false}
            sx={{
              alignSelf: 'flex-start',
              px: 6,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: '#ec4899',
              '&:hover': { bgcolor: '#db2777' },
              boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)'
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Takibi Başlat'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
