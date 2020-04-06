import Layout from "@components/Layouts";
import { withTranslation } from "@i18n";
import useStyles from "./style";
import Link from "next/link";
import Button from "@components/Button";

const Error = (props) => {
    const styles = useStyles();
    const { statusCode, t } = props;

    const statusCodes = {
        400: t("error:400:title"),
        404: t("error:404:title"),
        405: t("error:405:title"),
        500: t("error:500:title")
    };

    const title =
        props.title ||
        statusCodes[statusCode] ||
        "An unexpected error has occurred";

    const pageConfig = {
        title: title,
        className: styles.body
    };
    return (
        <Layout pageConfig={pageConfig}>
            <div className={styles.error}>
                <div className={styles.wrapper}>
                    {statusCode ? (
                        <h1 className={styles.h1}>{statusCode}</h1>
                    ) : null}
                    <div className={styles.desc}>
                        <h2 className={styles.h2}>{title}</h2>
                    </div>
                </div>
                {statusCode === 404 ? (
                    <div className={styles.actions}>
                        <Link href="/">
                            <Button className={styles.toolbarButton}>
                                {t("error:actions:back")}
                            </Button>
                        </Link>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
}


export default withTranslation()(Error);