module.exports = function localIntercept(targets) {
    targets.of('@magento/pwa-buildpack').transformUpward.tap(def => {
        def.staticFromRoot.inline.body.file.template.inline = './static-assets/{{ filename }}';
    });
};
