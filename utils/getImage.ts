const imageMap: Record<string, any> = {
    'dates.png': require('../assets/images/dates.png'),
    'honey.png': require('../assets/images/dates.png'),
    'olive.png': require('../assets/images/dates.png'),
    'figs.png': require('../assets/images/dates.png'),
    'pomegranate.png': require('../assets/images/dates.png'),
    'barley.png': require('../assets/images/dates.png'),
    'blackseed.png': require('../assets/images/dates.png'),
    'placeholder.png': require('../assets/images/dates.png'), // fallback
  };
  
  export const getImage = (fileName: string) => {
    return imageMap[fileName] || imageMap['dates.png'];
  };
  