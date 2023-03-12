[![codecov](https://codecov.io/gh/LPZ0058/easystorage/branch/main/graph/badge.svg?token=KJNGP4OFPO)](https://codecov.io/gh/LPZ0058/easystorage)

**简介**

对localStorage和sessionStorage进行简单的封装。

**支持的功能**


- [x] 支持区分存储类型，并在存取时自动转换
- [x] 自定义名称前缀 prefix
- [x] 支持设置过期时间 expire
- [x] 支持加密，可选加密方法
- [x] 支持内容改变的事件change 和 storage，支持用on和addEventListener两种风格的梆定
- [x] 支持类似toekn的使用续期

**注意**

1. 支持的配置有
   ```ts
   {
    storageType:'localStorage' | 'sessionStorage', // 使用哪个Storage
    prefix: string, // 前缀
    isEncrypt: boolean, // 是否加密存储
    isRenewal: boolean // 是否启用类似token的续期机制
   }
   ```
2. 支持切换使用localStorage和sessionStorage，并且能设置prefix。sessionStorage/localStorage和prefix组成命名空间，不同的命名空间存储的数据相互独立不可见。new EYStorage()时，同一命名空间返回的对象实例是同一个。
3. 关于加密存储，可以自定义加密存储的方式，也可以使用默认的。
4. 支持TypeScript

**引入方法**

1. node
```shell
  npm i @lpz0058/easystorage
```
and
```ts
  import EYStorage  from "@lpz0058/easystorage";
  // or
  const EYStorage = require('@lpz0058/easystorage')
```

2. 浏览器引入：
```html
  <script src="lib/main.umd.js"></script>
  <!-- lib/main.aio.js需要在源码上找 -->
```



**API文档**

待续...

**TODO**

- [ ] 提供类似vuex-persist和vuex集成
- [ ] 提供存储到cookie
- [ ] 提供存储到indexdb