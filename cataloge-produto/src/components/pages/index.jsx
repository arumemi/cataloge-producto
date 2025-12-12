import React, { useEffect, useMemo, useState } from 'react'
import productData from './../../products.json'

// normalize product fields coming from products.json
const normalize = (p) => ({
    id: p.id,
    name: p.Productname || p.name || '',
    price: p.Price || p.price || '₦0',
    description: p.Description || p.description || '',
    image: p.image || '',
    tag: p.tag || ''
});

function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSortOption, setFilterSortOption] = useState('all');

    // listen to search events from Nav (custom event)
    useEffect(() =>{
        const handleSearchQuery = (e) => setSearchQuery((e && e.detail) ? String(e.detail).toLowerCase() : '');
        window.addEventListener('searchQueryChanged', handleSearchQuery);
        return () => window.removeEventListener('searchQueryChanged', handleSearchQuery);
    }, []);

    const products = useMemo(() => productData.map(normalize), []);

    const displayedProducts = useMemo(() => {
        let filtered = [...products];

        if(filterSortOption === 'New' || filterSortOption === 'sale'){
            filtered = filtered.filter(product => product.tag === filterSortOption);
        }

        if(filterSortOption === 'low'){
            filtered.sort((a,b) => parseFloat(a.price.replace(/[₦,]/g,'')) - parseFloat(b.price.replace(/[₦,]/g,'')));
        }
        if(filterSortOption === 'high'){
            filtered.sort((a,b) => parseFloat(b.price.replace(/[₦,]/g,'')) - parseFloat(a.price.replace(/[₦,]/g,'')));
        }

        if(searchQuery.trim() !== ''){
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery)
            );
        }

        return filtered;
    }, [products, filterSortOption, searchQuery]);

    const addToCart = (product) =>{
        const existing = JSON.parse(localStorage.getItem('cart')) || [];
        const alreadyCart = existing.find(p => p.id === product.id);
        let updatedCart;
        if(alreadyCart){
            updatedCart = existing.map(p => p.id === product.id ? {...p, quantity: (p.quantity || 1) + 1} : p);
        } else {
            updatedCart = [...existing, {...product, quantity: 1}];
        }
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    }

    return (
        <>
            <div className="shop-container">
                <div className='container'>
                    <h1 className='text-dark py-4 fw-semibold'>Products</h1>

                    <div className='container my-4'>
                        <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
                            <div className='text-muted' style={{fontSize: '1.1rem'}}>
                                Showing <strong>{displayedProducts.length}</strong> product{displayedProducts.length !== 1 && 's'} for <strong>{filterSortOption === 'all' ? 'All' : filterSortOption}</strong>
                            </div>
                            <div>
                                <select className='form-select py-2 fs-6' style={{minWidth: '260px', backgroundcolor:'f5f5f5', border:'opx'}} value={filterSortOption} onChange={(e) => setFilterSortOption(e.target.value)}>
                                    <option value="all">All PROUCTS</option>
                                    <option value="low">Price: Low to High</option>
                                    <option value="high">Price: High to Low</option>
                                    <option value="sale">Sale Product</option>
                                    <option value="new">New Products</option>
                                    <option value="high"></option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        {displayedProducts.map(prod => (
                            <div className='col-12 col-md-4 mb-4' key={prod.id}>
                                <div className='card'>
                                    {prod.image && <img src={prod.image} className='card-img-top' alt={prod.name} />}
                                    <div className='card-body'>
                                        <h5 className='card-title'>{prod.name}</h5>
                                        <p className='card-text'>{prod.description}</p>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <strong>{prod.price}</strong>
                                            <button className='btn btn-sm btn-dark' onClick={() => addToCart(prod)}>Add to cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Index