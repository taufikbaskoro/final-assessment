import Layout from '@layout';
import { useRouter } from 'next/router';
import { reOrder as mutationReorder, getCmsBlocks, } from '@core_modules/assessment/services/graphql';

const Home = (props) => {
    const {
        t, HomeView, pageConfig,
    } = props;
    const router = useRouter();
    const config = {
        title: t('assessment:dashboard:pageTitle'),
        header: false, // available values: "absolute", "relative", false (default)
        bottomNav: 'account',
    };
    const [actionReorder] = mutationReorder();
    const {
        data,
    } = getCmsBlocks({ identifiers: ['pwa_footer'] });

    return (
        <Layout pageConfig={pageConfig || config} {...props}>
            <HomeView {...props} data={data} />
        </Layout>
    );
};

export default Home;
