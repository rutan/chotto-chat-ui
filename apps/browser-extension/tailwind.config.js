import commonConfig from '../../config/tailwind.config.js';

export default {
  ...commonConfig,
  content: [...commonConfig.content, './index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
