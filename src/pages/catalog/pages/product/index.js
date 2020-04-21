import Layout from '@components/Layouts';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from '@i18n';
import { getProduct } from './services/graphql';
import Content from './components';
import CustomHeader from './components/header';

const Loading = () => (
    <div className="full-center"><CircularProgress size="25rem" /></div>
);

const Page = (props) => {
    let product = {};
    const { slug } = props;
    const { loading, data, error } = getProduct(slug[0]);
    if (loading || !data) return <Loading />;
    if (data) product = data.products;
    if (error) return <Loading />;
    const pageConfig = {
        title: product.items[0].name || '',
        bottomNav: false,
        header: 'absolute', // available values: "absolute", "relative", false (default)
    };
    return (
        <Layout pageConfig={pageConfig} CustomHeader={<CustomHeader />}>
            <Content {...props} data={product.items[0]} />
        </Layout>
    );
};

export default withTranslation()(Page);
