import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Hint({ props }) {
    const state = props;
    const CaptionOne = () => "";
    const CaptionTwo = () => { return (<span>Evidence Recording In Progress <span className='dot-animate'>...</span></span>)};

    return (
        <Box sx={{ 
            background: "rgba(0, 0, 0, 0)", 
            display: 'flex', 
            width: '100%', 
            height: "30px", 
            alignItems: 'center', 
            justifyContent: "center", 
            color: "#fff", 
            position: "fixed", 
            bottom: "25%", 
            zIndex: "100" }}>
            <Typography variant="h6" sx={{ color: "crimson", fontWeight: "600" }}>
                {state ? <CaptionTwo /> : <CaptionOne /> }
            </Typography>
        </Box>
    );
}

export default Hint;