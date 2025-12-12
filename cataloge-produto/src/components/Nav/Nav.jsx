import React, { useEffect, useState } from 'react'

function Nav() {
     { /*-----------------varaible decalartion--------------------------*/}
        const [cartCount, setCartCount] = useState(0);
        const [isCartOpen, setIsCartOpen] = useState(false);
        const [cartItems, setcartItems] = useState([]);

        useEffect(() => {
            const updateCart = () => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                setcartItems(cart);
                setCartCount(cart.length);
            };

             { /*-----------------UPDATE CART--------------------------*/}

            updateCart();
            window.addEventListener('cartUpdated', updateCart);
            return () => window.removeEventListener('cartUpdated', updateCart);
        }, []);

        const removeItem = (id) => {
            const updated = cartItems.filter((item) => item.id !== id);
            setcartItems(updated);
            localStorage.setItem('cart', JSON.stringify(updated));
            setCartCount(updated.length);
            window.dispatchEvent(new Event('cartUpdated'));
        };

        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + parseFloat(item.price.replace('₦', ''));
        }, 0).toFixed(2);

            



  return (
    <>
    <div className="px-5 bg-light">
        <nav className="navbar navbar-light justify-content-between px-5 w-100">
            <a href="#" className='navbar-brand fs-6 fw-bold  '>D.O.T.M.A.N</a>

            <div className="product-search flex-grow-1 d-flex justify-content-center">
                <input
                 type="text" 
                 className='form-control'
                 placeholder='Pesquisar produto . . .'
                 style={{maxWidth:'500px'}}
                 />
            </div>
            <div className="cart-icon position-relative" style={{cursor:'pointer'}} onClick={() => setIsCartOpen(true)}>
                <i className="bi bi-bag fs-4"></i>
                <span className='cart-qunti'>{cartCount}</span>
            </div>
        </nav>

    </div>
   { /*-----------------side-bar--------------------------*/}
        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
            <div className='cart-header d-flex justify-content-between align-item-center p-3 border-bottom'>
                <h5 className='m-0'>Your cart</h5>
                <button className='btn btn-sm btn-outline-dark bg-dark text-white' onClick={() => setIsCartOpen(false)}>Close</button>
                     </div>
                     <div className='cart-body p-3'>
                         {cartItems.length === 0 ? (
                            <p className='alert alert-danger'>Your Cart Is Empty</p>
                                ) : (
                            cartItems.map((items) => (
                                <div key={items.id} className='d-flex mb-3 align-items-center'>
                                    <img src={items.image} width={60} height={60} className='m-3 rounded' alt=""/>
                                    <div className="flex-grow-1">
                                        <h6 className='mb-1'>{items.product.name}</h6>
                                        <p className="mb-1">{items.price}</p>
                                    </div>
                                    <button className="btn btn-sm bg-dark text-white" onClick={() => removeItem(items.id)}>X</button>
                                </div>
    
                            ))
                        ) }
                     </div>
                     {cartItems.length > 0 && (
                        <div className='cart-footer p-2 border-top'>
                        <h6>Total : ₦{totalPrice}</h6>
                        <button className="btn btn-dark w-100 mt-2">Your Total will be?</button>
                        </div>
                     )}
                 </div>


   </>
   
  );
}

export default Nav