import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CircularProgressCustom = styled(CircularProgress)(({theme}) => ({
    height: 0,
    borderRadius: 0,
    [`&.${circularProgressClasses.colorPrimary}`]: {
        color: "#AA093C",
    },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ 
        background: "rgba(0, 0, 0, 0)", 
        display: 'flex', 
        width: '100%', 
        height: "auto", 
        alignItems: 'center', 
        justifyContent: "center", 
        color: "#fff", 
        position: "fixed",
        top: "50%", 
        zIndex: "100" }}>
      <CircularProgressCustom size={100} variant="determinate" {...props} />
      <Box
        sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="div" sx={{ color: "#DC143C", fontWeight: "700" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function ProgressCircle(props) {
    return <CircularProgressWithLabel {...props} />;
}