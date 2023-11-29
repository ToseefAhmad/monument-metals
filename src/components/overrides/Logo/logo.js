import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { useScreenSize } from '@app/hooks/useScreenSize';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './logo.module.css';
import logoDesktop from './MonumentLogo.png';
import logoLightDesktop from './MonumentLogoLight.png';
import logoLightMobile from './MonumentLogoLightMobile.png';
import logoLightMobile2x from './MonumentLogoLightMobile@2x.png';
import logoMobile from './MonumentLogoMobile.png';
import logoMobile2x from './MonumentLogoMobile@2x.png';

const Logo = ({ height, width, variant, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const { isMobileScreen } = useScreenSize();

    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Monument Metals' });

    let logo;
    let logo2x;
    let logoClass;
    if (variant === 'primary') {
        logo = isMobileScreen ? logoMobile : logoDesktop;
        logo2x = isMobileScreen ? logoMobile2x : null;
        logoClass = classes.logo;
    } else if (variant === 'light') {
        logo = isMobileScreen ? logoLightMobile : logoLightDesktop;
        logo2x = isMobileScreen ? logoLightMobile2x : null;
        logoClass = classes.logoLight;
    }

    const src = resourceUrl(logo, {
        type: 'image-wysiwyg',
        quality: 100
    });

    const srcSet = logo2x
        ? `${resourceUrl(logo2x, {
              type: 'image-wysiwyg',
              quality: 100
          })} 2x`
        : null;

    return (
        <img title={title} alt={title} className={logoClass} height={height} width={width} src={src} srcSet={srcSet} />
    );
};

Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string,
        logoLight: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number,
    variant: PropTypes.oneOf(['primary', 'light'])
};

Logo.defaultProps = {
    height: 64,
    width: 239,
    variant: 'primary'
};

export default Logo;
