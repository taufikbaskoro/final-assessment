import { withTranslation } from '@i18n';
import { withApollo } from '@lib_apollo';

import Core from '@core_modules/assessment/pages/default/core';
import HomeView from '@core_modules/assessment/pages/default/components/home';

const Page = (props) => (
    <Core
        {...props}
        HomeView={HomeView}
    />
);

Page.getInitialProps = async () => ({
    namespacesRequired: ['common', 'customer', 'rewardpoint', 'productreview', 'assessment'],
});

export default withApollo({ ssr: true })(withTranslation()(Page));
