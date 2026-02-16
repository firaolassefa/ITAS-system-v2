import React, { useState } from 'react';
import {
  Box, IconButton, Popover, Typography, Paper,
  List, ListItem, ListItemText, Button
} from '@mui/material';
import { 
  Help as HelpIcon, 
  PlayCircleOutline as VideoIcon,
  Description as DocIcon, 
  Code as ExampleIcon 
} from '@mui/icons-material';

interface HelpContent {
  description: string;
  steps?: string[];
  example?: string;
  videoUrl?: string;
  docUrl?: string;
}

interface ContextHelpProps {
  fieldId: string;
  fieldName: string;
  helpContent?: HelpContent;
}

const ContextHelp: React.FC<ContextHelpProps> = ({ fieldId, fieldName, helpContent }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const open = Boolean(anchorEl);
  const id = open ? `help-${fieldId}` : undefined;
  
  // Default help content if not provided
  const defaultHelp: HelpContent = {
    description: `Guidance for filling ${fieldName}`,
    steps: [
      'Enter the required information accurately',
      'Refer to official guidelines if unsure',
      'Save your progress regularly'
    ],
    example: 'Example: For VAT field, enter your VAT registration number'
  };
  
  const content = helpContent || defaultHelp;
  
  // Helper function to check if videoUrl exists and is truthy
  const hasVideoUrl = (): boolean => {
    return !!(content as HelpContent).videoUrl;
  };
  
  // Helper function to check if docUrl exists and is truthy
  const hasDocUrl = (): boolean => {
    return !!(content as HelpContent).docUrl;
  };
  
  // Helper function to get videoUrl safely
  const getVideoUrl = (): string => {
    return (content as HelpContent).videoUrl || '';
  };
  
  // Helper function to get docUrl safely
  const getDocUrl = (): string => {
    return (content as HelpContent).docUrl || '';
  };
  
  return (
    <>
      <IconButton size="small" onClick={handleClick} sx={{ ml: 1 }}>
        <HelpIcon fontSize="small" color="primary" />
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Help: {fieldName}
          </Typography>
          
          <Typography variant="body2" paragraph>
            {content.description}
          </Typography>
          
          {content.steps && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Steps:
              </Typography>
              <List dense>
                {content.steps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${step}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {content.example && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ExampleIcon sx={{ mr: 1 }} fontSize="small" />
                Example:
              </Typography>
              <Typography variant="body2">
                {content.example}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {hasVideoUrl() && (
              <Button 
                size="small" 
                startIcon={<VideoIcon />}
                onClick={() => window.open(getVideoUrl(), '_blank')}
                variant="outlined"
              >
                Watch Tutorial
              </Button>
            )}
            {hasDocUrl() && (
              <Button 
                size="small" 
                startIcon={<DocIcon />}
                onClick={() => window.open(getDocUrl(), '_blank')}
                variant="outlined"
              >
                View Guide
              </Button>
            )}
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default ContextHelp;