import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Button, Box, CircularProgress, Select, MenuItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import StocksViewDialog from '../stocks/StocksViewDialog';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const apiEndpoint = `http://localhost:3000/offline/v1/billing`;

function BillingDrawerDialog({ open, onClose, billingId }) {
  const [billingData, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState('')
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiEndpoint}/${billingId}`);
        const jsonData = await response.json();
        setData(jsonData[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, billingId]);

  const handleClickOpen = async (modelId) => {
    setSelectedModelId(modelId)
    setOpenDialog(true)
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdateClick = async () => {
    setUpdating(true);
    try {
      await handleUpdateStatus(billingData.billingId, status);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (billingId, newStatus) => {
    try {
      const response = await fetch(`${apiEndpoint}/update/${billingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedData = { ...billingData, status: newStatus };
        setData(updatedData);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '40%',
          padding: '16px',
        },
      }}
    >
      <Box
        sx={{ width: '100%' }}
        role="presentation"
      >
        {loading ? (
          <CircularProgress />
        ) : (
          billingData && (
            <>
              {/* Grid Start */}

              <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Invoice ID:</strong></Typography>
        <Typography variant="body2">{billingData.billingId}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Billed To:</strong></Typography>
        <Typography variant="body2">{billingData.billName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Contact:</strong></Typography>
        <Typography variant="body2">{billingData.contactNo}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Email:</strong></Typography>
        <Typography variant="body2">{billingData.emailAddress}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Total:</strong></Typography>
        <Typography variant="body2">{billingData.total}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body1"><strong>Status:</strong></Typography>
        {billingData.status === 'PAID' ? (
          <Typography variant="body2">{billingData.status}</Typography>
        ) : (
          <>
            <Select
              value={status}
              onChange={handleStatusChange}
              disabled={billingData.status === 'PAID'}
              autoWidth
              size='small'
              sx={{ marginRight: '8px' }}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="PARTIAL">PARTIAL</MenuItem>
              {/* <MenuItem value="PAID">PAID</MenuItem> */}
              {billingData.status === 'PARTIAL' && <MenuItem value="PAID">PAID</MenuItem>}
            </Select>
            <Button
              variant="outlined"
              onClick={handleUpdateClick}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1"><strong>Invoice Generated At:</strong></Typography>
        <Typography variant="body2">{new Date(billingData.generatedAt).toLocaleString()}</Typography>
      </Grid>
      {billingData.updatedAt && (
        <Grid item xs={12}>
          <Typography variant="body1"><strong>Updated At:</strong></Typography>
          <Typography variant="body2">{new Date(billingData.updatedAt).toLocaleString()}</Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1"><strong>Particulars:</strong></Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product Code</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Units</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingData.particulars.map((particular, index) => (
                <TableRow key={index}>
                  <TableCell>{particular.productId}</TableCell>
                  <TableCell>{particular.productName}</TableCell>
                  <TableCell>{particular.rate}</TableCell>
                  <TableCell>{particular.units}</TableCell>
                  <TableCell>{particular.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>

              {/* Grid End */}
              <Divider />
              <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )
        )}
      </Box>
      <StocksViewDialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      modelId={selectedModelId}
    />
    </Drawer>
  );
}

BillingDrawerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  billingId: PropTypes.string.isRequired,
};

export default BillingDrawerDialog;