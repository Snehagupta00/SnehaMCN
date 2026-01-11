const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo Config Plugin
 * Adds USAGE_STATS permission for Android
 */
module.exports = function withUsageStats(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // Add USAGE_STATS permission
    if (!androidManifest.manifest.uses-permission) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    const permissions = androidManifest.manifest['uses-permission'];
    const hasUsageStats = permissions.some(
      perm => perm.$['android:name'] === 'android.permission.PACKAGE_USAGE_STATS'
    );
    
    if (!hasUsageStats) {
      permissions.push({
        $: { 'android:name': 'android.permission.PACKAGE_USAGE_STATS' },
      });
    }
    
    return config;
  });
};
