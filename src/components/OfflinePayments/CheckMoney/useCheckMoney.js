import { useQuery } from '@apollo/client';

import { useSharedCc } from '@app/components/OfflinePayments/SharedCC/useSharedCc';

import {
    getCheckMoneyConfigQuery,
    saveCheckMoneyOnCartMutation,
    saveCheckMoneyCCOnCartMutation,
    saveCheckMoneyVaultOnCartMutation
} from './checkMoney.gql';

export const useCheckMoney = ({ shouldSubmit, onPaymentSuccess }) => {
    const mutations = {
        savePayment: saveCheckMoneyOnCartMutation,
        savePaymentCC: saveCheckMoneyCCOnCartMutation,
        saveVault: saveCheckMoneyVaultOnCartMutation
    };

    const { data, loading } = useQuery(getCheckMoneyConfigQuery);

    const sharedConfig = {
        active: data && data.storeConfig && data.storeConfig.checkmo_cc,
        amount: data && data.storeConfig && data.storeConfig.checkmo_cc_total
    };

    const {
        isScriptLoaded,
        configLoading,
        isCcAllowed,
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit,
        cartLoading
    } = useSharedCc({
        shouldSubmit,
        onPaymentSuccess,
        mutations,
        sharedConfig
    });

    return {
        checkAddress: data && data.storeConfig && data.storeConfig.checkmo_address,
        additionalInfo: data && data.storeConfig && data.storeConfig.checkmo_pay_to,
        isLoading: loading || configLoading || cartLoading || (isCcAllowed && !isScriptLoaded),
        isCcAllowed,
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    };
};
