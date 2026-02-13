import configData from '../config.json';

export const config = configData;

// Helper function to get theme CSS variables
export const getThemeStyles = () => {
  const { theme } = config;
  return {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--accent-color': theme.accentColor,
    '--gradient-start': theme.gradientStart,
    '--gradient-middle': theme.gradientMiddle,
    '--gradient-end': theme.gradientEnd,
    '--background-gradient': theme.backgroundGradient,
    '--card-background': theme.cardBackground,
    '--text-primary': theme.textPrimary,
    '--text-secondary': theme.textSecondary,
    '--heart-color': theme.heartColor,
    '--font-family': theme.fontFamily,
    '--font-family-body': theme.fontFamilyBody,
  };
};

// Helper to get song by category
export const getSongByCategory = (category) => {
  return config.songs.find(song => song.category === category);
};

// Helper to get receiver's display name
export const getReceiverName = (useNickname = false) => {
  return useNickname ? config.names.nickname : config.names.receiver;
};

export default config;