import { modules } from '@config';

import gqlService from '../../../../services/graphql';

const DiscountSection = (props) => {
    const {
        t, checkout, setCheckout, handleOpenMessage, storeConfig, StoreCreditView,
    } = props;
    const [applyStoreCreditToCart] = gqlService.applyStoreCreditToCart({
        onError: (e) => {
            const message = e.message.split(':');
            handleOpenMessage({
                variant: 'error',
                text: message[1] ? message[1] : e.message,
            });
        },
    });
    const [removeStoreCreditFromCart] = gqlService.removeStoreCreditFromCart({
        onError: (e) => {
            const message = e.message.split(':');
            handleOpenMessage({
                variant: 'error',
                text: message[1] ? message[1] : e.message,
            });
        },
    });

    let store_credit = null;
    let credit = '0';
    let total = 0;

    if (checkout.data.customer && checkout.data.cart) {
        store_credit = {
            ...checkout.data.customer.store_credit,
            ...checkout.data.cart.applied_store_credit,
        };

        credit = store_credit.current_balance.value || 0;
        credit = store_credit.is_use_store_credit ? `${store_credit.store_credit_amount}` : credit;
        total = checkout.data.cart.prices.grand_total.value;
    }

    const handleUseCredit = async () => {
        let cart;
        const state = { ...checkout };
        const cartId = state.data.cart.id;
        state.loading.storeCredit = true;

        if (store_credit.is_use_store_credit) {
            const result = await removeStoreCreditFromCart({ variables: { cartId } });
            cart = result && {
                ...state.data.cart,
                ...result.data.removeStoreCreditFromCart.cart,
            };
            if (result) {
                handleOpenMessage({
                    variant: 'success',
                    text: t('checkout:message:storeCreditRemoved'),
                });
            }
        } else {
            const result = await applyStoreCreditToCart({ variables: { cartId } });
            cart = result && {
                ...state.data.cart,
                ...result.data.applyStoreCreditToCart.cart,
            };
            if (result) {
                handleOpenMessage({
                    variant: 'success',
                    text: t('checkout:message:storeCreditApplied'),
                });
            }
        }

        if (cart) {
            state.data.cart = cart;
        }

        state.loading.storeCredit = false;
        setCheckout(state);
    };

    if (store_credit && (store_credit.enabled || modules.storecredit.enabled)) {
        return (
            <StoreCreditView
                store_credit={store_credit}
                credit={credit}
                storeConfig={storeConfig}
                checkout={checkout}
                handleUseCredit={handleUseCredit}
                total={total}
                t={t}
            />
        );
    }

    return null;
};

export default DiscountSection;
