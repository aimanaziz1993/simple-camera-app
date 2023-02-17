import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export default function ModalSuccess({ props }) {
    const prop = props
    const modalRef = React.useRef();
    const [open, setOpen] = React.useState(prop ? true : false);
    const handleClose = () => { setOpen(false) };

    return (
        <div>
        <Modal
            ref={modalRef}
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Evidence has been submitted successfully.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleClose}>Ok</Button>
            </Typography>
            </Box>
        </Modal>
        </div>
    );
}