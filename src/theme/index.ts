export { colors } from './colors';
export { spacing, radius, borderWidth, fontSize, fontWeight, lineHeight, letterSpacing, iconSize } from './spacing';
export { shadows } from './shadows';
export { typography, fonts } from './typography';
export { gradients } from './gradients';

export const layout = {
  screenWidth: '100%' as const,
  cardWidth: 48,
  cardHeight: 68,
  cardWidthLarge: 60,
  cardHeightLarge: 84,
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
    xxl: 96,
  },
  headerHeight: 56,
  bottomSheetHandleHeight: 40,
  tabBarHeight: 64,
};
