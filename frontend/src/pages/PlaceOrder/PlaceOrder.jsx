import { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }
  useEffect(() => {
    console.log(data);

  }, [data])

  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.map((item) => {
  //     if (cartItems[item._id] > 0) {
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   })
  //   let orderData = {
  //     address:data,
  //     items:orderItems,
  //     amount:getTotalCartAmount()+2,
  //   }
  //   let response = await axios.post(url + "/api/order/place", orderData, {headers:{token}});
  //   if(response.data.success){
  //     const {session_url} = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else{
  //     alert("Error");
  //   }
  // }
  const placeOrder = async (event) => {
    event.preventDefault();
  
    try {
      // Preparing order items
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          ...item,
          quantity: cartItems[item._id]
        }));
  
      // Preparing order data
      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };
  
      console.log("Order Data:", orderData); // Log order data before sending
  
      // Sending request to place the order
      const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
  
      console.log("API Response:", response.data); // Log the API response
  
      // Handling response based on success
      if (response.data && response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        console.error("Order placement failed:", response.data);
        alert("Error: Unable to place order. Response: " + JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Error: Unable to place order. Please check the console for details: " + error.message);
    }
  };

  const navigate = useNavigate();

  useEffect(()=>{
      if (!token){
        navigate('/cart')
      }else if(getTotalCartAmount()===0)
      {
        navigate('/cart')
      }
  },[token])
  



  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Inforamtion</p>
        <div className='multi-fields'>
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First Name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last Name' required />
        </div>
        <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email Address' required />
        <input name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' required />
        <div className='multi-fields'>
          <input name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' required />
          <input name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State' required />
        </div>
        <div className='multi-fields'>
          <input name='zipCode' onChange={onChangeHandler} value={data.zipCode} type='text' placeholder='Zip code' required />
          <input name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' required />
        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone' required />
      </div>

      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div className='cart-total-details'>
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className='cart-total-details'>
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className='cart-total-details'>
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder