import { withTranslation } from '@i18n';
import { withApollo } from '@lib_apollo';
import React from 'react'

const Page = (props) => {
    return (
        <div>
            <h2>Hello World</h2>
        </div>
    )
}

Page.getInitialProps = async (ctx) => ({
    namespaceRequired: ['common', 'register', 'validate'],
    query: ctx.query
})

export default withApollo({ ssr: true })(withTranslation()(Page));
