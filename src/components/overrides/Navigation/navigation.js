import { shape, string } from 'prop-types';
import React, { Suspense } from 'react';

import CategoryTree from '@app/components/overrides/CategoryTree';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AuthBar from '@magento/venia-ui/lib/components/AuthBar';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import NavHeader from './navHeader';
import defaultClasses from './navigation.module.css';
import { useNavigation } from './useNavigation';

const AuthModal = React.lazy(() =>
    import(/* webpackChunkName: "authModal" */ '@magento/venia-ui/lib/components/AuthModal')
);

const Navigation = props => {
    const {
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view,
        categoriesData,
        isTopLevel,
        loading
    } = useNavigation();

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthModal
                closeDrawer={handleClose}
                showCreateAccount={showCreateAccount}
                showForgotPassword={showForgotPassword}
                showMainMenu={showMainMenu}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
                view={view}
            />
        </Suspense>
    ) : null;

    return (
        <aside className={rootClassName}>
            <header className={classes.header}>
                <NavHeader
                    currentCategoryTitle={categoriesData.category.name}
                    isTopLevel={isTopLevel}
                    onClose={handleClose}
                    onBack={handleBack}
                    view={view}
                />
            </header>
            <div className={bodyClassName}>
                <CategoryTree
                    isTopLevel={isTopLevel}
                    categoriesData={categoriesData}
                    onNavigate={handleClose}
                    setCategoryId={setCategoryId}
                    loading={loading}
                />
            </div>
            <div className={classes.footer}>
                <AuthBar disabled={hasModal} showMyAccount={showMyAccount} showSignIn={showSignIn} />
            </div>
            <div className={modalClassName}>{authModal}</div>
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
    classes: shape({
        body: string,
        form_closed: string,
        form_open: string,
        footer: string,
        header: string,
        root: string,
        root_open: string,
        signIn_closed: string,
        signIn_open: string
    })
};
