import { Outlet, NavLink } from "react-router";

function FrontLayout () {
    const routes = [
      { path: "/", name: "首頁" },
      { path: "/products", name: "產品列表" },
      { path: "/cart", name: "購物車" },
      { path: "/login", name: "登入頁面" },
    ];

    return(<>
      <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {/*不寫死內容，之後要加入可以調整上方routes內容就好*/}
            {
              routes.map((routes) => (
                <li key={routes.path} className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to={routes.path}>{routes.name}</NavLink>
                </li>
              ))
            }
          </ul>
        </div>
      </nav>
      <Outlet />
    </>)
}

export default FrontLayout