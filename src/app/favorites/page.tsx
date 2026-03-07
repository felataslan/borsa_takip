'use client';

import React from 'react';
import StockCard from '@/components/StockCard';
import { Star } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { Container, Box, Typography } from '@mui/material';

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <Star color="#eab308" fill="#eab308" size={32} />
          Favori Hisselerim
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 'md' }}>
          Takip ettiğiniz BİST hisselerinin güncel performansları.
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box
          sx={{
            bgcolor: 'rgba(17, 24, 39, 0.5)',
            p: 6,
            borderRadius: 4,
            border: '1px solid rgba(31, 41, 55, 1)',
            textAlign: 'center',
            maxWidth: 'md',
            mx: 'auto',
            mt: 6,
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Star color="rgba(55, 65, 81, 1)" size={48} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
            Henüz favori hisseniz yok
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Piyasalar ekranından incelediğiniz hisseleri yıldız ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
            },
            position: 'relative',
            zIndex: 10,
          }}
        >
          {favorites.map((stock, idx) => (
            <StockCard key={stock.symbol} stock={stock} index={idx} />
          ))}
        </Box>
      )}
      
      {/* Background decoration elements */}
      <Box sx={{ position: 'fixed', top: 80, left: 0, zIndex: -10, height: 256, width: 256, borderRadius: '50%', bgcolor: 'rgba(234, 179, 8, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: -10, height: 384, width: 384, borderRadius: '50%', bgcolor: 'rgba(249, 115, 22, 0.05)', filter: 'blur(150px)', pointerEvents: 'none' }} />
    </Container>
  );
}
