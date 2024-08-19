import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const apiInventoryEndpoint = 'http://localhost:3000/offline/v1/inventory/list';

const BillingCreate = () => {
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [billAddress, setBillAddress] = useState({
    doorNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [billingData, setBillingData] = useState({
    billName: '',
    contactNo: '',
    emailAddress: '',
    billAddress: {
      doorNumber: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
    },
    particulars: [],
    total: 0,
    status: 'PENDING',
  });
  const [productList, setProductList] = useState([]);
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    const fetchInventoryList = async () => {
        setLoading(true)
      try {
        const response = await axios.get(apiInventoryEndpoint);
        setProductList(response.data);
      } catch (error) {
        console.error('Error fetching inventory list:', error);
      }finally{
        setLoading(false)
      }
    };

    fetchInventoryList();
  }, []);

  const handleCheckboxChange = () => {
    setShowEmail(!showEmail);
  };

  const handleZipcodeChange = async (e) => {
    const zipcode = e.target.value;
    setBillAddress({ ...billAddress, zipcode });

    if (zipcode.length === 6) {
        setLoading(true)
      try {
        const response = await axios.get(`https://api.zippopotam.us/in/${zipcode}`);
        const place = response.data.places[0];

        setBillAddress({
          ...billAddress,
          city: place['place name'],
          state: place['state abbreviation'],
        });
      } catch (error) {
        console.error('Error fetching city and state:', error);
      }finally{
        setLoading(false)
      }
    }
  };

  const handleAddParticular = () => {
    setBillingData((prevData) => ({
      ...prevData,
      particulars: [...prevData.particulars, { productId: '', rate: '', units: '' }],
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleParticularChange = (index, field, value) => {
    const newParticulars = [...billingData.particulars];
    newParticulars[index][field] = value;
    setBillingData((prevData) => ({ ...prevData, particulars: newParticulars }));
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = billingData.particulars.reduce((acc, particular) => acc + particular.rate * particular.units, 0);
    setBillingData((prevData) => ({ ...prevData, total }));
  };

  const handleSubmit = async () => {
    const payload = {
      billName: billingData.billName,
      contactNo: billingData.contactNo,
      emailAddress: showEmail ? emailAddress : '',
      billAddress,
      particulars: billingData.particulars,
      total: billingData.total,
      status,
    };
    setLoading(true)
    try {
      await axios.post('http://localhost:3000/offline/v1/billing/create', payload);
      navigate('/billing');
    } catch (error) {
      console.error('Error creating billing:', error);
    }finally{
        setLoading(false)
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Billing/Invoice
        </Typography>
        {loading ? ( // Render CircularProgress if loading is true
          <CircularProgress />
        ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Bill Name"
              value={billingData.billName}
              onChange={(e) => setBillingData({ ...billingData, billName: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Contact No"
              value={billingData.contactNo}
              onChange={(e) => setBillingData({ ...billingData, contactNo: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showEmail}
                  onChange={handleCheckboxChange}
                  name="showEmail"
                  color="primary"
                />
              }
              label="Email"
            />
          </Grid>
          {showEmail && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Zip Code"
              value={billAddress.zipcode}
              onChange={handleZipcodeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="City"
              value={billAddress.city}
              onChange={(e) => setBillAddress({ ...billAddress, city: e.target.value })}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="State"
              value={billAddress.state}
              onChange={(e) => setBillAddress({ ...billAddress, state: e.target.value })}
              select
              fullWidth
            >
              {[
                'AP',
                'AR',
                'AS',
                'BR',
                'CG',
                'GA',
                'GJ',
                'HR',
                'HP',
                'JH',
                'KA',
                'KL',
                'MP',
                'MH',
                'MN',
                'ML',
                'MZ',
                'NL',
                'OD',
                'PB',
                'RJ',
                'SK',
                'TN',
                'TS',
                'TR',
                'UP',
                'UK',
                'WB',
              ].map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Door Number"
              value={billAddress.doorNumber}
              onChange={(e) => setBillAddress({ ...billAddress, doorNumber: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Address Line 1"
              value={billAddress.address1}
                onChange={(e) => setBillAddress({ ...billAddress, address1: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Address Line 2"
                value={billAddress.address2}
                onChange={(e) => setBillAddress({ ...billAddress, address2: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Particulars</Typography>
              <Button onClick={handleAddParticular} variant="contained" color="primary">
                Add Particular
              </Button>
            </Grid>
            {billingData.particulars.map((particular, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Product"
                    value={particular.productId}
                    onChange={(e) => handleParticularChange(index, 'productId', e.target.value)}
                    select
                    fullWidth
                  >
                    {productList.map((product) => (
                      <MenuItem key={product.productId} value={product.productId}>
                        {product.productName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Rate"
                    value={particular.rate}
                    onChange={(e) => handleParticularChange(index, 'rate', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Units"
                    value={particular.units}
                    onChange={(e) => handleParticularChange(index, 'units', e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Total"
                value={billingData.total}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                select
                fullWidth
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="PARTIAL">PARTIAL</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSubmit}>
                Generate
              </Button>
              <Button type="button" variant="outlined" color="primary" onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        )}
        </Box>
      </Layout>
    );
  };
  
  export default BillingCreate;
  