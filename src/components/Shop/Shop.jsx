import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const cart = useLoaderData()
    // const [cart, setCart] = useState([])
    const [perPage,setPerPage] = useState(10)
    const [currentPage,setCurrentPage] = useState(0)
    // const {count} = useLoaderData()
    const [count , setCount] = useState(0);



    // pagination

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${perPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage]);


        useEffect(()=> {
        fetch('http://localhost:5000/productscount')
        .then(res => res.json())
        .then(data => setCount(data.count))
    },[])


    const totalPageItem = Math.ceil(count/perPage);
    const pages = [...Array(totalPageItem).keys()]
    //  or 
    // const pages = [];
    // for(let i = 0; i <= itemPages; i++){
    //     pages.push(i)
    // }

   const handlePageItems = e => {
    const value = parseInt(e.target.value)
    console.log(value)
    setPerPage(value)
    setCurrentPage(0);
}
    
    const handlePervButton = () => {
        if(currentPage > 0){
            setCurrentPage(currentPage - 1)
        }}
    const handleNextButton = () => {
        if(currentPage < pages.length - 1){
            setCurrentPage(currentPage + 1)
        }}
    



//  main oparation 

    // useEffect(() => {

    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])


    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }







 return (


    <> 
        <div className='shop-container'>
            <div className="products-container" >
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }

       

            </div>

          


            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>


<div style={{margin:'100px 0', textAlign:'center'}}>
<h1>pagination</h1>
<button   style={{margin:'05px'}}  onClick={handlePervButton}>perv</button>
{
    pages.map(pageNo => <button className={currentPage === pageNo ? 'selected' : ''}  style={{margin:'5px'}}  key={pageNo} onClick={()=> setCurrentPage(pageNo)} > {pageNo} </button>)
}

<button  style={{margin:'0 5px'}} onClick={handleNextButton}>next</button>
<button>
<select value={perPage} onChange={handlePageItems} >
    <option value="10">10</option>
    <option value="15">15</option>
    <option value="20">20</option>
    <option value="50">50</option> 
</select>
</button>
</div>


</>
    );
};

export default Shop;