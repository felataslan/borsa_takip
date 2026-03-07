import React from 'react';
import { Box } from '@mui/material';

interface Orb {
  color: string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  size?: number;
  blur?: number;
}

interface BackgroundOrbsProps {
  orbs: Orb[];
}

/**
 * Decorative blurred orbs rendered as `position: fixed` elements behind the page content.
 * Replaces duplicate background Box elements copied across every page.
 */
export default function BackgroundOrbs({ orbs }: BackgroundOrbsProps) {
  return (
    <>
      {orbs.map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'fixed',
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            zIndex: -10,
            height: orb.size ?? 256,
            width: orb.size ?? 256,
            borderRadius: '50%',
            bgcolor: orb.color,
            filter: `blur(${orb.blur ?? 120}px)`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}
