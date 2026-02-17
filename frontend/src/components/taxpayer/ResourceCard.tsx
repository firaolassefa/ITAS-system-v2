import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  OndemandVideo as VideoIcon,
  Article as ArticleIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface ResourceCardProps {
  resource: any;
  onDownload: () => void;
  onView?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDownload, onView }) => {
  const getIcon = () => {
    switch (resource.resourceType) {
      case 'PDF': return <PdfIcon color="error" />;
      case 'VIDEO': return <VideoIcon color="primary" />;
      case 'ARTICLE': return <ArticleIcon color="success" />;
      default: return <ArticleIcon />;
    }
  };

  const getTypeColor = () => {
    switch (resource.resourceType) {
      case 'PDF': return 'error';
      case 'VIDEO': return 'primary';
      case 'ARTICLE': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        borderTop: `3px solid ${
          resource.resourceType === 'PDF' ? '#EF4444' :
          resource.resourceType === 'VIDEO' ? '#667eea' :
          '#10B981'
        }`,
        borderRadius: '16px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: `0 20px 60px ${
            resource.resourceType === 'PDF' ? 'rgba(239, 68, 68, 0.3)' :
            resource.resourceType === 'VIDEO' ? 'rgba(102, 126, 234, 0.3)' :
            'rgba(16, 185, 129, 0.3)'
          }`,
          border: '1px solid rgba(102, 126, 234, 0.3)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: resource.resourceType === 'PDF' 
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                : resource.resourceType === 'VIDEO'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            }}
          >
            {getIcon()}
          </Box>
          <Chip
            label={resource.resourceType}
            size="small"
            sx={{
              background: resource.resourceType === 'PDF'
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : resource.resourceType === 'VIDEO'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          />
        </Box>
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {resource.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 3 }}
        >
          {resource.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Chip 
            label={resource.category} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: '#667eea', 
              color: '#667eea',
              fontWeight: 600,
            }}
          />
          <Chip 
            label={resource.audience} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: '#764ba2', 
              color: '#764ba2',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ViewIcon fontSize="small" sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {resource.views} views
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DownloadIcon fontSize="small" sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {resource.downloads} downloads
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0 }}>
        {resource.resourceType === 'PDF' && onView ? (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onView}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              View PDF
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onDownload}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#667eea',
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Download
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: resource.resourceType === 'PDF'
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : resource.resourceType === 'VIDEO'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: resource.resourceType === 'PDF'
                  ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                  : resource.resourceType === 'VIDEO'
                  ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                transform: 'translateY(-2px)',
                boxShadow: resource.resourceType === 'PDF'
                  ? '0 8px 25px rgba(239, 68, 68, 0.4)'
                  : resource.resourceType === 'VIDEO'
                  ? '0 8px 25px rgba(102, 126, 234, 0.4)'
                  : '0 8px 25px rgba(16, 185, 129, 0.4)',
              },
            }}
          >
            Download Resource
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ResourceCard;
