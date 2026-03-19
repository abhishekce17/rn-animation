const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = async () => {
    const defaultConfig = await getDefaultConfig(__dirname);
    const {
        resolver: { sourceExts, assetExts },
    } = defaultConfig;

    return mergeConfig(defaultConfig, {
        transformer: {
            // Directs Metro to use the SVG transformer
            babelTransformerPath: require.resolve('react-native-svg-transformer'),
        },
        resolver: {
            // Re-routes .svg files from 'assets' to 'source code'
            assetExts: assetExts.filter((ext) => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg'],
        },
    });
};

module.exports = config();