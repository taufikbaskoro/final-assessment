import { getCartId, setCartId } from '@helpers/cartId';
import { getToken } from '@helpers/token';
import { GraphCart } from '@services/graphql';
import { setCountCart } from '@stores/actions/cart';
// import Router from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addSimpleProductsToCart } from '../../services/graphql';
import Footer from './Footer';

export default ({
    setOpen,
    t,
    data: { __typename, sku },
    setMessage,
    loading,
    setLoading,
}) => {
    const [qty, setQty] = React.useState(1);
    const handleQty = (event) => {
        setQty(event.target.value);
    };
    const dispatch = useDispatch();

    let cartId = '';
    let tokenCustomer = '';

    if (typeof window !== 'undefined') {
        tokenCustomer = getToken();
        cartId = getCartId();
    }

    const [addCartSimple] = addSimpleProductsToCart(tokenCustomer);
    const [getGuestCartId] = GraphCart.getGuestCartId();

    const handleAddToCart = async () => {
        setLoading(true);
        const errorMessage = {
            variant: 'error',
            text: t('product:failedAddCart'),
            open: true,
        };
        if (!cartId || cartId === '' || cartId === undefined) {
            if (tokenCustomer === '' || !tokenCustomer) {
                await getGuestCartId()
                    .then((res) => {
                        const token = res.data.createEmptyCart;
                        cartId = token;
                        setCartId(token);
                    })
                    .catch(() => {
                        setLoading(false);
                        setMessage(errorMessage);
                    });
            }
        }
        if (__typename === 'SimpleProduct') {
            addCartSimple({
                variables: {
                    cartId,
                    sku,
                    qty: parseFloat(qty),
                },
            })
                .then((res) => {
                    dispatch(
                        setCountCart(res.data.addSimpleProductsToCart.cart.total_quantity),
                    );
                    setMessage({
                        variant: 'success',
                        text: t('product:successAddCart'),
                        open: true,
                    });
                    setLoading(false);
                    setOpen(false);
                })
                .catch(() => {
                    setLoading(false);
                    setMessage(errorMessage);
                });
        }
    };

    return (
        <Footer
            qty={qty}
            handleQty={handleQty}
            handleAddToCart={handleAddToCart}
            t={t}
            loading={loading}
        />
    );
};