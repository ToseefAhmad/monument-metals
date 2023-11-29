import { useQuery } from '@apollo/client';

import { useSharedCc } from '@app/components/OfflinePayments/SharedCC/useSharedCc';

import {
    getBankTransferConfigQuery,
    saveBankTransferOnCartMutation,
    saveBankTransferCCOnCartMutation,
    saveBankTransferVaultOnCartMutation
} from './bankTransfer.gql';

export const useBankTransfer = ({ shouldSubmit, onPaymentSuccess }) => {
    const mutations = {
        savePayment: saveBankTransferOnCartMutation,
        savePaymentCC: saveBankTransferCCOnCartMutation,
        saveVault: saveBankTransferVaultOnCartMutation
    };

    const { data, loading } = useQuery(getBankTransferConfigQuery);

    const sharedConfig = {
        active: data && data.storeConfig && data.storeConfig.bank_transfer_cc,
        amount: data && data.storeConfig && data.storeConfig.bank_transfer_cc_total
    };

    const {
        cartLoading,
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
        handleVaultSubmit
    } = useSharedCc({
        shouldSubmit,
        onPaymentSuccess,
        mutations,
        sharedConfig
    });

    return {
        instructions: data && data.storeConfig && data.storeConfig.bank_transfer_instructions,
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
