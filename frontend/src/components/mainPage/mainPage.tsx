import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { URL_BASE } from '../../shared/constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './mainPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

const MainPage: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Product[]>(`${URL_BASE}products`).then((res) => {
      if (res.status === 200) {
        setProductList(res.data);
      }
    });
  }, [isAuth, navigate]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <div className='main'>
      {isAuth}
      {productList.map((product) => (
        <Card className='product-card' key={product.id} onClick={() => handleProductClick(product)}>
          <CardMedia
            component='img'
            height='140'
            width='20'
            image={product.image}
            alt='product-img'
          />
          <CardContent>
            <Typography
              variant='h5'
              component='div'
              className='product-name'
            >
              {product.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {product.description}
            </Typography>
            <Typography variant='h6' color='text.primary'>
              {product.stock > 0 ? `$${product.price}` : 'Sin existencias'}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onClose={handleClose}>
          <DialogTitle>
            {selectedProduct.name}
            <IconButton
              aria-label='close'
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <img
              src={selectedProduct.image}
              alt='product-img'
              style={{ width: '100%', height: 'auto' }}
            />
            <Typography gutterBottom variant='h6' component='div'>
              {selectedProduct.price}
            </Typography>
            <Typography gutterBottom variant='body1' component='div'>
              {selectedProduct.description}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MainPage;
