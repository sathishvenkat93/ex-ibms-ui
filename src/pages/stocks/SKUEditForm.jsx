import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Layout from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import AlertDialog from '@/components/AlertDialog';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const SKUEditForm = () => {
  const { skuId } = useParams(); // Get the SKU ID from the URL params
  const navigate = useNavigate();

  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [inStock, setInStock] = useState(true);
  const [ratePerUnit, setRatePerUnit] = useState('');
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');

  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [navigateTo, setNavigateTo] = React.useState('');

  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({});
  const [isFormEdited, setIsFormEdited] = React.useState(false)

  useEffect(() => {
    // Fetch the SKU data using the SKU ID
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/offline/v1/inventory/sku/${skuId}`);
        const skuData = await response.json();
        // Populate the form fields with the retrieved data
        setColor(skuData[0].color);
        setMaterial(skuData[0].material);
        setWeight(skuData[0].weight);
        setDimensions(skuData[0].dimensions);
        setInStock(skuData[0].inStock);
        setRatePerUnit(skuData[0].ratePerUnit);
        setUnits(skuData[0].units);
        setInitialData(skuData[0])
        setFormData(skuData[0])
      } catch (error) {
        console.error('Error fetching SKU data:', error);
      }
    };
    fetchData();
  }, [skuId]);

  const handleCancel = () => {
    navigate(-1);
  }

  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setErrorSnackbarOpen(false);
    };

    const handleValidationError = () => {
    setError('All fields marked with * are required.');
    setErrorSnackbarOpen(true);
    };

    const handleProblemError = () => {
        setError('Problem Saving Data')
        setErrorSnackbarOpen(true)
    }


    const handleFieldChange = (field, value) => {
        if (field === '_id') {
          const { _id, ...updatedFormData } = formData;
          setFormData({ ...updatedFormData, [field]: value });
        } else {
          setFormData({ ...formData, [field]: value });
        }
        setIsFormEdited(true);
      }
      


  const handleSubmit = async (event) => {

    if (!formData.color || !formData.material || !formData.dimensions || !formData.ratePerUnit || !formData.units) {
        handleValidationError()
        return;
      }
    event.preventDefault();
    const data = {
        color: formData.color,
        material: formData.material,
        weight: formData.weight,
        dimensions: formData.dimensions,
        inStock: formData.inStock,
        ratePerUnit: formData.ratePerUnit,
        units: formData.units
    }

    try{
        const response = await fetch(`http://localhost:3000/offline/v1/inventory/sku/update/${skuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json()
        if (response.ok) {
            if (response.status === 201) {
              setAlertTitle('Updated successfully');
              setNavigateTo('/stocks')
            }
          } else {
            setAlertTitle('Error');
          }
          setAlertMessage(`Updated for Model ${responseData[0].modelId}`);
          setOpenAlert(true);
    }catch(error){
        handleProblemError()
    }
  };

  return (
    <Layout>
      <Typography variant="h5" component="h2" gutterBottom sx={{flex: '1 1 100%', fontWeight: 'bold'}}>
        Edit SKU
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
          id="outlined-color"
          label="Color"
          value={formData.color || ''}
          onChange={(e) => handleFieldChange('color', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%'}}
        />
        <TextField
          required
          id="outlined-material"
          label="Material"
          value={formData.material || ''}
          onChange={(e) => handleFieldChange('material', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          id="outlined-weight"
          label="Weight"
          value={formData.weight || ''}
          onChange={(e) => handleFieldChange('weight', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-dimensions"
          label="Dimensions"
          value={formData.dimensions || ''}
          onChange={(e) => handleFieldChange('dimensions', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-rate"
          label="Rate"
          type="number"
          value={formData.ratePerUnit || ''}
          onChange={(e) => handleFieldChange('ratePerUnit', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-units"
          label="Units"
          type="number"
          value={formData.units || ''}
          onChange={(e) => handleFieldChange('units', e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.inStock || false}
              onChange={(e) => handleFieldChange('inStock', e.target.checked)}
              name="inStock"
            />


          }
          label="In Stock"
          sx={{ justifySelf: 'center', gridColumn: 'span 2' }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSubmit} disabled={!isFormEdited}>
          Save Changes
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

export default SKUEditForm;