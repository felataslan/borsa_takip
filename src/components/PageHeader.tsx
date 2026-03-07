import React from 'react';
import { Box, Typography } from '@mui/material';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  subtitle: string;
}

/** Reusable page title + subtitle block used at the top of every route. */
export default function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.primary',
        }}
      >
        {icon}
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 'md' }}>
        {subtitle}
      </Typography>
    </Box>
  );
}
