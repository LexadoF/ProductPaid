import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { URL_BASE } from '../../shared/constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const [productList, setProductList] = useState(Array());
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate('/store');
    axios.get(`${URL_BASE}products`).then((res) => {
      if (res.status === 200) {
        setProductList(res.data);
      }
    });
  }, []);

  console.log(productList)
  return (
    <>
      <div className='main'>
        {productList && productList.map((product) => {
          return (
            <div id='product-card' key={product.id}>
              <img src={product.image} alt="product-img" />
              <div >{product.name} </div>
              <div >{product.description} </div>
              <div >{product.price} </div>
              <div >{product.stock} </div>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default MainPage;
