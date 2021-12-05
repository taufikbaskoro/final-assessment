import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import * as Schema from '@core_modules/assessment/services/graphql/schema';
import { getLoginInfo } from '@helper_auth';

let isLogin = 0;
if (typeof window !== 'undefined') {
    isLogin = getLoginInfo();
}

const config = {
    context: {
        request: 'internal',
    },
};

export const reOrder = () => useMutation(Schema.reOrder, {
    context: {
        request: 'internal',
    },
});

export const getCmsBlocks = (variables) => useQuery(Schema.getCmsBlocks, {
    variables,
    context: {
        request: isLogin ? 'internal' : '',
    },
    fetchPolicy: isLogin ? 'network-only' : 'cache-first',
    skip: typeof window === 'undefined',
});

export const getCategories = () => useQuery(Schema.getCategories);

export const subscription = (variable) => useMutation(Schema.subscribeToNewsLetter, variable);