module.exports = {
    theme: {
        fontFamily: {
            sans: ['Proxima Nova', 'sans-serif']
        },
        colors: {
            white: {
                DEFAULT: '#FFFFFF',
                dark: '#F0F2F5'
            },
            black: {
                DEFAULT: '#000000',
                light: '#000914',
                lighten: '#06080D',
                lightest: '#111927'
            },
            gray: {
                light: '#E6E9EB',
                lighten: '#29303D',
                footerText: '#CFD1D4',
                cmsPageMenu: '#EFF1F4',
                DEFAULT: '#CDCFD1',
                dark: '#66686C'
            },
            red: {
                light: '#B22234',
                DEFAULT: '#991D2D',
                dark: '#7F1825'
            },
            blue: {
                light: '#1C2940',
                lighter: '#002F66',
                DEFAULT: '#002147',
                dark: '#00152E'
            },
            green: {
                DEFAULT: '#09AF1B',
                dark: '#07AF1B'
            },
            gold: '#CFA201',
            inherit: 'inherit'
        },
        container: {
            screens: {},
            center: true
        },
        extend: {
            screens: {
                xxs: '375px',
                xs: '600px',
                '2sm': '769px',
                desktop: '1210px',
                'hover-hover': { raw: '(hover: hover) and (pointer: fine)' }
            },
            fill: {
                red: {
                    light: '#B22234',
                    DEFAULT: '#991D2D',
                    dark: '#7F1825'
                },
                black: {
                    DEFAULT: '#000000',
                    light: '#000914',
                    lighten: '#06080D',
                    lightest: '#111927'
                },
                blue: {
                    light: '#1C2940',
                    lighter: '#002F66',
                    DEFAULT: '#002147',
                    dark: '#00152E'
                }
            },
            fontSize: {
                xss: ['0.625rem', { lineHeight: '1.125rem' }],
                xs: ['0.75rem', { lineHeight: '1.25rem' }],
                sm: ['0.875rem', { lineHeight: '1.875rem' }],
                base: ['1rem', { lineHeight: '2rem' }],
                lg: ['1.125rem', { lineHeight: '2rem' }],
                xl: ['1.25rem', { lineHeight: '2.125rem' }],
                '2xl': ['1.5rem', { lineHeight: '3rem' }],
                '2.3xl': ['1.625rem', { lineHeight: '2.5rem' }],
                '2.5xl': ['1.75rem', { lineHeight: '2.625rem' }],
                '4xl': ['2.25rem', { lineHeight: '3.125rem' }],
                '4.5xl': ['2.375rem', { lineHeight: '3.25rem' }]
            },
            lineHeight: {
                '0': '0',
                '7.5': '1.875rem',
                '8.5': '2.125rem',
                '9.5': '2.375rem'
            },
            borderRadius: {
                sm: '0.1875rem'
            },
            boxShadow: {
                header: '0 5px 20px rgb(17 25 39 / 10%)',
                tileShadowDarker: '0px 7px 10px 10px rgb(0 0 0 / 10%)',
                tileShadowLight: '0 0 40px rgb(17 25 39 / 10%)'
            },
            height: {
                '4.25': '1.0625rem',
                '4.5': '1.125rem',
                '7.5': '1.875rem',
                '8.5': '2.125rem',
                '9.5': '2.375rem',
                '11.5': '2.875rem',
                '12.5': '3.125rem',
                '15': '3.75rem',
                '15.5': '3.875rem',
                '19': '4.75rem',
                '22.5': '5.625rem',
                '25': '6.25rem',
                '27.5': '6.875rem',
                '50': '12.5rem',
                '16': '4rem',
                '23': '5.75rem',
                fit: 'fit-content',
                '25.5': '6.375rem',
                '26': '6.5rem',
                '35.75': '8.9375rem'
            },
            width: {
                '4.25': '1.0625rem',
                '4.5': '1.125rem',
                '15': '3.75rem',
                '27.5': '6.875rem',
                '28.5': '7.125rem',
                '50': '12.5rem',
                '68.75': '17.188rem',
                '94': '23.5rem',
                '100': '25rem',
                '71.25': '17.8125rem',
                '117.5': '29.375rem',
                '292.5': '73.125rem',
                '90p': '90%',
                '100vw': '100vw'
            },
            maxWidth: {
                desktop: '1210px',
                '11.5': '2.875rem',
                '12.5': '3.125rem'
            },
            minHeight: {
                '10': '2.5rem',
                '11.5': '2.875rem',
                '12': '3rem',
                '12.5': '3.125rem',
                '14': '3.5rem',
                '25': '6.25rem',
                '83.75': '20.938rem',
                '22': '5.5rem',
                '160': '40rem',
                '192': '12rem',
                '240': '60rem',
                '288': '72rem'
            },
            borderWidth: {
                '1': '0.063rem',
                '3': '3px'
            },
            borderColor: {
                blue: {
                    DEFAULT: 'rgba(0, 33, 71, var(--tw-border-opacity))'
                }
            },
            spacing: {
                breadcrumbs: '3.125rem',
                lg: '1.25rem',
                '0.25': '0.063rem',
                '0.5': '0.125rem',
                '1.25': '0.3125rem',
                '1.3': '0.313rem',
                '2.25': '0.563rem',
                '2.5': '0.625rem',
                '3.25': '0.813rem',
                '3.75': '0.938rem',
                '4.25': '1.063rem',
                '4.5': '1.125rem',
                '5': '1.25rem',
                '1/7': '71%',
                '1/8': '80%',
                '6.25': '1.5625rem',
                '6.75': '1.6875rem',
                '7.5': '1.875rem',
                '8.75': '2.188rem',
                '9.3': '2.313rem',
                '10.5': '2.313rem',
                '11.5': '2.875rem',
                '12': '3rem',
                '12.5': '3.125rem',
                '14': '3.5rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '17.5': '4.375rem',
                '18.75': '4.688rem',
                '19.5': '4.875rem',
                '23.75': '5.938rem',
                '25': '6.25rem',
                '27.5': '6.875rem',
                '30': '7.5rem',
                '32.5': '8.125rem',
                '41.25': '10.313rem',
                '45': '11.25rem',
                '55': '13.75rem',
                '83.75': '20.938rem',
                '87.5': '21.875rem',
                '92.5': '23.125rem',
                '137.5': '34.375rem',
                '150': '37.5rem',
                '155': '38.75rem',
                '160': '40rem',
                '192': '48rem',
                '240': '60rem',
                '288': '72rem',
                '292.5': '73.125rem',
                '50p': '50%'
            },
            minWidth: {
                '39%': '39%',
                '10': '2.5rem',
                '11.5': '2.875rem',
                '34': '8.5rem',
                '40': '10rem',
                '41.25': '10.313rem',
                '46.5': '11.625rem',
                '51.25': '12.8125rem',
                '60': '15rem',
                '117.5': '29.375rem'
            },
            padding: {
                mobile: '1.25rem',
                '1.25': '0.3125rem',
                '3.75': '0.938rem',
                '5.5': '1.375rem',
                '7.3': '1.825rem',
                '7.5': '1.875rem',
                '6.5': '1.625rem',
                '13.5': '3.375rem',
                '22.5': '5.625rem',
                '25': '6.25rem',
                '1.75': '0.438rem',
                '6.25': '1.563rem',
                '11.252': '2.813rem',
                '12.5': '3.125rem',
                '17.5': '4.375rem'
            },
            gap: {
                '1.25': '0.313rem',
                '3.75': '0.938rem',
                lg: '1.25rem'
            },
            inset: {
                '16': '4rem',
                '50': '12.5rem',
                screen: '100vw',
                '7.5': '1.875rem',
                '12.5': '3.125rem'
            },
            margin: {
                '1.25': '0.3125rem',
                '6.5': '1.625rem',
                '7.5': '1.875rem',
                '10.5': '2.625rem',
                '12.5': '3.125rem',
                '50vw': '50vw'
            },
            zIndex: {
                1: '1',
                2: '2',
                60: '60'
            },
            gridTemplateRows: {
                mobileNavigation: '1fr 10fr 1fr'
            },
            gridTemplateColumns: {
                auto1fr: '1fr auto',
                productPage: 'minmax(420px, 620px) minmax(100px, 500px);'
            },
            transitionProperty: {
                accountMenu: 'visibility, opacity, transform, left'
            },
            stroke: {
                white: '#fff'
            },
            translate: {
                reverse: '-100%'
            }
        }
    }
};
