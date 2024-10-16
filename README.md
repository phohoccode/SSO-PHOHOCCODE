# 1. Cấu hình phía backend

Sao chép dự án

```bash
  git clone https://github.com/phohoccode/sso-backend-phohoccode.git
```

Đi tới thư mục dự án

```bash
  cd sso-backend-phohoccode
```

Cài đặt phụ thuộc

```bash
  npm install
```

Khởi động máy chủ

```bash
  npm start
```


## 1.1 Biến môi trường

Để chạy dự án này, bạn sẽ cần thêm các biến môi trường sau vào tệp .env của mình và sửa lại nội dung cần thiết.

`PORT=3000`

`REACT_URL=http://localhost:3000`

`JWT_SECRET=your_jwt_secret_key`

`JWT_EXPIRES_IN=1h`

`SESSION_SECRET=your_session_secret`

`SESSION_EXPIRATION=3600`

`DB_USERNAME=your_db_username`

`DB_NAME=sso-yourdbname`

`DB_PASSWORD=your_db_password`

`DB_HOST=localhost`

`DB_DIALECT=mysql`

`GOOGLE_APP_CLIENT_ID=your_google_client_id`

`GOOGLE_APP_CLIENT_SECRET=your_google_client_secret`

`GOOGLE_APP_REDIRECT_LOGIN=http://localhost:3000/auth/google/callback`

`FACEBOOK_APP_CLIENT_ID=your_facebook_client_id`

`FACEBOOK_APP_CLIENT_SECRET=your_facebook_client_secret`

`FACEBOOK_APP_REDIRECT_LOGIN=http://localhost:3000/auth/facebook/callback`

`GITHUB_APP_CLIENT_ID=your_github_client_id`

`GITHUB_APP_CLIENT_SECRET=your_github_client_secret`

`GITHUB_APP_REDIRECT_LOGIN=http://localhost:3000/auth/github/callback`

`DISCORD_APP_CLIENT_ID=your_discord_client_id`

`DISCORD_APP_CLIENT_SECRET=your_discord_client_secret`

`DISCORD_APP_REDIRECT_LOGIN=http://localhost:3000/auth/discord/callback`

`GOOGLE_APP_PASSWORD=your_google_app_password`

`GOOGLE_APP_EMAIL=your_google_app_email@gmail.com`

## 1.2 API

#### Xác thực token

```http
  POST /verifycation-token
```

| Tham số | Kiểu     |       
| :-------- | :------- |
| `token` | `string` |
| `type` | `string` |


#### Lấy thông tin tài khoản

```http
  GET /api/v1/account
```

#### Đăng xuất tài khoản

```http
  GET /api/v1/logout
```

#### Cập nhật thông tin người dùng

```http
  POST /api/v1/update-user
```

| Tham số | Kiểu     |       
| :-------- | :------- |
| `data` | `string` |

# 2. Cấu hình phía frontend

Tải thư viện cần thiết

```bash
  npm install axios axios-retry react-router-dom
```

## 2.1 Biến môi trường
Thêm biến môi trường sau vào tệp .env

`REACT_APP_API=https://sso-phohoccode.onrender.com`


## Đăng nhập

```javascript
    const handleLogin = () => {
         window.location.href =
            `${process.env.REACT_APP_API}/login?redirectURL=${window.location.origin}`
    }
```

## Đăng xuất

```javascript
    const handeLogout = async () => {
        const response = await axios.get('/api/v1/logout')
    }
```

## App.js

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authenticate from './components/Authenticate';

function App() {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/authenticate' element={<Authenticate />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

```

## Authenticate.js

```javascript
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from '../../custom/axios'

const Authenticate = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const [user, setUser] = useState({})

    useEffect(() => {
        if (user.access_token) {
            navigate('/')
        }
    }, [user])


    useEffect(() => {
        const ssoToken = searchParams.get('ssoToken')
        const typeAccount = searchParams.get('type')

        authenticate(ssoToken, typeAccount)
    }) 
    }, [])

    const authenticate = async (token ,type) => {
        const response = await axios.post('/verifycation-token', {
            token, type
        })
        
        setUser(response.DT)
    }
    
    return (
        <></>
    )
}

export default Authenticate

```

## axios.js

```javascript
import axios from "axios";
import axiosRetry from 'axios-retry';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API,
    withCredentials: true
});

// Tự động gọi api khi lỗi
axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        return error.response.status === 401
    },
    retryDelay: (retryCount, error) => {
        return retryCount * 500
    }
})

instance.interceptors.response.use(function (response) {
    return (response && response.data) ? response.data : response;
}, function (error) {
    if (error && error.response && error.response.data) {
        return error.response.data
    }
    return Promise.reject(error);
});

export default instance

```

## Phản hồi

Nếu bạn có bất kỳ phản hồi nào, vui lòng liên hệ với chúng tôi tại phohoccode@gmail.com



