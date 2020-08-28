import makeStyles from '@material-ui/core/styles/makeStyles';
import { WHITE } from '@theme/colors';
import {
    CreatePadding, CreateMargin,
    Centering, FlexColumn,
} from '@theme/mixins';

const useStyles = makeStyles((theme) => ({
    checkoutBox: {
        background: WHITE,
        ...CreatePadding(5, 18, 18, 18),
        boxShadow: '0 -1px 3px #0000001A',
        position: 'fixed',
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        zIndex: theme.zIndex.drawer + 1,
    },
    summary: {
        textAlign: 'center',
        padding: 10,
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
    },
    goToCheckout: {
        minWidth: 300,
    },
    subtotal: {
        fontSize: 16,
        textAlign: 'center',
        ...CreateMargin(10, 0, 10, 0),
    },
    expand: {
        margin: 0,
        padding: 0,
        width: '100%',
        border: 'none',
        boxShadow: 'none',
    },
    expanBody: {
        width: '100%',
        margin: 0,
        padding: 0,
        ...FlexColumn,
    },

    expanHead: {
        maxHeight: 20,
        minHeight: 15,
        ...Centering,
        ...CreateMargin(10, 0, 10, 0),
    },
    expandHeadOpen: {
        maxHeight: '20px !important',
        minHeight: 15,
        ...Centering,
        ...CreateMargin(0, 0, 0, 0),
        ...CreatePadding(0, 0, 0, 0),
    },

    labelItem: {
        maxWidth: '50%',
    },
}));

export default useStyles;