import makeStyles from '@material-ui/core/styles/makeStyles';
import {
    FlexColumn, CreatePadding, Centering, CreateMargin
} from '@theme_mixins';

import { GRAY_LIGHT } from '@theme_color';

export default makeStyles({
    root: {
        width: '100%',
        height: '100%',
        ...FlexColumn,
        alignItems: 'center',
    },
    authBlock: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'space-between',
        width: '100%',
        height: '65vh',
        ...CreatePadding(15, 30, 15, 30),
        textAlign: 'center',
    },
    paper: {
        ...CreatePadding(15, 0, 15, 0)
    },
    formSubs: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        ...CreateMargin(15, 0, 15, 0)
    },
    btnSubs: {
        ...CreatePadding(18, 10, 18, 10),
        borderRadius: '8px'
    },
    input: {
        flex: 1
    },
    textCenter: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24
    },
    btnSigin: {
        marginBottom: 35,
        marginTop: 15,
    },
    span: {
        width: '100%',
        height: 20,
        background: GRAY_LIGHT,
    },
});
