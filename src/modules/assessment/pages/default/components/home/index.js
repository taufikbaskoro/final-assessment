// Library
import React, { useState, useEffect } from 'react';
import Typography from '@common_typography';
import useStyles from '@core_modules/assessment/pages/default/components/home/style';
import { getCategories, subscription } from '@core_modules/assessment/services/graphql'; 
import Grid from '@material-ui/core/Grid' 
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const WihtOut = (props) => {
    const [categoryList, setCategoryList] = useState(null);
    const [input, setInput] = useState('');
    const [toastSuccess, setToastSuccess] = useState(false);
    const [toastFailed, setToastFailed] = useState(false);
    const styles = useStyles();
    const { t, data } = props;
    const { error, loading, data: categories } = getCategories();

    useEffect(() => {
        setCategoryList(categories && categories.categoryList);
    }, [categories])

    const [handleSubscription] = subscription();

    const handleChange = (e) => {
        setInput(e.target.value)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastFailed(false);
        setToastSuccess(false);
    };

    const handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
        }
    }

    const handleSubmit = (params) => {
        handleSubscription({
            variables: {
                email: input
            }
        }).then((res) => {
            if(res.data && res.data.subscribeEmailToNewsletter && res.data.subscribeEmailToNewsletter.status) {
                setToastSuccess(true)
                setInput('')
            }else{
                setToastFailed(true)
                setInput('')
            }
        })
        .catch(() => {
            setToastFailed(true)
            setInput('')
        })
    }

    return (
        <div className={styles.root}>
            <div className={styles.authBlock}>
            <Typography className={styles.textCenter} variant="h2" component="h2">{t('assessment:subscribe:title')}</Typography>
                <form className={styles.formSubs} autoComplete="off">
                    <Input 
                        onKeyPress={handleKeyPress}
                        className={styles.input} 
                        variant="outlined" 
                        placeholder="Email" 
                        type="email"
                        value={input}
                        onChange={handleChange} />
                    <Button className={styles.btnSubs} onClick={() => handleSubmit(input)} size="medium">Subscribe</Button>
                </form>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography className={styles.textCenter} variant="h2" component="h2">{t('assessment:categoryTitle')}</Typography>
                    </Grid>
                {
                    categoryList && 
                        categoryList.map((category, index) =>     
                        <Grid item xs={3} key={category.url_key}>
                            <Paper className={styles.paper}><Typography variant="span">{category.name}</Typography></Paper>
                        </Grid>              
                        )
                    || 'No data...'
                }
                </Grid>
                <Snackbar open={toastSuccess} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {t('assessment:subscribe:success')}
                    </Alert>
                </Snackbar>
                <Snackbar open={toastFailed} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {t('assessment:subscribe:failed')}
                    </Alert>
                </Snackbar>
            </div>
            
        </div>
    );
};

export default WihtOut;
