import { createHashRouter } from "react-router";
import FrontLayout from "../layouts/FrontLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import NotFound from '../pages/NotFound.jsx';
import Login from '../pages/Login.jsx';
import Checkout from "../pages/Checkout.jsx";

const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
        {
            path: '',
            element: <Home />,
        },
        {
            path: 'products',
            element: <Products />,
        },
        {
            path: 'products/:id',
            element: <ProductDetail />,
        },
        {
            path: 'cart',
            element: <Cart />,
        },
        {
            path: 'checkout',
            element: <Checkout />,
        }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

const router = createHashRouter(routes);

export default router