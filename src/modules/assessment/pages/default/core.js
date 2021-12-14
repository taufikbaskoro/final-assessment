import Layout from '@layout';
import { useRouter } from 'next/router';
import { getCategories, subscription } from '@core_modules/assessment/services/graphql'; 
import { reOrder as mutationReorder, getCmsBlocks, } from '@core_modules/assessment/services/graphql';

const Home = (props) => {
    const { error, loading, data: categories } = getCategories();
    const [handleSubscription] = subscription();
    const {
        t, HomeView, pageConfig,
    } = props;
    const router = useRouter();
    const config = {
        title: t('assessment:dashboard:pageTitle'),
        header: false, // available values: "absolute", "relative", false (default)
        bottomNav: 'account',
    };
    const {
        data,
    } = getCmsBlocks({ identifiers: ['pwa_footer'] });

    const dataProps = {
        error, loading, categories,
        handleSubscription
    }

    return (
        <Layout pageConfig={pageConfig || config} {...props}>
            <HomeView {...props} data={data} dataProps={dataProps} />
        </Layout>
    );
};

export default Home;
