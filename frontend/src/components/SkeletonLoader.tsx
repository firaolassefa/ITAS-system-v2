import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={56} height={56} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (type === 'table') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, py: 2, alignItems: 'center' }}>
            <Skeleton width="30%" />
            <Skeleton width="20%" />
            <Skeleton width="25%" />
            <Skeleton width="15%" />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SkeletonLoader;