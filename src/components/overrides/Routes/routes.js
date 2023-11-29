import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import MainShimmer from '@app/components/overrides/Main/main.shimmer';
import MainLayout from '@app/layouts/MainLayout';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);

    return (
        <Suspense fallback={<MainShimmer />}>
            <Switch>
                {/*
                 * Client-side routes are injected by BabelRouteInjectionPlugin here.
                 * Venia's are defined in packages/venia-ui/lib/targets/venia-ui-intercept.js
                 */}
                <Route>
                    <MainLayout>
                        <MagentoRoute />
                    </MainLayout>
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
const availableRoutes = [];
export { availableRoutes };
