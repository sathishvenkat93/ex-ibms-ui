import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Layout from '@/components/Layout';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  TextField,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import StocksViewDialog from './StocksViewDialog';
import AlertDialog from '@/components/AlertDialog';
import DeleteDialog from '@/components/DeleteDialog';


const apiEndpoint = 'http://localhost:3000/offline/v1/inventory/sku/list';

const headCells = [
  { id: 'modelId', numeric: false, disablePadding: false, label: 'Model ID' },
  { id: 'color', numeric: false, disablePadding: false, label: 'Color' },
  { id: 'inStock', numeric: false, disablePadding: false, label: 'in Stock?' },
  { id: 'ratePerUnit', numeric: false, disablePadding: false, label: 'Rate' },
  { id: 'updatedAt', numeric: false, disablePadding: false, label: 'Updated On' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all stocks' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, searchTerm, setSearchTerm, onCreate, onDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%', fontWeight: 'bold'}} variant="h6" id="tableTitle" component="div" >
          Stocks
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
      <Button variant="contained" color="primary" onClick={onCreate}>
        Create
      </Button>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default function Stocks() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('modelId');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState('')
  // const [loading, setLoading] = useState(false);
  const [modeldata, setmodelData] = useState('');
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleteSkuId, setdelteSkuId] = useState('')

  const [selectedForDelete, setSelectedForDelete] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.modelId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClickOpen = async (modelId) => {
    setSelectedModelId(modelId);
    setOpenDialog(true)
  }

  const handleClick = (event, modelId) => {
    const selectedIndex = selected.indexOf(modelId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, modelId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    // const selectedIndex = selectedForDelete.indexOf(modelId);
    // let newSelected = [];
  
    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selectedForDelete, modelId);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selectedForDelete.slice(1));
    // } else if (selectedIndex === selectedForDelete.length - 1) {
    //   newSelected = newSelected.concat(selectedForDelete.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selectedForDelete.slice(0, selectedIndex),
    //     selectedForDelete.slice(selectedIndex + 1),
    //   );
    // }
  
    // setSelectedForDelete(newSelected);
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
    navigate('/stocks/create')
  };

  const handleEdit = (skuId) => {
    navigate(`/stocks/edit/${skuId}`);
  };

  const handleCheckboxClick = (event, modelId) => {
    const selectedIndex = selectedForDelete.indexOf(modelId);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedForDelete, modelId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedForDelete.slice(1));
    } else if (selectedIndex === selectedForDelete.length - 1) {
      newSelected = newSelected.concat(selectedForDelete.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedForDelete.slice(0, selectedIndex),
        selectedForDelete.slice(selectedIndex + 1),
      );
    }
  
    // console.log('set selected....', newSelected)
    setSelectedForDelete(newSelected);
  };
  
  const handleDelete = () => {
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = () => {
  
    fetch('http://localhost:3000/offline/v1/inventory/sku/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selected),
    })
    .then((response) => {
      if (response.ok) {
        
        console.log('SKUs deleted successfully');
        setSelected([]); // Clear selected SKUs after deletion
        setConfirmDelete(false); // Close the dialog after deletion
        fetchData(); // Refresh the data after deletion
      } else {
        // Handle deletion failure
        console.error('Failed to delete SKUs');
      }
    })
    .catch((error) => {
      console.error('Error deleting SKUs:', error);
    });
  };

  const isSelected = (modelId) => selected.indexOf(modelId) !== -1;

  const filteredData = data.filter((item) =>
    // item.modelId.toLowerCase().includes(searchTerm.toLowerCase())
    Object.values(item).some((value) =>
    value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredData],
  );

  return (
    <Layout>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.modelId);
                const labelId = `enhanced-table-checkbox-${index}`;
                let formattedDate = ""
                if (row.updatedAt) {
                  const utcDate = new Date(row.updatedAt);
                  const istDate = new Date(utcDate.getTime());
                  formattedDate = istDate.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'medium'
                  });
                }

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isSelected(row.modelId)}
                    tabIndex={-1}
                    key={row.modelId}
                    selected={isSelected(row.modelId)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected(row.modelId)}
                        onClick={(event) => handleClick(event, row.modelId)}
                        onChange={(event) => handleCheckboxClick(event, row.modelId)}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" onClick={(event) => handleClickOpen(row.modelId)}>
                      {row.modelId}
                    </TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.modelId)}>{row.color}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.modelId)}>
                        {row.inStock ? (
                            <CheckCircleIcon style={{ color: 'green' }} />
                        ) : (
                            <CancelIcon style={{ color: 'red' }} />
                        )}
                    </TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.modelId)}>{row.ratePerUnit}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.modelId)}>{formattedDate}</TableCell>
                    <TableCell align="left">
                    <IconButton aria-label="edit" onClick={() => handleEdit(row.modelId)}>
                      <EditIcon />
                    </IconButton>
                    
                    
                    
                  </TableCell>
                  </TableRow>
                  
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <DeleteDialog
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              title="Delete SKU(s)"
              message="Are you sure you want to delete the selected SKU(s)?"
              onConfirm={handleConfirmDelete}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
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
    <StocksViewDialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      modelId={selectedModelId}
    />
    </Layout>
  );
}
