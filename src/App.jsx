import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { RingLoader } from 'react-spinners';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [tempProduct, setTempProduct] = useState([]);

  

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

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
      // 加入購物車後重新渲染購物車列表
      getCartProducts();
      // 因為還沒渲染到頁面上，可以先以這個確認
      // console.log(res);
    } catch (error) {
      alert(error.response?.data?.message || "加入購物車失敗")
    } finally {
      setIsLoading(false);
    }
  }

  

  // 處理表單內容
  const {  // 取出來用的方法
    register, // 註冊表單元素
    handleSubmit, // 處理表單提交
    formState: { errors },  // 錯誤提示
    reset
  } = useForm();

  // 使用方法
  const onSubmit = handleSubmit((data) => {
    // 尚未加入結帳API時可以先用這個來確認內容與驗證表單
    // console.log(data);
    // 從data把內容解構出來
    const { message, ...user } = data;
    const userInfo = {
      data: {
        message,
        user
      }
    }
    checkout(userInfo);
  })

  // 確認是否有正確載入useForm
  //console.log('useForm response:', { register, handleSubmit, errors });

  // 取得axios，結帳API
  const checkout = async(data) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      reset();
      // removeCart();
      // getCartProducts(); 
    } catch (error) {
      alert(error.response?.data?.message || "結帳失敗")
    } finally {
      setIsScreenLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="mt-4">
        

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
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
                </div>
              </div>
              <div className="modal-footer">
                {/*這裡不能只寫product_id，要代入是要電腦去抓什麼內容*/}
                <button onClick={() => addCartItem(tempProduct.id, qtySelect)}
                        disabled={isLoading} 
                        type="button" 
                        className="btn btn-primary d-flex justify-content-center align-items-center">
                  <div>加入購物車</div>
                  {isLoading && (<RingLoader color="#000" size={15} />)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*當購物車清空時，表格與按鈕都會一併消失*/}
        {
          cart.carts?.length > 0 && (
            <div>
              <div className="text-end py-3">
                <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                  清空購物車
                </button>
              </div>
      
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th style={{ width: "150px" }}>數量/單位</th>
                    <th className="text-end">單價</th>
                  </tr>
                </thead>
      
                <tbody>
                  {/*加入可選串聯是因為carts是後續生成的內容為了防止錯誤*/}
                  {
                    cart.carts?.map((cartItem) => {
                      return (
                        <tr key={cartItem.id}>
                          <td>
                            <button onClick={() => removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                              x
                            </button>
                          </td>
                          <td>{cartItem.product.title}</td>
                          <td style={{ width: "150px" }}>
                            <div className="d-flex align-items-center">
                              <div className="btn-group me-2" role="group">
                                <button
                                  onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                                  disabled={cartItem.qty === 1}
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  -
                                </button>
                                <span
                                  className="btn border border-dark"
                                  style={{ width: "50px", cursor: "auto" }}
                                >{cartItem.qty}</span>
                                <button
                                  onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  +
                                </button>
                              </div>
                              <span className="input-group-text bg-transparent border-0">
                                {cartItem.product.unit}
                              </span>
                            </div>
                          </td>
                          <td className="text-end">{cartItem.total}</td>
                        </tr>
                      )
                    })
                  }  
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: "130px" }}>{cart.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        }
      </div>

      

      
      

      {/*<div
          style={{
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 100,
          }}
        >
          <ReactLoading type="spin" color="#000" width={100} height={100} />
        </div>*/}
      
    </div>);
}


export default App
