import React from 'react'
import { Typography } from '@material-ui/core';

const Paragraph = (props) => {
    const {
        paragraph
    } = props
    return (
        <Typography variant="p" component="p">
            {paragraph}
        </Typography>
    )
}

export default Paragraph;
