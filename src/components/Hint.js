import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Hint({ props }) {
    const state = props;
    const CaptionOne = () => "Click once to start recording";
    const CaptionTwo = () => "Click once to stop recording";

    return (
        <Box sx={{ background: "rgba(0, 0, 0, 0.5)", display: 'flex', width: '100%', height: "20px", alignItems: 'center', justifyContent: "center", color: "#fff", position: "fixed", top: "75%", zIndex: "100" }}>
            <Typography variant="caption">
                {state ? <CaptionTwo /> : <CaptionOne /> }
            </Typography>
        </Box>
    );
}

export default Hint;