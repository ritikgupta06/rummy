export const fonts = {
  heading: 'Sora-Bold',
  headingRegular: 'Sora-SemiBold',
  body: 'SpaceGrotesk-Regular',
  bodyMedium: 'SpaceGrotesk-Medium',
  bodyBold: 'SpaceGrotesk-Bold',
  mono: 'SpaceGrotesk-Medium',
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.heading,
    fontSize: 48,
    lineHeight: 58,
    fontWeight: '700',
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },
  h3: {
    fontFamily: fonts.headingRegular,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
  },
  h4: {
    fontFamily: fonts.headingRegular,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  title: {
    fontFamily: fonts.headingRegular,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  bodyBold: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  button: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  overline: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  },
} as const;
