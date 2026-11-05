import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import {
  fetchSellerProducts,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from '../../../State/seller/sellerProductSlice';
import type { Product } from '../../../types/ProductTypes';
import {
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  InputAdornment,
  Chip,
  Box,
  Typography,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit,
  ImageNotSupported,
  Delete,
  Close,
  AddPhotoAlternate,
  Star,
  Search,
  CheckCircle,
  WarningAmber,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { colors } from '../../../data/Filter/color';
import UploadToCludinary from '../../../Util/UploadToCloudinary';

const FALLBACK_PLACEHOLDER =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80';
const SIZES_OPTIONS = ['FREE', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.04em',
    padding: '14px 16px',
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 137, 123, 0.06)',
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const validationSchema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  description: Yup.string().trim().required('Description is required'),
  mrpPrice: Yup.number()
    .typeError('MRP Price must be a number')
    .positive('MRP Price must be greater than 0')
    .required('MRP Price is required'),
  discountPercent: Yup.number()
    .typeError('Discount (%) must be a number')
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .required('Discount (%) is required'),
  color: Yup.string().required('Color is required'),
  sizes: Yup.array().min(1, 'At least one size must be selected'),
  images: Yup.array().min(1, 'At least one product image is required'),
});

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { products, loading } = useAppSelector((store) => store.sellerProduct);

  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStockId, setUpdatingStockId] = useState<number | null>(null);

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete Confirmation Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(fetchSellerProducts(undefined));
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      mrpPrice: '',
      discountPercent: '0',
      color: '',
      sizes: [] as string[],
      images: [] as string[],
      in_stock: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!selectedProduct?.id) return;
      const mrp = Number(values.mrpPrice);
      const discount = Number(values.discountPercent) || 0;

      try {
        await dispatch(
          updateProduct({
            productId: selectedProduct.id,
            product: {
              title: values.title.trim(),
              description: values.description.trim(),
              mrpPrice: mrp,
              discountPercent: discount,
              color: values.color,
              sizes: values.sizes.join(','),
              images: values.images,
              in_stock: values.in_stock,
            },
          })
        ).unwrap();

        showToast('Product updated successfully!');
        handleCloseEdit();
        dispatch(fetchSellerProducts(undefined));
      } catch (err: any) {
        showToast(typeof err === 'string' ? err : 'Failed to update product', 'error');
      }
    },
  });

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    const parsedSizes = product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [];
    formik.setValues({
      title: product.title || '',
      description: product.description || '',
      mrpPrice: String(product.mrpPrice ?? ''),
      discountPercent: String(product.discountPercent ?? 0),
      color: product.color || '',
      sizes: parsedSizes,
      images: product.images || [],
      in_stock: product.in_stock ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (formik.dirty && !formik.isSubmitting) {
      if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
        setEditDialogOpen(false);
        setSelectedProduct(null);
      }
    } else {
      setEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await UploadToCludinary(file);
      if (url) {
        formik.setFieldValue('images', [...formik.values.images, url]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue('images', updated);
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const updated = [...formik.values.images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    formik.setFieldValue('images', updated);
    showToast('Primary image updated');
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct?.id) return;
    setIsDeleting(true);
    try {
      await dispatch(
        deleteProduct({
          productId: selectedProduct.id,
        })
      ).unwrap();

      showToast('Product deleted successfully!');
      setDeleteDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedProduct(null);
      dispatch(fetchSellerProducts(undefined));
    } catch (err: any) {
      showToast(typeof err === 'string' ? err : 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    if (!product.id) return;
    setUpdatingStockId(product.id);
    try {
      await dispatch(updateProductStock({ productId: product.id })).unwrap();
      showToast('Stock status updated!');
    } catch (err: any) {
      showToast(typeof err === 'string' ? err : 'Failed to update stock', 'error');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const formatCategoryName = (category: any): string => {
    if (!category) return '—';
    const name = category.name || category.categoryId || '';
    return name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchTitle = p.title?.toLowerCase().includes(query);
      const matchCat = p.category?.categoryId?.toLowerCase().includes(query) || p.category?.name?.toLowerCase().includes(query);
      const matchColor = p.color?.toLowerCase().includes(query);
      return matchTitle || matchCat || matchColor;
    });
  }, [products, searchQuery]);

  const currentMrp = Number(formik.values.mrpPrice) || 0;
  const currentDiscount = Number(formik.values.discountPercent) || 0;
  const computedSellingPrice = Math.max(
    0,
    Math.round(currentMrp - (currentMrp * currentDiscount) / 100)
  );
  const computedSavings = Math.max(0, currentMrp - computedSellingPrice);

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <TextField
          size="small"
          placeholder="Search products by title, category, or color..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: '380px' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
        </Typography>
      </div>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }} aria-label="seller product table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" sx={{ width: '80px' }}>
                Image
              </StyledTableCell>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Category</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Discount</StyledTableCell>
              <StyledTableCell align="left">Color</StyledTableCell>
              <StyledTableCell align="center">Update Stock</StyledTableCell>
              <StyledTableCell align="center">Update</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress sx={{ color: '#00897b' }} />
                </TableCell>
              </TableRow>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((item: Product) => {
                const inStock = item.in_stock ?? (item.quantity > 0);
                const isUpdating = updatingStockId === item.id;
                const primaryImage =
                  item.images && item.images.length > 0 && item.images[0]
                    ? item.images[0]
                    : FALLBACK_PLACEHOLDER;

                return (
                  <StyledTableRow key={item.id}>
                    {/* Image */}
                    <StyledTableCell align="left">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-xs">
                        <img
                          className="w-full h-full object-cover"
                          src={primaryImage}
                          alt={item.title || 'Product'}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_PLACEHOLDER;
                          }}
                        />
                      </div>
                    </StyledTableCell>

                    {/* Title */}
                    <StyledTableCell align="left" sx={{ fontWeight: 500, maxWidth: 220 }}>
                      <p className="truncate text-gray-900 font-medium" title={item.title}>
                        {item.title}
                      </p>
                    </StyledTableCell>

                    {/* Category */}
                    <StyledTableCell align="left">
                      <Chip
                        label={formatCategoryName(item.category)}
                        size="small"
                        sx={{
                          backgroundColor: '#e0f2f1',
                          color: '#00695c',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </StyledTableCell>

                    {/* MRP */}
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <span className="line-through text-gray-400 text-xs mr-1">₹</span>
                      <span className="font-semibold text-gray-700">₹{item.mrpPrice}</span>
                    </StyledTableCell>

                    {/* Discount & Final Price */}
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                          {item.discountPercent ?? 0}% OFF
                        </span>
                        <span className="text-xs text-gray-600 font-semibold mt-0.5">
                          Final: ₹{item.sellingPrice}
                        </span>
                      </div>
                    </StyledTableCell>

                    {/* Color */}
                    <StyledTableCell align="left">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shadow-xs"
                          style={{ backgroundColor: item.color?.toLowerCase() || '#ccc' }}
                        />
                        <span className="text-gray-700 capitalize">{item.color || '—'}</span>
                      </div>
                    </StyledTableCell>

                    {/* Update Stock */}
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color={inStock ? 'success' : 'error'}
                        disabled={isUpdating}
                        onClick={() => handleToggleStock(item)}
                        startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : null}
                        sx={{
                          textTransform: 'none',
                          fontSize: 12,
                          px: 1.5,
                          py: 0.3,
                          borderRadius: '16px',
                        }}
                      >
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </Button>
                    </StyledTableCell>

                    {/* Update Action */}
                    <StyledTableCell align="center">
                      <Tooltip title="Edit Product Details" arrow>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(item)}
                          sx={{
                            backgroundColor: 'rgba(0, 137, 123, 0.08)',
                            '&:hover': { backgroundColor: 'rgba(0, 137, 123, 0.18)' },
                          }}
                        >
                          <Edit fontSize="small" sx={{ color: '#00897b' }} />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No products matching your search.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Redesigned Edit Product Details Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
        aria-labelledby="edit-product-dialog-title"
      >
        <DialogTitle
          id="edit-product-dialog-title"
          sx={{
            m: 0,
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <div>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#1f2937' }}>
              Edit Product Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: #{selectedProduct?.id} • Managed in Black Mason Seller Hub
            </Typography>
          </div>
          <IconButton onClick={handleCloseEdit} size="small" aria-label="Close dialog">
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers sx={{ p: { xs: 2, sm: 3.5 }, backgroundColor: '#fff' }}>
            <Stack spacing={3.5}>
              {/* Category Breadcrumbs Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                  Category Placement
                </Typography>
                <Box className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Chip
                    label={selectedProduct?.category?.parentCategory?.parentCategory?.categoryId || 'Men'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ›
                  </Typography>
                  <Chip
                    label={selectedProduct?.category?.parentCategory?.categoryId || 'Topwear'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ›
                  </Typography>
                  <Chip
                    label={selectedProduct?.category?.categoryId || 'Men Jackets'}
                    size="small"
                    sx={{
                      backgroundColor: '#00897b',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    (Categories are bound to SKU architecture)
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Basic Information Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                  Basic Information
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    id="edit-title"
                    name="title"
                    label="Product Title"
                    variant="outlined"
                    required
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />

                  <div>
                    <TextField
                      fullWidth
                      id="edit-description"
                      name="description"
                      label="Product Description"
                      variant="outlined"
                      multiline
                      rows={3}
                      required
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={
                        (formik.touched.description && formik.errors.description) ||
                        `${formik.values.description.length} characters`
                      }
                    />
                  </div>
                </Stack>
              </Box>

              <Divider />

              {/* Pricing & Live Calculation Card Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                  Pricing & Customer Economics
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <TextField
                      fullWidth
                      id="edit-mrpPrice"
                      name="mrpPrice"
                      label="Maximum Retail Price (MRP)"
                      variant="outlined"
                      type="number"
                      required
                      value={formik.values.mrpPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        },
                      }}
                      error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                      helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                    />

                    <TextField
                      fullWidth
                      id="edit-discountPercent"
                      name="discountPercent"
                      label="Discount Percentage"
                      variant="outlined"
                      type="number"
                      required
                      value={formik.values.discountPercent}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        },
                      }}
                      error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
                      helperText={formik.touched.discountPercent && formik.errors.discountPercent}
                    />
                  </div>

                  {/* Customer Preview Card */}
                  <div className="md:col-span-5">
                    <Card
                      variant="outlined"
                      sx={{
                        backgroundColor: '#f0fdf4',
                        borderColor: '#bbf7d0',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <CardContent sx={{ p: '8px !important' }}>
                        <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                          CUSTOMER PRICE PREVIEW
                        </Typography>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{computedSellingPrice}
                          </span>
                          {currentMrp > 0 && currentDiscount > 0 && (
                            <span className="text-sm line-through text-gray-400">
                              ₹{currentMrp}
                            </span>
                          )}
                          <Chip
                            label={`${currentDiscount}% OFF`}
                            size="small"
                            sx={{
                              backgroundColor: '#16a34a',
                              color: '#fff',
                              fontWeight: 700,
                              height: 20,
                              fontSize: '0.7rem',
                            }}
                          />
                        </div>
                        <Typography variant="caption" sx={{ color: '#15803d', mt: 1, display: 'block' }}>
                          Customer saves ₹{computedSavings} on this purchase
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Box>

              <Divider />

              {/* Variants (Color & Sizes) Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                  Variants & Availability
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl fullWidth required error={formik.touched.color && Boolean(formik.errors.color)}>
                    <InputLabel id="edit-color-select-label">Color</InputLabel>
                    <Select
                      labelId="edit-color-select-label"
                      id="edit-color"
                      name="color"
                      value={formik.values.color}
                      label="Color"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {colors.map((c, i) => (
                        <MenuItem value={c.name} key={i}>
                          <div className="flex gap-2 items-center">
                            <span
                              style={{ backgroundColor: c.hex }}
                              className="h-4 w-4 rounded-full border border-gray-300"
                            />
                            <span>{c.name}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Multi-select Sizes with Chips */}
                  <FormControl fullWidth required error={formik.touched.sizes && Boolean(formik.errors.sizes)}>
                    <InputLabel id="edit-sizes-select-label">Available Sizes</InputLabel>
                    <Select
                      labelId="edit-sizes-select-label"
                      id="edit-sizes"
                      multiple
                      value={formik.values.sizes}
                      onChange={(e) => {
                        const val = e.target.value;
                        formik.setFieldValue('sizes', typeof val === 'string' ? val.split(',') : val);
                      }}
                      label="Available Sizes"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((size) => (
                            <Chip key={size} label={size} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {SIZES_OPTIONS.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.in_stock}
                        onChange={(e) => formik.setFieldValue('in_stock', e.target.checked)}
                        color="success"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formik.values.in_stock ? 'Item In Stock' : 'Item Out of Stock'}
                      </Typography>
                    }
                  />
                </Box>
              </Box>

              <Divider />

              {/* Images Gallery with Primary Selection Section */}
              <Box>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>
                    Product Media & Gallery
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    First image is thumbnail • Click star to make primary
                  </Typography>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-file-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="edit-file-upload">
                    <span className="w-24 h-24 cursor-pointer flex flex-col items-center justify-center p-2 border-2 border-dashed rounded-lg border-gray-300 hover:border-teal-600 hover:bg-teal-50/30 transition-all">
                      <AddPhotoAlternate sx={{ color: '#00897b', fontSize: 28 }} />
                      <Typography variant="caption" sx={{ color: '#00897b', fontWeight: 600, mt: 0.5 }}>
                        Add Image
                      </Typography>
                    </span>
                  </label>

                  {uploadingImage && (
                    <div className="w-24 h-24 flex items-center justify-center border rounded-lg bg-gray-50">
                      <CircularProgress size={24} sx={{ color: '#00897b' }} />
                    </div>
                  )}

                  {formik.values.images.map((img, index) => {
                    const isPrimary = index === 0;
                    return (
                      <div
                        key={index}
                        className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          isPrimary ? 'border-teal-600 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <img className="w-full h-full object-cover" src={img} alt={`Preview ${index}`} />

                        {isPrimary && (
                          <span className="absolute bottom-0 inset-x-0 bg-teal-600 text-white text-[10px] font-bold py-0.5 text-center">
                            PRIMARY
                          </span>
                        )}

                        <div className="absolute top-1 right-1 flex gap-0.5 bg-black/60 rounded p-0.5">
                          {!isPrimary && (
                            <IconButton
                              size="small"
                              onClick={() => handleSetPrimaryImage(index)}
                              title="Set as Primary"
                              sx={{ color: '#fbbf24', p: 0.3 }}
                            >
                              <Star sx={{ fontSize: 14 }} />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            title="Remove Image"
                            sx={{ color: '#fff', p: 0.3 }}
                          >
                            <Close sx={{ fontSize: 14 }} />
                          </IconButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {formik.touched.images && formik.errors.images && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {formik.errors.images as string}
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
              px: 3,
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Delete Product
            </Button>

            <div className="flex gap-2">
              <Button onClick={handleCloseEdit} sx={{ textTransform: 'none' }} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#00897b',
                  '&:hover': { backgroundColor: '#00695c' },
                  px: 3.5,
                  fontWeight: 600,
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle className="font-bold text-gray-800 flex items-center gap-2">
          <WarningAmber color="error" /> Delete Product?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to permanently delete{' '}
            <strong className="text-gray-900">"{selectedProduct?.title}"</strong>? This will remove the listing from customer searches. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
