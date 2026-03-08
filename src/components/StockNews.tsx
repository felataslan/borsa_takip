import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Avatar } from '@mui/material';
import { ExternalLink, Newspaper, BellRing } from 'lucide-react';
import { useAppTheme } from '@/theme/ThemeProvider';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  provider: string;
  published: number;
  link: string;
}

interface StockNewsProps {
  symbol: string;
}

const timeAgo = (unixSeconds: number) => {
  const seconds = Math.floor(Date.now() / 1000) - unixSeconds;
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' yıl önce';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' ay önce';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' gün önce';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' saat önce';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' dk önce';
  return Math.floor(seconds) + ' sn önce';
};

export default function StockNews({ symbol }: StockNewsProps) {
  const { mode } = useAppTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stocks/${symbol}/news`);
        if (!response.ok) {
          throw new Error('Haberler alınamadı.');
        }
        const data = await response.json();
        if (isSubscribed) {
          setNews(data);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Bilinmeyen Hata');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      isSubscribed = false;
    };
  }, [symbol]);

  if (loading) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
        </Box>
     );
  }

  if (error) {
     return (
       <Typography color="error" variant="body2" sx={{ p: 2, textAlign: 'center' }}>
         {error}
       </Typography>
     );
  }

  if (news.length === 0) {
     return (
       <Typography color="text.secondary" variant="body2" sx={{ p: 2, textAlign: 'center' }}>
         Son 6 ay içinde listelenecek haber veya duyuru bulunamadı.
       </Typography>
     );
  }

  return (
    <Box sx={{ mt: 3, pr: 1 }}>
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Newspaper size={20} />
        KAP ve Haber Merkezi
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0, 
        maxHeight: 280, 
        overflowY: 'auto', 
        pr: 1,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { 
            background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
            borderRadius: '10px' 
        }
      }}>
        {news.map((item, index) => {
          const isKAP = item.provider === 'kap' || item.source?.toUpperCase().includes('KAP');
          
          return (
            <React.Fragment key={item.id}>
              <Box 
                component="a" 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  py: 1.5,
                  px: 1,
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                     bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                     '& .external-icon': {
                        opacity: 1,
                        transform: 'translateX(2px)'
                     }
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: isKAP ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)', 
                    color: isKAP ? '#3b82f6' : 'text.secondary',
                    width: 36, 
                    height: 36,
                    flexShrink: 0
                  }}
                >
                  {isKAP ? <BellRing size={18} /> : <Newspaper size={18} />}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ 
                     mb: 0.5, 
                     fontWeight: 600, 
                     lineHeight: 1.3,
                     display: '-webkit-box', 
                     WebkitLineClamp: 2, 
                     WebkitBoxOrient: 'vertical', 
                     overflow: 'hidden',
                     textOverflow: 'ellipsis'
                   }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                     <Typography variant="caption" sx={{ 
                         color: isKAP ? '#3b82f6' : 'text.secondary', 
                         fontWeight: 600,
                         bgcolor: isKAP ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                         px: 0.75,
                         py: 0.25,
                         borderRadius: 1
                     }}>
                       {item.source}
                     </Typography>
                     <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                       {timeAgo(item.published)}
                     </Typography>
                  </Box>
                </Box>
                
                <Box 
                  className="external-icon"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'text.disabled',
                    opacity: 0.5,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    ml: 1
                  }}
                >
                  <ExternalLink size={16} />
                </Box>
              </Box>
              {index < news.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
