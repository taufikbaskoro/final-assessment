/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Badge from '@material-ui/core/Badge';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

const useStyles = makeStyles({
    root: {
        margin: 20,
        cursor: 'pointer',
    },
});

const WithLink = ({ compareList, handleLink }) => {
    const styles = useStyles();
    return (
        <div className={styles.root} onClick={handleLink}>
            {compareList ? (
                <Badge color="secondary" badgeContent={compareList.compareList.item_count > 0 ? compareList.compareList.item_count : 0}>
                    <CompareArrowsIcon color="secondary" />
                </Badge>
            ) : (
                <Badge color="secondary" badgeContent={0}>
                    <CompareArrowsIcon color="secondary" />
                </Badge>
            )}
        </div>
    );
};

export default WithLink;