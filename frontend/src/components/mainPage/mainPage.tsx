import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { URL_BASE } from '../../shared/constants/constants';
import { useSelector } from 'react-redux';
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
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
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
  const [customerData, setCustomerData] = useState<any>({});
  const [shippingAddress, setShippingAddress] = useState<any>({});
  const [card, setCard] = useState<any>({});
  const [permalink, setPermalink] = useState('');
  const [installments, setInstallments] = useState<number>(1);
  const [units, setUnits] = useState<number>(1);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [cardType, setCardType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.user.token);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const baseFee = 100000;

  useEffect(() => {
    fetchProducts();
  }, [isAuth, navigate]);

  useEffect(() => {
    const fetchPermalink = async () => {
      try {
        const res = await axios.get('https://api-sandbox.co.uat.wompi.dev/v1/merchants/pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7');
        setPermalink(res.data.data.presigned_acceptance.permalink);
      } catch (error) {
        console.error('Error fetching permalink:', error);
      }
    };

    fetchPermalink();
  }, []);

  const fetchProducts = () => {
    axios.get<Product[]>(`${URL_BASE}products`).then((res) => {
      if (res.status === 200) {
        setProductList(res.data);
      }
    });
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPaymentForm(false);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setShowPaymentForm(false)
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
    setSelectedProduct(null);
    setShowPaymentForm(false);
  };

  const handleClosePaymentForm = () => {
    setSelectedProduct(null);
    setShowPaymentForm(false);
  };

  const handleShowPaymentForm = () => {
    setShowPaymentForm(true);
  };

  const checkTransactionStatus = async (
    transactionNumber: string,
    token: string,
    retryCount: number = 0
  ) => {
    try {
      const response = await axios.get(`${URL_BASE}transactions/checkStatus/${transactionNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const status = response.data;

      switch (status) {
        case 'APPROVED':
          setStatusMessage('Transacción aprobada, gracias por comprar');
          fetchProducts();
          break;
        case 'DECLINED':
          setStatusMessage('Transacción rechazada, inténtalo más tarde');
          break;
        case 'ERROR':
          setStatusMessage('Error de transacción, inténtalo más tarde');
          break;
        case 'PENDING':
          if (retryCount >= 1) {
            setStatusMessage('Aún esperamos confirmación del banco');
            return;
          }
          setTimeout(() => checkTransactionStatus(transactionNumber, token, retryCount + 1), 5000);
          break;
        default:
          setStatusMessage('El estado actual de la transacción es desconocido, por favor contacte al soporte');
      }
    } catch (error) {
      setStatusMessage(`Ocurrió un error intentalo mas tarde`);
    } finally {
      fetchProducts();
      if (retryCount > 0) {
        setLoading(false);
      }
    }
  };


  const validateCardNumber = (number: string) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterCardRegex = /^5[1-5][0-9]{14}$/;
    if (visaRegex.test(number)) {
      return 'VISA';
    } else if (masterCardRegex.test(number)) {
      return 'MASTERCARD';
    } else {
      return null;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cardNumber = e.target.value;
    setCard({ ...card, number: cardNumber });
    if (cardNumber.length === 16) {
      const cardType = validateCardNumber(cardNumber);
      setCardType(cardType);
    } else {
      setCardType(null);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const requestBody = {
      product_ammount: units,
      product_id: selectedProduct?.id,
      customer_email: customerData.email,
      card,
      customer_data: {
        phone_number: `57${customerData.phone_number}`,
        full_name: customerData.full_name,
        legal_id: customerData.legal_id,
        legal_id_type: customerData.legal_id_type,
      },
      shipping_address: {
        address_line_1: shippingAddress.address_line_1,
        address_line_2: shippingAddress.address_line_2,
        country: 'CO',
        region: shippingAddress.region,
        city: shippingAddress.city,
        name: shippingAddress.name,
        phone_number: `57${shippingAddress.phone_number}`,
        postal_code: shippingAddress.postal_code,
      },
      installments,
    };

    axios.post(`${URL_BASE}transactions/buy`, requestBody, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const { transactionNumber } = res.data;
        await checkTransactionStatus(transactionNumber, token);
      })
      .catch((error) => {
        setStatusMessage(`Ha ocurrido un error: ${error}`);
        setLoading(false)
      });
  };

  function formatPriceCOP(price: number): string {
    const adjustedPrice = price / 100;
    const formattedPrice = new Intl.NumberFormat('es-CO').format(adjustedPrice);
    return `${formattedPrice}`;
  }

  const calculateSubtotal = (price: number, units: number, region: string): string => {
    if (region == "Antioquia") {
      return formatPriceCOP((price * units) + baseFee + 250000);
    } else if (region == "Cundinamarca") {
      return formatPriceCOP((price * units) + baseFee + 200000);
    } else {
      return formatPriceCOP((price * units) + baseFee);
    }
  }

  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    if (phoneNumber !== undefined) {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      const isValidMobile = cleanedNumber.length === 10 && /^[3][0-9]{2}/.test(cleanedNumber);
      const isValidLandline = cleanedNumber.length >= 7 && cleanedNumber.length <= 8;
      return isValidMobile || isValidLandline;
    }
    return false
  };

  return (
    <>
      {!isAuth && (
        <div className='unRegUs'>
          <p>Hola bienvenido a esta tienda de prueba, para comprar debes ser un usuario registrado, si aún no lo eres: <a href="#">Registrate</a></p>
        </div>
      )}
      <div className='main'>
        {productList.map((product) => (
          <Card className='product-card' key={product.id} onClick={() => handleProductClick(product)}>
            <CardMedia
              component='img'
              height='140'
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
                {product.description.length > 30 ? product.description.substring(0, 30) + '...' : product.description}
              </Typography>
              <Typography variant='h6' color='text.primary'>
                {product.stock > 0 ? `$ ${formatPriceCOP(product.price)}` : 'Sin existencias'}
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
                {selectedProduct.stock > 0 ? `$ ${formatPriceCOP(selectedProduct.price)}` : 'Sin existencias'}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                Stock: {selectedProduct.stock}
              </Typography>
              <Typography gutterBottom variant='body1' component='div'>
                {selectedProduct.description}
              </Typography>
              {(!showPaymentForm) && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleShowPaymentForm}
                  disabled={
                    selectedProduct!?.stock < 1 ||
                    isAuth == false
                  }
                >
                  Comprar ahora
                </Button>
              )}
            </DialogContent>
          </Dialog>
        )}
        <Dialog open={showPaymentForm} onClose={handleClosePaymentForm}>
          <DialogTitle>
            Estás por comprar: {selectedProduct?.name}
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
            <TextField
              label='Unidades'
              fullWidth
              margin='normal'
              type='number'
              value={units || 1}
              onChange={(e) => setUnits(Number(e.target.value))}
            />
            <Typography variant='h6'>Detalles del pago</Typography>
            <TextField
              label='Nombre completo'
              fullWidth
              margin='normal'
              value={customerData.full_name || ''}
              onChange={(e) => setCustomerData({ ...customerData, full_name: e.target.value })}
            />
            <TextField
              label='Celular o Número telefónico'
              fullWidth
              margin='normal'
              value={customerData.phone_number || ''}
              onChange={(e) => setCustomerData({ ...customerData, phone_number: e.target.value })}
              helperText={
                isValidPhoneNumber(customerData.phone_number) ? '' : 'Ingrese un número de teléfono válido'
              }
            />
            <InputLabel id="legal-id-type-label">Tipo de documento</InputLabel>
            <Select
              labelId="legal-id-type-label"
              id="select-legal-id-type"
              fullWidth
              margin='dense'
              value={customerData.legal_id_type || ''}
              onChange={(e) => setCustomerData({ ...customerData, legal_id_type: e.target.value })}
            >
              <MenuItem value={'RC'}>RC - Registro civil</MenuItem>
              <MenuItem value={'TE'}>TE - Tarjeta de extranjería</MenuItem>
              <MenuItem value={'CC'}>CC - Cédula de Ciudadanía</MenuItem>
              <MenuItem value={'CE'}>CE - Cédula de Extranjería</MenuItem>
              <MenuItem value={'NIT'}>NIT - Número de Identificación Tributaria</MenuItem>
              <MenuItem value={'PP'}>PP - Pasaporte</MenuItem>
              <MenuItem value={'TI'}>TI - Tarjeta de Identidad</MenuItem>
              <MenuItem value={'DNI'}>DNI - Documento Nacional de Identidad</MenuItem>
              <MenuItem value={'RG'}>RG - Carteira de Identidade / Registro Geral</MenuItem>
              <MenuItem value={'OTHER'}>Otro</MenuItem>
            </Select>
            <TextField
              label='Documento'
              fullWidth
              margin='normal'
              value={customerData.legal_id || ''}
              onChange={(e) => setCustomerData({ ...customerData, legal_id: e.target.value })}
            />
            <TextField
              label='Email'
              fullWidth
              type='email'
              margin='normal'
              value={customerData.email || ''}
              onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
              helperText={
                customerData.email && !isValidEmail(customerData.email) ? 'Ingrese un email válido' : ''
              }
            />
            {customerData.full_name && customerData.phone_number && customerData.legal_id_type && customerData.legal_id && customerData.email && (
              <>
                <Typography variant='h6' gutterBottom>Dirección de envío</Typography>
                <TextField
                  label='Dirección principal'
                  fullWidth
                  margin='normal'
                  value={shippingAddress.address_line_1 || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address_line_1: e.target.value })}
                />
                <TextField
                  label='Complemento'
                  fullWidth
                  margin='normal'
                  value={shippingAddress.address_line_2 || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address_line_2: e.target.value })}
                />
                <InputLabel id="region">Región</InputLabel>
                <Select
                  labelId='region'
                  label='Región'
                  fullWidth
                  margin='dense'
                  value={shippingAddress.region || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, region: e.target.value })}
                >
                  <MenuItem value={'Antioquia'}>Antioquia</MenuItem>
                  <MenuItem value={'Cundinamarca'}>Cundinamarca</MenuItem>
                </Select>
                <InputLabel id="city">Ciudad</InputLabel>
                <Select
                  labelId='city'
                  label='Ciudad'
                  fullWidth
                  margin='dense'
                  value={shippingAddress.city || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                >
                  <MenuItem value={'Bogotá'}>Bogotá</MenuItem>
                  <MenuItem value={'Medellín'}>Medellín</MenuItem>
                </Select>
                <TextField
                  label='Nombre de quien recibe'
                  fullWidth
                  margin='normal'
                  value={shippingAddress.name || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                />
                <TextField
                  label='Celular de quien recibe'
                  fullWidth
                  margin='normal'
                  value={shippingAddress.phone_number || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone_number: e.target.value })}
                  helperText={
                    isValidPhoneNumber(shippingAddress.phone_number) ? '' : 'Ingrese un número de teléfono válido'
                  }
                />
                <TextField
                  label='Código postal'
                  fullWidth
                  margin='normal'
                  value={shippingAddress.postal_code || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                  helperText={
                    shippingAddress.postal_code &&
                      (shippingAddress.postal_code.length < 5 || shippingAddress.postal_code.length > 12)
                      ? 'El código postal debe tener entre 5 y 12 dígitos'
                      : ''
                  }
                />
              </>
            )}
            {customerData.full_name && customerData.phone_number && customerData.legal_id_type && customerData.legal_id && customerData.email &&
              shippingAddress.address_line_1 && shippingAddress.region && shippingAddress.city && shippingAddress.postal_code && (
                <>
                  <Typography variant='h6' gutterBottom>Información de pago</Typography>
                  <TextField
                    label='Número de tarjeta'
                    fullWidth
                    margin='normal'
                    value={card.number || ''}
                    onChange={handleCardNumberChange}
                    InputProps={{
                      endAdornment: cardType && (
                        <img
                          src={cardType === 'VISA' ? 'https://cdn.worldvectorlogo.com/logos/visa-2.svg' : 'https://www.mastercard.com/content/dam/public/brandcenter/global/mastercard_symbol_square_black.png'}
                          alt={cardType}
                          style={{ width: '24px', height: '24px' }}
                        />
                      ),
                    }}
                    inputProps={{ maxLength: 16 }}
                    helperText={
                      card.number && card.number.length !== 16
                        ? 'El número de tarjeta debe tener 16 dígitos.'
                        : ''
                    }
                  />
                  <TextField
                    label='CVC'
                    fullWidth
                    margin='normal'
                    value={card.cvc || ''}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    inputProps={{ maxLength: 4, minLength: 3 }}
                  />
                  <InputLabel id="exp-month">Mes de expiración</InputLabel>
                  <Select
                    labelId='exp-month'
                    label='Mes de expiracion'
                    fullWidth
                    margin='dense'
                    value={card.exp_month || ''}
                    onChange={(e) => setCard({ ...card, exp_month: e.target.value })}
                  >
                    <MenuItem value={'01'}>01</MenuItem>
                    <MenuItem value={'02'}>02</MenuItem>
                    <MenuItem value={'03'}>03</MenuItem>
                    <MenuItem value={'04'}>04</MenuItem>
                    <MenuItem value={'05'}>05</MenuItem>
                    <MenuItem value={'06'}>06</MenuItem>
                    <MenuItem value={'07'}>07</MenuItem>
                    <MenuItem value={'08'}>08</MenuItem>
                    <MenuItem value={'09'}>09</MenuItem>
                    <MenuItem value={'10'}>10</MenuItem>
                    <MenuItem value={'11'}>11</MenuItem>
                    <MenuItem value={'12'}>12</MenuItem>
                  </Select>
                  <InputLabel id="exp-year">Mes de expiración</InputLabel>
                  <Select
                    labelId='exp-year'
                    label='Año de expiración'
                    fullWidth
                    margin='dense'
                    value={card.exp_year || ''}
                    onChange={(e) => setCard({ ...card, exp_year: e.target.value })}
                  >
                    <MenuItem value={'24'}>24</MenuItem>
                    <MenuItem value={'25'}>25</MenuItem>
                    <MenuItem value={'26'}>26</MenuItem>
                    <MenuItem value={'27'}>27</MenuItem>
                    <MenuItem value={'28'}>28</MenuItem>
                    <MenuItem value={'29'}>29</MenuItem>
                    <MenuItem value={'30'}>30</MenuItem>
                    <MenuItem value={'31'}>31</MenuItem>
                    <MenuItem value={'32'}>32</MenuItem>
                    <MenuItem value={'33'}>33</MenuItem>
                    <MenuItem value={'34'}>34</MenuItem>
                    <MenuItem value={'35'}>35</MenuItem>
                    <MenuItem value={'36'}>36</MenuItem>
                    <MenuItem value={'37'}>37</MenuItem>
                  </Select>
                  <TextField
                    label='Nombre en la tarjeta'
                    fullWidth
                    margin='normal'
                    value={card.card_holder || ''}
                    onChange={(e) => setCard({ ...card, card_holder: e.target.value })}
                    helperText={
                      card.card_holder && card.card_holder.length < 5 ? 'El nombre en la tarjeta debe ser de mínimo 5 caracteres' : ''
                    }
                  />
                  <TextField
                    label='Cuotas'
                    fullWidth
                    margin='normal'
                    type='number'
                    value={installments || 1}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                    }
                    label={
                      <span>
                        Acepto haber leido los&nbsp;
                        <a href={permalink} target="_blank" rel="noopener noreferrer">
                          Términos y condiciones y la plítica de privacidad
                        </a>
                        &nbsp;para hacer esta compra
                      </span>
                    }
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    disabled={
                      !customerData.email ||
                      !customerData.full_name ||
                      !customerData.phone_number ||
                      !customerData.legal_id ||
                      !customerData.legal_id_type ||
                      !shippingAddress.address_line_1 ||
                      !shippingAddress.address_line_2 ||
                      !shippingAddress.region ||
                      !shippingAddress.city ||
                      !shippingAddress.name ||
                      !shippingAddress.phone_number ||
                      !shippingAddress.postal_code ||
                      !card.number ||
                      !card.cvc ||
                      !card.exp_month ||
                      !card.exp_year ||
                      !card.card_holder ||
                      !acceptTerms ||
                      card.number.length !== 16 ||
                      (shippingAddress.postal_code.length < 5 || shippingAddress.postal_code.length > 12) ||
                      !isValidPhoneNumber(customerData.phone_number) ||
                      !isValidEmail(customerData.email) ||
                      !isValidPhoneNumber(shippingAddress.phone_number) ||
                      card.card_holder.length < 5 ||
                      shippingAddress.address_line_1.length < 4 ||
                      shippingAddress.address_line_2.length < 4
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Pagar $${calculateSubtotal(selectedProduct!?.price, units || 1, shippingAddress.region)}`
                    )}
                  </Button>
                </>
              )}

          </DialogContent>
        </Dialog>

        {statusMessage && (
          <Dialog open={!!statusMessage} onClose={handleCloseMessage}>
            <DialogTitle>Transaction Status</DialogTitle>
            <DialogContent dividers>
              <Typography variant='h6'>{statusMessage}</Typography>
              <Button onClick={handleCloseMessage} color='primary'>Cerrar</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default MainPage;
