import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: '25%',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function StocksViewDialog({ open, onClose, modelId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/offline/v1/inventory/sku/${modelId}`);
        const jsonData = await response.json();
        setData(jsonData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchData();
    }
  }, [open, modelId]);

  return (
    <BootstrapDialog onClose={onClose} open={open}>
      <DialogTitle>
        <Typography textAlign="center">
          Details for Model <strong> {modelId} </strong>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress /> // Display loading spinner while data is being fetched
        ) : (
          data && (
            <>
              <Typography variant="body1"><strong>Color:</strong> {data.color}</Typography>
              <Typography variant="body1"><strong>Material:</strong> {data.material}</Typography>
              <Typography variant="body1"><strong>Dimensions:</strong> {data.dimensions}</Typography>
              <Typography variant="body1"><strong>Weight:</strong> {data.weight}</Typography>
              <Typography variant="body1"><strong>Units:</strong> {data.units}</Typography>
              <Typography variant="body1"><strong>Rate:</strong> {data.ratePerUnit}</Typography>
              <Typography variant="body1">
              <strong>In Stock?: </strong> 
              <span style={{ color: data.inStock ? 'green' : 'red', fontWeight: 'bold' }}>
                {data.inStock ? 'Yes' : 'No'}
              </span>
            </Typography>

            </>
          )
        )}
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>Close</button>
      </DialogActions>
    </BootstrapDialog>
  );
}

StocksViewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modelId: PropTypes.string.isRequired,
};

export default StocksViewDialog;
