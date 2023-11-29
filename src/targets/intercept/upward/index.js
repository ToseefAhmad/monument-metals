const { merge } = require('lodash');

const extendedDefinitions = require('./definitions.json');

module.exports = targets => {
    // Extend upward.yml with customized definitions
    targets.of('@magento/pwa-buildpack').transformUpward.tap(definitions => {
        merge(definitions, extendedDefinitions);
    });
};
