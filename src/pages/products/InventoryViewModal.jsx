import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Typography, Button, Box, CircularProgress, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import StocksViewDialog from '../stocks/StocksViewDialog';

const apiEndpoint = `http://localhost:3000/offline/v1/inventory`;

function DrawerDialog({ open, onClose, productId }) {
  const [productData, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiEndpoint}/${productId}`);
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
  }, [open, productId]);

  const handleClickOpen = async (modelId) => {
    setSelectedModelId(modelId)
    setOpenDialog(true)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '25%',
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
          productData && (
            <>
              <List>
                <ListItem>
                  <ListItemText primary={<strong>Product ID:</strong>} secondary={productData.productId} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Product Name:</strong>} secondary={productData.productName} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Description:</strong>} secondary={productData.productDescription} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Category:</strong>} secondary={productData.category} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Type:</strong>} secondary={productData.type} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>SKU:</strong>} />
                </ListItem>
                <List component="div" disablePadding>
                    {productData.SKU.map((sku, index) => {
                        if (typeof sku === 'string') {
                        return (
                            <ListItem key={index} sx={{ pl: 4, transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }} onClick={(event) => handleClickOpen(sku.split(":")[0])}>
                            <ListItemIcon>
                                <BuildCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={sku} />
                            </ListItem>
                        );
                        } else if (typeof sku === 'object') {
                        return (
                            <ListItem key={index} sx={{ pl: 4, transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                              }, }} onClick={(event => handleClickOpen(sku.modelId))}>
                            <ListItemIcon>
                            <BuildCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={`${sku.modelId}: ${sku.units}`} />
                            </ListItem>
                        );
                        } else {
                        return null;
                        }
                    })}
                </List>

                <ListItem>
                  <ListItemText primary={<strong>Print Required:</strong>} secondary={productData.printRequired ? 'Yes' : 'No'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Print Details:</strong>} secondary={productData.printDetails} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<strong>Created At:</strong>} secondary={new Date(productData.createdAt).toLocaleString()} />
                </ListItem>
                {productData.updatedAt && (
                  <ListItem>
                    <ListItemText primary={<strong>Updated At:</strong>} secondary={new Date(productData.updatedAt).toLocaleString()} />
                  </ListItem>
                )}
              </List>
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

DrawerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
};

export default DrawerDialog;