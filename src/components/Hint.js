import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Hint({ props }) {
    const state = props;
    const CaptionOne = () => "Click Once To Start Recording";
    const CaptionTwo = () => "Evidence Recording In Progress...";

    return (
        <Box sx={{ background: "rgba(0, 0, 0, 0)", display: 'flex', width: '100%', height: "30px", alignItems: 'center', justifyContent: "center", color: "#fff", position: "fixed", top: "80%", zIndex: "100" }}>
            <Typography variant="h6">
                {state ? <CaptionTwo /> : <CaptionOne /> }
            </Typography>
        </Box>
    );
}

export default Hint;