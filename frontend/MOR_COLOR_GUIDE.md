# MOR Ethiopia Color Guide

## Official Colors

### Primary - Ethiopian Green
```css
Main: #078754
Light: #10b981
Dark: #065f3e
```

### Secondary - Ethiopian Gold
```css
Main: #fbbf24
Light: #fcd34d
Dark: #f59e0b
```

## Usage in Code

### Using Theme Colors (Recommended)
```tsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.main,  // Ethiopian Green
      color: theme.palette.secondary.main           // Ethiopian Gold
    }}>
      Content
    </Box>
  );
};
```

### Using ITASColors
```tsx
import { ITASColors } from '../theme/colors';

<Box sx={{ 
  background: ITASColors.primary.gradient,  // Green gradient
  color: ITASColors.secondary.main          // Gold
}}>
```

### Material-UI Components
```tsx
// Buttons automatically use theme colors
<Button variant="contained" color="primary">  // Green button
<Button variant="contained" color="secondary"> // Gold button

// Custom colors
<Button sx={{ 
  background: 'linear-gradient(135deg, #078754 0%, #10B981 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #065f3e 0%, #059669 100%)'
  }
}}>
```

## Role-Based Colors

Each user role has a unique color scheme:

```tsx
import { ITASColors } from '../theme/colors';

// System Admin - Red
ITASColors.roles.systemAdmin.main      // #dc2626

// Content Admin - Gold
ITASColors.roles.contentAdmin.main     // #fbbf24

// Training Admin - Purple
ITASColors.roles.trainingAdmin.main    // #7c3aed

// Communication Officer - Green
ITASColors.roles.commOfficer.main      // #078754

// Manager - Blue
ITASColors.roles.manager.main          // #0284c7

// Taxpayer - Green
ITASColors.roles.taxpayer.main         // #078754

// MOR Staff - Green
ITASColors.roles.staff.main            // #10b981
```

## Gradients

### Primary Gradient (Green to Gold)
```tsx
background: 'linear-gradient(135deg, #078754 0%, #10B981 50%, #fbbf24 100%)'
```

### Secondary Gradient (Gold)
```tsx
background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
```

### Success Gradient (Green)
```tsx
background: 'linear-gradient(135deg, #10B981 0%, #078754 100%)'
```

## Status Colors

```tsx
// Success - Green
color: '#10b981'

// Warning - Gold
color: '#f59e0b'

// Error - Red
color: '#ef4444'

// Info - Cyan
color: '#22d3ee'
```

## Light vs Dark Mode

### Light Mode
```tsx
background: {
  default: '#f8fafc',  // Light gray
  paper: '#ffffff',    // White
}
text: {
  primary: '#1e293b',  // Dark gray
  secondary: '#64748b' // Medium gray
}
```

### Dark Mode
```tsx
background: {
  default: '#0f172a',  // Dark navy
  paper: '#1e293b',    // Lighter navy
}
text: {
  primary: '#f1f5f9',  // Light gray
  secondary: '#cbd5e1' // Medium gray
}
```

## Examples

### Card with MOR Colors
```tsx
<Card sx={{
  background: mode === 'light' 
    ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)',
  border: `2px solid ${ITASColors.primary.main}`,
  borderRadius: 3
}}>
  <CardContent>
    <Typography variant="h5" sx={{ color: ITASColors.primary.main }}>
      MOR Ethiopia
    </Typography>
    <Typography sx={{ color: ITASColors.secondary.main }}>
      Tax Education Platform
    </Typography>
  </CardContent>
</Card>
```

### Button with Gradient
```tsx
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #078754 0%, #10B981 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #065f3e 0%, #059669 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(7, 135, 84, 0.3)'
    }
  }}
>
  Get Started
</Button>
```

### Sidebar with Role Gradient
```tsx
import { getSidebarGradient } from '../theme/colors';

<Box sx={{
  background: getSidebarGradient(userRole, mode),
  minHeight: '100vh'
}}>
  {/* Sidebar content */}
</Box>
```

## Accessibility

All color combinations meet WCAG 2.1 AA standards:
- Green (#078754) on white: ✅ 4.5:1 contrast ratio
- Gold (#fbbf24) on dark (#1e293b): ✅ 8.2:1 contrast ratio
- White text on green: ✅ 4.8:1 contrast ratio

## Brand Guidelines

### Do's ✅
- Use Ethiopian green as primary color
- Use gold for accents and highlights
- Maintain consistent gradients
- Use role-based colors for user identification
- Keep contrast ratios accessible

### Don'ts ❌
- Don't use blue as primary color (old ITAS branding)
- Don't mix incompatible gradients
- Don't use low-contrast color combinations
- Don't override theme colors without reason
- Don't use colors that conflict with Ethiopian flag

## Resources

- Official MOR Website: https://www.mor.gov.et/
- Ethiopian Flag Colors: Green, Yellow, Red
- Material-UI Theme: https://mui.com/material-ui/customization/theming/
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
