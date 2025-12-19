import { SeasonalVariant } from './seasonalHooks'

export function getToolbarSx(variant: SeasonalVariant) {
  return (theme: any) => {
    if (variant === 'christmas') {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        background: 'linear-gradient(135deg, #0b6623 0%, #b30000 100%)',
        color: '#fff',
        backdropFilter: 'blur(8px)',
        maxHeight: 48,
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: `0 6px 18px rgba(179,0,0,0.12), 0 1px 4px rgba(11,102,35,0.08)`,
      }
    }
    if (variant === 'january') {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        background: 'linear-gradient(180deg, #dfeaf6 0%, #c9d9ea 100%)',
        color: '#333',
        maxHeight: 48,
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.06)',
        boxShadow: `0 6px 18px rgba(0,0,0,0.04)`,
      }
    }
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      bgcolor: theme.palette.primary.dark,
      backdropFilter: 'blur(24px)',
      maxHeight: 40,
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: `1 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
    }
  }
}

export default getToolbarSx
