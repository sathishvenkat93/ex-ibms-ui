import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '@/components/AlertDialog';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const skuListEndpoint = 'http://localhost:3000/offline/v1/inventory/sku/list';
const inventoryCreateEndpoint = 'http://localhost:3000/offline/v1/inventory/create';

export default function CreateProductInventory() {
  const [productName, setProductName] = useState('');
  const [type, setType] = useState('');
  const [printrequired, setPrintRequired] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [printDetails, setPrintDetails] = useState('');
  const [skuList, setSkuList] = useState([]);
  const [selectedSkus, setSelectedSkus] = useState([]);
  const [units, setUnits] = useState({});
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [navigateTo, setNavigateTo] = useState('');
  const navigate = useNavigate();
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchSkuList = async () => {
      try {
        const response = await fetch(skuListEndpoint);
        const data = await response.json();
        setSkuList(data);
      } catch (error) {
        console.error('Error fetching SKU list:', error);
      }
    };

    fetchSkuList();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleValidationError = (message) => {
    setError(message);
    setErrorSnackbarOpen(true);
  };

  const handleProblemError = () => {
    setError('Problem Saving Data');
    setErrorSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName || !category || !type || !printrequired) {
      handleValidationError('All fields marked with * are required.');
      return;
    }

    const skuData = selectedSkus.map((sku) => ({
      modelId: sku.modelId,
      units: units[sku.modelId] || 0,
    }));

    if (skuData.some((sku) => sku.units <= 0)) {
      handleValidationError('Units must be greater than zero.');
      return;
    }

    const data = {
      productName,
      productDescription,
      category,
      type,
      printrequired,
      printDetails,
      SKU: skuData,
    };
    console.log(data);

    try {
      const response = await fetch(inventoryCreateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (response.status === 201) {
          setAlertTitle('Created successfully');
          setNavigateTo('/inventory');
        }
      } else {
        setAlertTitle('Error');
      }
      setAlertMessage(responseData.message);
      setOpenAlert(true);
    } catch (error) {
      handleProblemError();
    }
  };

  const handleSkuSelection = (event, newValue) => {
    setSelectedSkus(newValue);
  };

  const handleUnitChange = (modelId, value) => {
    setUnits((prevUnits) => ({
      ...prevUnits,
      [modelId]: Number(value),
    }));
  };

  return (
    <Layout>
      <Typography variant="h5" component="h2" gutterBottom sx={{ flex: '1 1 100%', fontWeight: 'bold' }}>
        Create Product Inventory
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          alignItems: 'center',
          justifyItems: 'start',
          justifyContent: 'start',
          p: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-product-name"
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <FormControl required sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Direct Print">Direct Print</MenuItem>
            <MenuItem value="Design and Print">Design and Print</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-product-description"
          label="Product Description (max 150 characters)"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          inputProps={{ maxLength: 150 }}
          sx={{ justifySelf: 'center', gridColumn: 'span 2', width: '100%' }}
          multiline
        />
        <TextField
          required
          id="outlined-product-type"
          label="Product Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <FormControl required sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}>
          <InputLabel id="print-required-label">Print Required?</InputLabel>
          <Select
            labelId="print-required-label"
            id="print-required-select"
            value={printrequired ? 'true' : 'false'}
            label="Print Required"
            onChange={(e) => setPrintRequired(e.target.value === 'true')}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-print-details"
          label="Print Details (max 75 characters)"
          value={printDetails}
          onChange={(e) => setPrintDetails(e.target.value)}
          inputProps={{ maxLength: 75 }}
          sx={{ justifySelf: 'center', gridColumn: 'span 2', width: '100%' }}
          multiline
        />

        <Typography variant="h6" component="h3" sx={{ gridColumn: 'span 2', width: '100%' }}>
          Select SKUs and Units
        </Typography>
        <Autocomplete
          multiple
          id="sku-select"
          options={skuList}
          getOptionLabel={(option) => `${option.modelId} (${option.color})`}
          value={selectedSkus}
          onChange={handleSkuSelection}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.modelId}
                label={`${option.modelId} (${option.color})`}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Search and Select SKUs" />}
          sx={{ gridColumn: 'span 2', width: '100%' }}
        />

        {selectedSkus.map((sku) => (
          <Box key={sku.modelId} sx={{ display: 'flex', alignItems: 'center', gridColumn: 'span 2', width: '100%' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {sku.modelId} ({sku.color})
            </Typography>
            <TextField
              required
              label="Units"
              type="number"
              value={units[sku.modelId] || ''}
              onChange={(e) => handleUnitChange(sku.modelId, e.target.value)}
              sx={{ ml: 2 }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSubmit}>
          Create
        </Button>
        <Button type="button" variant="outlined" color="primary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
      <>
        <Snackbar open={errorSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </>
      <AlertDialog
        title={alertTitle}
        message={alertMessage}
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        navigateTo={navigateTo}
      />
    </Layout>
  );
}
