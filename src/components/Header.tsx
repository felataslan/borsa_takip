"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Activity, Star } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 50 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, display: 'flex', justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <Activity color="#22c55e" size={24} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
                Borsa<Box component="span" sx={{ color: 'primary.main' }}>Takip</Box>
              </Typography>
            </Box>
          </Link>

          {/* Navigation Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              href="/"
              sx={{
                color: pathname === '/' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Piyasalar
            </Button>
            
            <Button
              component={Link}
              href="/favorites"
              startIcon={<Star size={16} />}
              sx={{
                color: pathname === '/favorites' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Favoriler
            </Button>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
