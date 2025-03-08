import { useState, useEffect } from 'react';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { Link } from 'react-router';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products () {
    const [products, setProducts] = useState([]);

    // 全螢幕的loading
    const [ isScreenLoading, setIsScreenLoading ] = useState(false);
    // 跟在按鈕後面的loading
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
      const getProducts = async () => {
        setIsScreenLoading(true);
        try {
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
          setProducts(res.data.products);
        } catch (error) {
          alert(error.response?.data?.message || "取得產品失敗")
        } finally {
          setIsScreenLoading(false);
        }
      };
      getProducts();
    }, []);

    // 加入購物車
    const addCartItem = async(product_id, qty) => {
      setIsLoading(true);
      try {
        const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
          data: {
            // 這裡不用寫product_id: product_id，直接寫以下的也是一樣意思
            product_id,
            qty: Number(qty)
          }
        })
        // 因為還沒渲染到頁面上，可以先以這個確認
        // console.log(res);
      } catch (error) {
        alert(error.response?.data?.message || "加入購物車失敗")
      } finally {
        setIsLoading(false);
      }
    }

    return(<>
      <div className="container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    {/*從button改成Link*/}
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </Link>
                    {/*加入購物車的按鈕預設就是+1，所以qty直接代入1*/}
                    {/*這裡不能只寫product_id，要代入是要電腦去抓什麼內容*/}
                    <button onClick={() => addCartItem(product.id, 1)} type="button" 
                      className="btn btn-outline-danger d-flex justify-content-center align-items-center"
                      disabled={isLoading}>
                      加到購物車
                      {isLoading && (<RingLoader color="#000" size={15} />)}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {
          isScreenLoading && (
            <div 
              style={{
                position: 'fixed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                zIndex: 100,
              }}
            >
          <RingLoader color="#000" height={60} width={60} />
        </div>
          )
        }
      </div>
      
    </>)
}

export default Products;