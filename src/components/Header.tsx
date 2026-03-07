"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import { Activity, Star, TrendingUp, Map, Rocket, Sun, Moon } from 'lucide-react';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const { mode, toggleTheme } = useAppTheme();

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Button
              component={Link}
              href="/"
              sx={{
                color: pathname === '/' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 'auto',
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Sektörler
            </Button>
            
            <Button
              component={Link}
              href="/bist30"
              startIcon={<TrendingUp size={16} />}
              sx={{
                color: pathname === '/bist30' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              BİST 30
            </Button>

            <Button
              component={Link}
              href="/bist100"
              startIcon={<Map size={16} />}
              sx={{
                color: pathname === '/bist100' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              BİST 100
            </Button>

            <Button
              component={Link}
              href="/halkaarz"
              startIcon={<Rocket size={16} />}
              sx={{
                color: pathname === '/halkaarz' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Halka Arzlar
            </Button>

            <Button
              component={Link}
              href="/favorites"
              startIcon={<Star size={16} />}
              sx={{
                color: pathname === '/favorites' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 'auto',
                '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              Favoriler
            </Button>

            {/* Theme Toggle Button */}
            <IconButton 
              onClick={toggleTheme} 
              sx={{ 
                color: 'text.secondary',
                ml: 1,
                '&:hover': { color: 'text.primary', bgcolor: 'rgba(156, 163, 175, 0.1)' } 
              }}
              title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
