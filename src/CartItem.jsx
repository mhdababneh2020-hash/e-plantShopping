import React, { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // 添加 Checkout 相关状态
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    zipCode: ''
  });

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
     let total = 0;
    cart.forEach((item) => {
      // Extract quantity and cost for each item
      const quantity = item.quantity;
      const cost = item.cost;
      
      // Convert the cost string (e.g., "$10.00") to a number using parseFloat
      const numericCost = parseFloat(cost.substring(1)); // Remove $ and convert to number
      
      // Multiply cost by quantity and add to total
      total += numericCost * quantity;
    });
    
    // Return the final total sum
    return total;
  };

  const handleContinueShopping = (e) => {
   e.preventDefault(); // 防止默认的表单提交行为
  onContinueShopping(e); // 调用从父组件传入的函数
  };

  const handleIncrement = (item) => {
     dispatch(updateQuantity({
    name: item.name,
    quantity: item.quantity + 1  // 在当前数量基础上加1
  }));
  };

  const handleDecrement = (item) => {
  if (item.quantity > 1) {
    // 如果商品数量大于1，dispatch updateQuantity 来减少数量
    dispatch(updateQuantity({ 
      name: item.name, 
      quantity: item.quantity - 1 
    }));
  } else {
    // 否则如果数量会降到0，dispatch removeItem action 来移除植物
    dispatch(removeItem(item.name));
  }
  };

 const handleRemove = (item) => {
  // 对于 handleRemove 函数，需要 dispatch removeItem action 来删除商品
  dispatch(removeItem(item.name));
};

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
  const numericCost = parseFloat(item.cost.substring(1));
  return (item.quantity * numericCost).toFixed(2);
};

  // 修改原来的 handleCheckoutShopping 函数
  const handleCheckoutShopping = (e) => {
    e.preventDefault();
    setShowCheckout(true); // 显示 checkout 页面
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理订单提交
  const handlePlaceOrder = () => {
    // 验证必填字段
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address || !customerInfo.phone) {
      alert('Please fill in all required fields (Name, Email, Address, Phone)!');
      return;
    }

    const totalAmount = calculateTotalAmount().toFixed(2);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // 显示订单确认
    alert(`🎉 Order Placed Successfully!

Customer: ${customerInfo.fullName}
Email: ${customerInfo.email}
Delivery Address: ${customerInfo.address}
Phone: ${customerInfo.phone}

Order Summary:
• Total Items: ${itemCount}
• Total Amount: $${totalAmount}

Your plants will be delivered within 3-5 business days!
Thank you for choosing Paradise Nursery! 🌱`);
    
    // 重置状态
    setShowCheckout(false);
    setCustomerInfo({
      fullName: '',
      email: '',
      address: '',
      phone: '',
      city: '',
      zipCode: ''
    });
  };

  // 如果显示 Checkout 页面，返回 Checkout 界面
  if (showCheckout) {
    return (
      <div className="cart-container">
        <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '30px' }}>
          🛒 Checkout
        </h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* 订单摘要 */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px',
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 Order Summary</h3>
            
            {cart.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid #ddd'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    {item.cost} × {item.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  ${calculateTotalCost(item)}
                </span>
              </div>
            ))}
            
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              padding: '20px 0',
              borderTop: '2px solid #4CAF50',
              color: '#4CAF50',
              textAlign: 'right'
            }}>
              Total: ${calculateTotalAmount().toFixed(2)}
            </div>
          </div>
          
          {/* 客户信息表单 */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px',
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>🚚 Delivery Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={customerInfo.fullName}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
                required
              />
              
              <input 
                type="email"
                name="email"
                placeholder="Email Address *"
                value={customerInfo.email}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
                required
              />
              
              <input 
                type="text"
                name="address"
                placeholder="Street Address *"
                value={customerInfo.address}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
                required
              />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  style={{ 
                    flex: '1', 
                    padding: '12px', 
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }} 
                />
                
                <input 
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={customerInfo.zipCode}
                  onChange={handleInputChange}
                  style={{ 
                    flex: '1', 
                    padding: '12px', 
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
              
              <input 
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={customerInfo.phone}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
                required
              />
            </div>
          </div>
        </div>
        
        {/* 按钮区域 */}
        <div className="continue_shopping_btn" style={{ marginTop: '30px' }}>
          <button 
            className="get-started-button"
            onClick={handlePlaceOrder}
            style={{ 
              backgroundColor: '#4CAF50',
              marginRight: '15px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🌱 Place Order
          </button>
          
          <button 
            className="get-started-button1"
            onClick={() => setShowCheckout(false)}
            style={{ 
              backgroundColor: '#f44336',
              color: 'white'
            }}
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // 原始购物车页面 (保持你的原有样式)
  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount()}</h2>
      <div>
        {cart.map(item => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              <div className="cart-item-quantity">
                <button className="cart-item-button cart-item-button-dec" onClick={() => handleDecrement(item)}>-</button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button className="cart-item-button cart-item-button-inc" onClick={() => handleIncrement(item)}>+</button>
              </div>
              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
              <button className="cart-item-delete" onClick={() => handleRemove(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', color: 'black' }} className='total_cart_amount'></div>
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>Continue Shopping</button>
        <br />
        <button className="get-started-button1" onClick={handleCheckoutShopping}>Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;
