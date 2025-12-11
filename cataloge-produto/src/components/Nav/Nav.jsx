import React from 'react'

function Nav() {
  return (
    <>
    <div className="px-5 bg-light">
        <nav className="navbar navbar-light justify-content-between px-5 w-100">
            <a href="#" className='navbar-brand fs-3 fw-bold'>Home</a>

            <div className="product-search flex-grow-1 d-flex justify-content-center">
                <input
                 type="text" 
                 className='form-control'
                 placeholder='Pesquisar produto . . .'
                 style={{maxWidth:'500px'}}
                 />
            </div>
            <div className="cart-icon position-relative" style={{cursor:'pointer'}}>
                <i className="bi bi-bag fs-4"></i>
                <span className='cart-qunti'>0</span>
            </div>
        </nav>

    </div>
   { /*-----------------side-bar--------------------------*/}
        <div className={`cart-sidebar ${isCartopen ? 'open' : ''}`}>
            <div className='cart-header d-flex justify-content-between align-item-center p-3 border-bottom'>
                <h5 className='m-0'>Your cart</h5>
            </div>
        </div>
   </>
  )
}

export default Nav