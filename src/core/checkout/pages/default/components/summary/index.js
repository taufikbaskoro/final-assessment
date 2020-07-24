import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { setCartId, removeCartId } from '@helpers/cartId';
import { setCheckoutData } from '@helpers/cookies';
import { GraphCart } from '@services/graphql';
import Routes from 'next/router';
import _ from 'lodash';
import { formatPrice } from '@helpers/currency';
import gqlService from '../../../../services/graphql';

const Summary = ({
    t,
    checkout,
    setCheckout,
    handleOpenMessage,
    formik,
    updateFormik,
    storeConfig,
    SummaryView,
    config,
}) => {
    const { order: loading, all: disabled } = checkout.loading;
    const client = useApolloClient();
    const [orderId, setOrderId] = useState(null);
    const [snapOpened, setSnapOpened] = useState(false);
    const [snapClosed, setSnapClosed] = useState(false);
    const [setGuestEmailAddressOnCart] = gqlService.setGuestEmailAddressOnCart(({ onError: () => {} }));
    const [getSnapToken, manageSnapToken] = gqlService.getSnapToken({ onError: () => {} });
    const [setPaymentMethod] = gqlService.setPaymentMethod({ onError: () => {} });
    const [placeOrder] = gqlService.placeOrder({ onError: () => {} });
    const [getSnapOrderStatusByOrderId, snapStatus] = gqlService.getSnapOrderStatusByOrderId({ onError: () => {} });
    const [getCustCartId, manageCustCartId] = GraphCart.getCustomerCartId();
    const [mergeCart] = GraphCart.mergeCart();

    const validateReponse = (response, parentState) => {
        const state = parentState;
        if ((response && response.errors) || !response) {
            state.loading.order = false;
            setCheckout(state);

            handleOpenMessage({
                variant: 'error',
                text: t('checkout:message:serverError'),
            });

            return false;
        }

        return true;
    };

    const generatesuccessRedirect = () => {
        if (config.successRedirect && config.successRedirect.link) {
            return `${config.successRedirect.link}${config.successRedirect.orderId ? `?orderId=${orderId}` : ''}`;
        }
        return '/checkout/onepage/success';
    };

    const generateCartRedirect = () => {
        if (config.cartRedirect && config.cartRedirect.link) {
            return config.cartRedirect.link;
        }
        return '/checkout/cart';
    };

    const handlePlaceOrder = async () => {
        const { cart, isGuest } = checkout.data;
        let state = { ...checkout };
        let formValidation = {};
        let result;

        state.loading.order = true;
        setCheckout(state);

        if (cart.prices.grand_total.value === 0 && (cart.selected_payment_method && cart.selected_payment_method.code !== 'free')) {
            state = { ...checkout };
            result = await setPaymentMethod({ variables: { cartId: cart.id, code: 'free' } });

            if (!validateReponse(result, state)) {
                return;
            }

            state.data.cart = result.data.setPaymentMethodOnCart.cart;
            setCheckout(state);
            updateFormik(result.data.setPaymentMethodOnCart.cart);
        }

        await formik.submitForm();
        formValidation = await formik.validateForm();

        if (_.isEmpty(formValidation)) {
            if (checkout.selected.delivery === 'pickup'
                && (checkout.error.pickupInformation || checkout.error.selectStore)) {
                state.loading.order = false;
                setCheckout(state);

                const msg = t('checkout:completePikcupInfo');
                handleOpenMessage({
                    variant: 'error',
                    text: msg,
                });
            } else {
                if (isGuest) {
                    result = await setGuestEmailAddressOnCart({ variables: { cartId: cart.id, email: formik.values.email } });

                    if (!validateReponse(result, state)) {
                        return;
                    }
                }

                result = await placeOrder({ variables: { cartId: cart.id } });

                state = { ...checkout };
                state.loading.order = false;
                setCheckout(state);

                if (!validateReponse(result, state)) {
                    return;
                }

                const orderNumber = result.data.placeOrder.order.order_number;
                setCheckoutData({
                    email: isGuest ? formik.values.email : cart.email,
                    order_number: orderNumber,
                    order_id: result.data.placeOrder.order.order_id,
                });
                client.writeData({ data: { totalCart: 0 } });
                await removeCartId();

                if (checkout.data.cart.selected_payment_method.code.match(/snap.*/)) {
                    setOrderId(orderNumber);
                    await getSnapToken({ variables: { orderId: orderNumber } });
                } else {
                    handleOpenMessage({
                        variant: 'success',
                        text: t('checkout:message:placeOrder'),
                    });
                    Routes.push({ pathname: generatesuccessRedirect() });
                }
            }
        } else {
            state.loading.order = false;
            setCheckout(state);

            const msg = checkout.data.isGuest
                ? t('checkout:message:guestFormValidation')
                : t('checkout:message:customerFormValidation');

            handleOpenMessage({
                variant: 'error',
                text: msg,
            });
        }
    };

    // Start - Manage Snap Pop Up When Opened (Waiting Response From SnapToken)
    if (manageSnapToken.data && orderId && !snapOpened) {
        const snapToken = manageSnapToken.data.getSnapTokenByOrderId.snap_token;
        snap.pay(snapToken, {
            async onSuccess() {
                window.location.replace(generatesuccessRedirect());
            },
            async onPending() {
                window.location.replace(generatesuccessRedirect());
            },
            async onError() {
                getSnapOrderStatusByOrderId({
                    variables: {
                        orderId,
                    },
                });

                if (!checkout.data.isGuest) {
                    getCustCartId();
                }

                setSnapOpened(true);
            },
            async onClose() {
                getSnapOrderStatusByOrderId({
                    variables: {
                        orderId,
                    },
                });

                if (!checkout.data.isGuest) {
                    getCustCartId();
                }

                setSnapOpened(true);
            },
        });
    }
    // End - Manage Snap Pop Up When Opened (Waitinge Response From SnapToken)

    // Start - Process Snap Pop Up Close (Waitinge Response From Reorder)
    if (snapStatus.data && !snapClosed) {
        const { cart_id } = snapStatus.data.getSnapOrderStatusByOrderId;
        setSnapClosed(true);

        if (!checkout.data.isGuest && manageCustCartId.data) {
            const { id: customerCartId } = manageCustCartId.data.customerCart;
            if (cart_id !== customerCartId) {
                mergeCart({
                    variables: {
                        sourceCartId: cart_id,
                        destionationCartId: customerCartId,
                    },
                }).then(async () => {
                    await setCartId(customerCartId);
                    setOrderId(null);
                    window.location.replace(generateCartRedirect());
                }).catch(() => {
                    window.location.replace(generateCartRedirect());
                });
            } else {
                setCartId(customerCartId);
                setOrderId(null);
                window.location.replace(generateCartRedirect());
            }
        } else {
            setCartId(cart_id);
            setOrderId(null);
            window.location.replace(generateCartRedirect());
        }
    }
    // End - Process Snap Pop Up Close (Waitinge Response From Reorder)

    // Start - Manage Summary
    let data = [];
    let total = 0;
    if (checkout.data.cart) {
        const {
            prices,
            items,
            shipping_addresses,
            applied_store_credit,
            applied_reward_points,
            applied_giftcard,
        } = checkout.data.cart;

        const globalCurrency = storeConfig.default_display_currency_code;

        if (items) {
            const sumTotalItem = items.reduce(
                (prev, curr) => ({
                    value: prev.value + curr.prices.row_total.value,
                    currency: curr.prices.row_total.currency,
                }),
                { value: 0 },
            );
            const subtotal = formatPrice(sumTotalItem.value, sumTotalItem.currency);
            total = prices.grand_total;
            const [shipping] = shipping_addresses;

            data.push({ item: 'sub total', value: subtotal });

            if (shipping && shipping.selected_shipping_method) {
                const shippingMethod = shipping.selected_shipping_method;
                const price = formatPrice(shippingMethod.amount.value, shippingMethod.amount.currency);
                data.push({ item: 'shipping', value: price });
            }

            if (_.isArray(prices.discounts)) {
                const discounts = prices.discounts.map((disc) => {
                    const price = formatPrice(disc.amount.value, disc.amount.currency);
                    return { item: `${disc.label} - ${price}`, value: `-${price}` };
                });
                data = data.concat(discounts);
            }

            if (applied_store_credit.is_use_store_credit) {
                const price = formatPrice(Math.abs(applied_store_credit.store_credit_amount), globalCurrency);
                data.push({ item: `Store Credit - ${price}`, value: `-${price}` });
            }

            if (applied_reward_points.is_use_reward_points) {
                const price = formatPrice(Math.abs(applied_reward_points.reward_points_amount), globalCurrency);
                data.push({ item: `Reward Point - ${price}`, value: `-${price}` });
            }

            if (applied_giftcard) {
                const giftCards = applied_giftcard.giftcard_detail.map((item) => {
                    const price = formatPrice(Math.abs(item.giftcard_amount_used), globalCurrency);
                    return { item: `Gift Card (${item.giftcard_code}) - ${price}`, value: `-${price}` };
                });
                data = data.concat(giftCards);
            }
        }
    }
    // End - Manage Summary

    return (
        <SummaryView
            t={t}
            handlePlaceOrder={handlePlaceOrder}
            loading={loading}
            data={data}
            total={total}
            disabled={disabled}
        />
    );
};

export default Summary;