import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom'
import AlertDialog from '@/components/AlertDialog';

export default function SKUCreateForm() {
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [inStock, setInStock] = useState(true);
  const [ratePerUnit, setRatePerUnit] = useState('');
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [navigateTo, setNavigateTo] = React.useState('');


  const generateModelId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCancel = () => {
    navigate(-1);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    if (!color || !material || !dimensions || !ratePerUnit || !units) {
      setError('All fields marked with * are required.');
      return;
    }

    const modelId = generateModelId();

    const data = {
      modelId,
      color,
      material,
      weight,
      dimensions,
      inStock,
      ratePerUnit,
      units,
    };

    try {
      const response = await fetch('http://localhost:3000/offline/v1/inventory/sku/create', {
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
          setNavigateTo('/stocks')
        }
      } else {
        setAlertTitle('Error');
      }
      setAlertMessage(responseData.message);
      setOpenAlert(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
        <Typography variant="h5" component="h2" gutterBottom sx={{flex: '1 1 100%', fontWeight: 'bold'}}>
          Create Stocks
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
        
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          id="outlined-color"
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%'}}
        />
        <TextField
          required
          id="outlined-material"
          label="Material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          id="outlined-weight"
          label="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-dimensions"
          label="Dimensions"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-rate"
          label="Rate"
          type="number"
          value={ratePerUnit}
          onChange={(e) => setRatePerUnit(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <TextField
          required
          id="outlined-units"
          label="Units"
          type="number"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          sx={{ justifySelf: 'center', gridColumn: 'span 1', width: '100%' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              name="inStock"
            />
          }
          label="In Stock"
          sx={{ justifySelf: 'center', gridColumn: 'span 2' }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSubmit}>
          Create
        </Button>
        <Button type="button" variant="outlined" color="primary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
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
