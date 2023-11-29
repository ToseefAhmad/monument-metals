import React from 'react';
import { X as closeIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { useOlarkHelper } from '@app/components/Olark/useOlarkHelper';
import PreorderLabel from '@app/components/PreorderLabel';
import { useProductAddedModalContext } from '@app/components/ProductAddedModal/useProductAddedModalContext';
import { POPUP_CONFIG } from '@app/util/popup';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import classes from './productAddedModal.module.css';

const ProductAddedModal = () => {
    const { showModal, setShowModal, modalData } = useProductAddedModalContext();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const handlePopupClose = () => {
        setShowModal(false);
    };

    const handleProceedToCheckout = () => {
        handlePopupClose();
        history.push('/cart');
    };
    useOlarkHelper(showModal);
    const itemAddedText =
        modalData.qty > 1 ? (
            <FormattedMessage
                id={'productFullDetail.itemsAdded'}
                defaultMessage={'{quantity} items added to your shopping cart'}
                values={{ quantity: modalData.qty }}
            />
        ) : (
            <FormattedMessage id={'productFullDetail.itemAdded'} defaultMessage={'Item added to your shopping cart'} />
        );

    const productImage = modalData.image ? modalData.image : transparentPlaceholder;
    const productImageAltText = modalData.name
        ? modalData.name
        : formatMessage({
              id: 'productFullDetail.productImageAlt',
              defaultMessage: 'Added item image'
          });

    return (
        <Popup open={showModal} onClose={handlePopupClose} {...POPUP_CONFIG}>
            <div className={classes.itemAddedContainer}>
                <Trigger action={handlePopupClose} classes={{ root: classes.itemAddedClose }}>
                    <Icon size={32} src={closeIcon} />
                </Trigger>
                <Image
                    alt={productImageAltText}
                    classes={{ root: classes.itemAddedImageRoot, image: classes.image }}
                    resource={productImage}
                    width={160}
                />
                <div className={classes.itemAddedText}>{itemAddedText}</div>
                <h5 className={classes.productName}>{modalData.name}</h5>
                <PreorderLabel stockStatus={modalData.stock_status} preorderNote={modalData.preorder_note} />
                <div className={classes.itemAddedButtons}>
                    <Button priority={'low'} onClick={handlePopupClose}>
                        <FormattedMessage
                            id={'productFullDetail.continueShopping'}
                            defaultMessage={'Continue shopping'}
                        />
                    </Button>
                    <Button priority={'normal'} onClick={handleProceedToCheckout}>
                        <FormattedMessage id={'productFullDetail.goToCart'} defaultMessage={'Go to cart'} />
                    </Button>
                </div>
            </div>
        </Popup>
    );
};

export default ProductAddedModal;
