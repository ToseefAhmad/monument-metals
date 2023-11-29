/**
 * List of interceptors
 */
const interceptors = [require('./static-assets'), require('./routes'), require('./payments'), require('./upward')];

/**
 * Register new interceptors here
 * @param targets
 */
module.exports = targets => {
    interceptors.forEach(interceptor => {
        interceptor(targets);
    });
};
