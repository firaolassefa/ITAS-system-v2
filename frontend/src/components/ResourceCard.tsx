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
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDownload }) => {
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getIcon()}
          <Chip
            label={resource.resourceType}
            size="small"
            color={getTypeColor() as any}
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {resource.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {resource.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip label={resource.category} size="small" variant="outlined" />
          <Chip label={resource.audience} size="small" variant="outlined" />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ViewIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{resource.views} views</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DownloadIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{resource.downloads} downloads</Typography>
          </Box>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
        >
          Download Resource
        </Button>
      </CardActions>
    </Card>
  );
};

export default ResourceCard;
