"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Activity, Star, TrendingUp, Map, Rocket, Sun, Moon, Menu, X } from 'lucide-react';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const { mode, toggleTheme } = useAppTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Sektörler', href: '/', icon: <Activity size={20} /> },
    { label: 'BİST 30', href: '/bist30', icon: <TrendingUp size={20} /> },
    { label: 'BİST 100', href: '/bist100', icon: <Map size={20} /> },
    { label: 'Halka Arzlar', href: '/halkaarz', icon: <Rocket size={20} /> },
    { label: 'Favoriler', href: '/favorites', icon: <Star size={20} /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 50 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, display: 'flex', justifyContent: 'space-between' }}>
          
          {/* Hamburger Menu (Mobile Only) */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { sm: 'none' }, color: 'text.secondary', mr: 1 }}
          >
            <Menu size={24} />
          </IconButton>

          {/* Logo Section */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', flexGrow: { xs: 1, sm: 0 } }}>
              <Activity color="#22c55e" size={24} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
                Borsa<Box component="span" sx={{ color: 'primary.main' }}>Takip</Box>
              </Typography>
            </Box>
          </Link>

          {/* Desktop Navigation Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Button
              component={Link}
              href="/"
              sx={{
                color: pathname === '/' ? 'text.primary' : 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
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
                display: { xs: 'none', sm: 'flex' },
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

      {/* Mobile Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.default',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
            <Activity color="#22c55e" size={24} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
              Borsa<Box component="span" sx={{ color: 'primary.main' }}>Takip</Box>
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
            <X size={24} />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 2, px: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    slotProps={{
                      primary: { 
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'text.primary' : 'text.secondary',
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
}
