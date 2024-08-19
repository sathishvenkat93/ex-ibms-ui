import Layout from '@/components/Layout';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import { TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import DrawerDialog from '../products/InventoryViewModal';
import PDFViewer from './PDFViewer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BillingDrawerDialog from './BillingDrawer';

const listAPIEndpoint = 'http://localhost:3000/offline/v1/billing/list'

const headCells = [
  { id: 'billingId', numeric: false, disablePadding: true, label: 'Invoice ID' },
  { id: 'billName', numeric: false, disablePadding: false, label: 'Billed To' },
  { id: 'contactNo', numeric: false, disablePadding: false, label: 'Contact' },
  { id: 'emailAddress', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'total', numeric: false, disablePadding: false, label: 'Bill Amount' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Bill Status' },
  { id: 'generatedAt', numeric: false, disablePadding: false, label: 'Created On' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, searchTerm, setSearchTerm, onCreate, onDelete  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        
      }}
    >
      {(
        <Typography
          sx={{ flex: '1 1 100%', fontWeight:'bold' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Billing / Invoices
        </Typography>
      )}

      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" size="medium" color="primary" onClick={onCreate}>
        Generate
      </Button>

    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default function Billing() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('productName');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState('')
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    try{
      const response = await fetch(listAPIEndpoint)
      const jsonData = await response.json();
      setRows(jsonData)
      setData(jsonData)
    }catch(error){
      console.error('Error fetching Data: ', error)
    }
  }

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleCreate = () => {
    navigate('/billing/create')
  }

  const handleEdit = () => {

  }
  const handleViewDoc = (docPath) => {
    console.log('pdfPaath: ',pdfPath)
    setPdfPath(docPath)
    console.log('we have set path: ', pdfPath)
    setPdfViewerOpen(true)
  }

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false)
  }

  const handleClickOpen = async (billingId) => {
    setSelectedBillingId(billingId)
    setDrawerOpen(true)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredData = data.filter((item) =>
  // item.modelId.toLowerCase().includes(searchTerm.toLowerCase())
  Object.values(item).some((value) =>
  value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
)
);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredData],
  );

  const convertToIST = (utcDateString) => {
    if(utcDateString){
      const utcDate = new Date(utcDateString);
      const istDate = new Date(utcDate.getTime());
      return istDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    }else{
      return ""
    }
    
  };

  return (
    <Layout>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={handleCreate}
        />
        {pdfViewerOpen && <PDFViewer pdfPath={pdfPath} onClose={handleClosePdfViewer} />}

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.billingId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    
                    
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.billingId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      onClick={(event) => handleClickOpen(row.billingId)}
                    >
                      {row.billingId}
                    </TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{row.billName}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{row.contactNo}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{row.emailAddress}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{row.total}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{row.status}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.billingId)}>{convertToIST(row.generatedAt)}</TableCell>
                    <TableCell align="left">
                    <IconButton aria-label="viewdoc" onClick={(event) => handleViewDoc(row.docPath)}>
                      <VisibilityIcon />
                    </IconButton> 
                      
                                   
                  </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    <BillingDrawerDialog
    open = {drawerOpen}
    onClose = {() => setDrawerOpen(false)}
    billingId = {selectedBillingId}
    />
    </Layout>
  );
}
