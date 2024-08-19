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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '@/components/DeleteDialog';
import DrawerDialog from './InventoryViewModal';


const apiEndpoint = 'http://localhost:3000/offline/v1/inventory/list'
const deleteapiEndpoint = 'http://localhost:3000/offline/v1/inventory/product/delete'

const headCells = [
  { id: 'productId', numeric: false, disablePadding: true, label: 'Product ID' },
  { id: 'productName', numeric: false, disablePadding: false, label: 'Product Name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'printRequired', numeric: false, disablePadding: false, label: 'Print Required' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created On' },
  { id: 'updatedAt', numeric: false, disablePadding: false, label: 'Updated On' },
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all products',
            }}
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
  const { numSelected, searchTerm, setSearchTerm, onCreate, onDelete  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight:'bold' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Product Inventory
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
  onCreate: PropTypes.func.isRequired
};

export default function Inventory() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('productName');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API endpoint
    // fetch(apiEndpoint)
    //   .then(response => response.json())
    //   .then(data => {
    //     // Set the fetched data
    //     setRows(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });
    fetchData()
  }, []);

  const fetchData = async () => {
    try{
      const response = await fetch(apiEndpoint)
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.productId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    navigate('/inventory/product/create')
  }

  const handleDelete = () => {
    setConfirmDelete(true)
  }

  const handleConfirmDelete = () => {
    fetch(deleteapiEndpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selected),
    })
    .then((response) => {
      if (response.ok) {
        
        console.log('Inventory Products deleted successfully');
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
  }

  const handleEdit = (productId) => {
    navigate(`/inventory/product/update/${productId}`)
  }

  const handleClickOpen = async (productId) => {
    setSelectedProductId(productId)
    setDrawerOpen(true)
  }

  // const handleDrawerClose = () => {
  //   setDrawerOpen(false)
  // }

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
                const isItemSelected = isSelected(row.productId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.productId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, row.productId)}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      onClick={(event) => handleClickOpen(row.productId)}
                    >
                      {row.productId}
                    </TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{row.productName}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{row.category}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{row.type}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{row.printRequired ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{convertToIST(row.createdAt)}</TableCell>
                    <TableCell align="left" onClick={(event) => handleClickOpen(row.productId)}>{convertToIST(row.updatedAt)}</TableCell>
                    <TableCell align="left">
                    <IconButton aria-label="edit" onClick={() => handleEdit(row.productId)}>
                      <EditIcon />
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
            <DeleteDialog
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              title="Delete Product(s)"
              message="Are you sure you want to delete the selected Product(s)?"
              onConfirm={handleConfirmDelete}
            />
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
    <DrawerDialog
    open = {drawerOpen}
    onClose = {() => setDrawerOpen(false)}
    productId = {selectedProductId}
    />
    
    </Layout>
  );
}

