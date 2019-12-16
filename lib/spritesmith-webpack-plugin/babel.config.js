/*
 * @Author: daipeng
 * @Date: 2019-11-29 14:56:36
 * @LastEditors: VSCode
 * @LastEditTime: 2019-11-29 16:17:48
 * @Description: 
 */
const MIN_BABEL_VERSION = 7;
module.exports = (api) => {
    api.assertVersion(MIN_BABEL_VERSION);
    api.cache(true);
    return {
        'presets': [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: '6.9.0',
                    }
                }
            ]
        ]
    }
}