# Crypto Exchange Backend

Backend API for a LATAM crypto exchange 💰

## Features:
* ✍️ Register buys and sells of cryptocurrencies with a profit margin that is adjustable.
* 📱 Takes current prices from Binance API
* 👨‍💼 Includes cryptocurrency inventory management by administrator.
* ⚠️ Show alerts when the exchange has specific low crypto inventory.
* 📈 Provides current cash balance and profits registered.
>>


## Admin Routes

***

### **POST** inventoryBuy

```
http://localhost:5005/api/admin/inventory/buy
```


```
{
  "cryptoName": "ETH",
  "cryptoBuyAmount": 3,
  "cryptoBuyPrice": 700
}
```

***


### **GET** check totalInventory

```
http://localhost:5005/api/admin/inventory
```

***



### **POST** createCrypto

```
http://localhost:5005/api/admin/inventory/create
```


```
{
  "cryptoName": "ETH",
  "coinQuantity": 1,
  "coinPrice": 1700
}
```

***



## Finances Routes

***

### **GET** getAllAssets

```
http://localhost:5005/api/admin/finances/getAssets
```

***



### **POST** add Cash

```
http://localhost:5005/api/admin/finances/addCash
```


```
{
  "cash": 1000
}
```

***

## User Routes

***

### **POST** buyCripto

```
http://localhost:5005/api/user/my-profile/buy
```


```
{
  "cryptoName": "BTC",
  "cryptoBuyAmount": 1,
  "cryptoBuyPrice": 20000 //It doesnt matter since API is connected to Binance and will take real time crypto price.
}
```

***


### **POST** sellCripto

```
http://localhost:5005/api/user/my-profile/sell
```


```
{
  "cryptoName": "ETH",
  "cryptoSellAmount": 1,
  "cryptoSellPrice": 1500
}
```

***


### **GET** profile

```
http://localhost:5005/api/user/my-profile
```

Headers Content-Type application/json

***

## Auth Routes

***

### **GET** logout

```
http://localhost:5005/api/auth/logout
```

***

### **POST** loginAdmin

```
http://localhost:5005/api/auth/login
```

```
{
  "email": "admin@gmail.com",
  "password": "12345"
}
```

***



### **POST** loginUser

```
http://localhost:5005/api/auth/login
```


```
{
  "email": "arc@gmail.com",
  "password": "12345"
}
```

***



### **POST** signUpAdmin

```
http://localhost:5005/api/auth/signup
```



```
{
  "email": "admin@gmail.com",
  "password": "12345",
  "confirmPassword": "12345",
  "firstName": "Victor",
  "lastName": "Barrantes"
}
```

***



### **POST** signUpUser

```
http://localhost:5005/api/auth/signup
```



```
{
  "email": "arc@gmail.com",
  "password": "12345",
  "confirmPassword": "12345",
  "firstName": "Arturo",
  "lastName": "Barrantes"
}
```

***

### **GET** home+WebSocketBinance

```
http://localhost:5005/api
```

***


### **POST** imageUpload

```
http://localhost:5005/api/upload/single
```

Headers Content-Type multipart/form-data Body formdata image null

***


### **GET** binanceTest

```
https://testnet.binance.vision/api/v3/ticker/24hr?symbol=BTCUSDT
```

***

