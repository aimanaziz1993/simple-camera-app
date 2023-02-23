import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const LinearProgressCustom = styled(LinearProgress)(({theme}) => ({
  height: 10,
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: theme.palette.mode === 'light' ? '#AA093C' : '#DC143C',
  },
}));

function LinearProgressWithLabel(props) {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', color: 'grey.500', mr: 0 }}>
        <LinearProgressCustom variant="determinate" {...props} />
        <Typography variant="h6" component="div" sx={{ color: "#DC143C", fontWeight: "700", fontSize: "2rem", marginLeft: "20px", marginTop: "13px" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
        <span className="text-center text-rose-700 px-4 font-semibold">Uploading <span className='dot-animate'>...</span></span>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;