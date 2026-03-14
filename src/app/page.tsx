'use client';

import React, { useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockDetailModal from '@/components/StockDetailModal';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import SectorsTab from '@/components/SectorsTab';
import FavoritesTab from '@/components/FavoritesTab';
import { Activity, Star } from 'lucide-react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const BACKGROUND_ORBS = [
  { color: 'rgba(34, 197, 94, 0.05)', top: 80, right: 0 },
  { color: 'rgba(59, 130, 246, 0.05)', bottom: 0, left: 0, size: 384, blur: 150 },
];

export default function Home() {
  const { data: stocks, loading, error } = useFetch<Stock[]>('/api/stocks', { initialData: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { favorites } = useFavoritesStore();

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: '100vh', position: 'relative', overflowX: 'clip' }}
    >
      <PageHeader
        icon={<Activity color="#22c55e" size={32} />}
        title="Borsa İstanbul Piyasaları"
        subtitle="En çok işlem gören BİST hisselerinin güncel fiyatları ve değişim oranları. (Veriler Yahoo Finance üzerinden 15 dk gecikmeli sağlanmaktadır)"
      />

      {/* Tabs */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 10, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.95rem' },
            '& .Mui-selected': { fontWeight: 700 },
          }}
        >
          <Tab label="Hisseler" id="tab-sectors" aria-controls="tabpanel-sectors" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star size={16} fill={activeTab === 1 ? 'currentColor' : 'none'} />
                Favorilerim
                {favorites.length > 0 && (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      px: 0.8,
                      py: 0.1,
                      lineHeight: 1.6,
                    }}
                  >
                    {favorites.length}
                  </Box>
                )}
              </Box>
            }
            id="tab-favorites"
            aria-controls="tabpanel-favorites"
          />
        </Tabs>
      </Box>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* ─── HİSSELER TAB ─── */}
          <Box
            role="tabpanel"
            id="tabpanel-sectors"
            aria-labelledby="tab-sectors"
            hidden={activeTab !== 0}
          >
            {activeTab === 0 && (
              <SectorsTab stocks={stocks} onStockClick={setSelectedStock} />
            )}
          </Box>

          {/* ─── FAVORİLER TAB ─── */}
          <Box
            role="tabpanel"
            id="tabpanel-favorites"
            aria-labelledby="tab-favorites"
            hidden={activeTab !== 1}
          >
            {activeTab === 1 && <FavoritesTab />}
          </Box>
        </>
      )}

      <StockDetailModal 
        open={!!selectedStock} 
        onClose={() => setSelectedStock(null)} 
        stock={selectedStock} 
      />
      <BackgroundOrbs orbs={BACKGROUND_ORBS} />
    </Container>
  );
}
