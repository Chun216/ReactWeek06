import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { RingLoader } from 'react-spinners';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductDetail () {
    const [product, setProduct] = useState({});
    const [qtySelect, setQtySelect] = useState(1);
    // 跟在按鈕後面的loading
    const [ isLoading, setIsLoading ] = useState(false);

    // id可以藉由useParams取得
    const { id } = useParams();
    useEffect(() => {
      const getProductDetail = async () =>{
        try {
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
          setProduct(res.data.product)
        } catch (error) {
          alert(error.response?.data?.message || "查看更多失敗")
        }
      };
      getProductDetail();      
    }, [])

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
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <img className="img-fluid" src={product.imageUrl} alt={product.title} />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              {/*記得加入點選後所要進行的事件*/}
              <button
                onClick={(() => addCartItem(product.id, Number(qtySelect)))} 
                type="button" 
                className="btn btn-primary d-flex align-items-center"
                disabled={isLoading}>
                加入購物車
                {isLoading && (<RingLoader color="#000" size={15} />)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default ProductDetail;