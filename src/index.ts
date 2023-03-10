
/**
[ ] 支持区分存储类型，并在存取时自动转换
[ ] 自定义名称前缀 prefix
[ ] 支持设置过期时间 expire
[ ] 支持加密，可选加密方法
[ ] 支持内容改变的事件change，支持常见的onchange 和 addEventListener注册
[ ] storageType为EYStorageTypeOptions.LOCALSTORAGE 支持storage事件,完成跨页面同步
 */

import { EYStorageConfig, EYStorageTypeOptions, instanceConfig } from "./types"
import { decrypt, encrypt } from "./util"


const ETStorageCache: Record<string, EYStorage> = Object.create(null)



/**
// 判断是否支持 isSupported

// 设置 setItem

// 获取 getItem

// 是否存在 hasStorage

// 获取所有key getAllKeys

// 删除 removeItem

// 清空 clear

 */
/**
 * 约定：
 *  1. 约定storeKey是加了prefix的
 *  2. 对于EYStorage，它的配置中type和prefix相同的属于同一个空间，相同空间只有一个实例
 *     重复创建相同type和prefix返回的实例相同。prefix设置为空字符串则为全局.当然这些都是建立在同域的情况下
 *  3. 全局静态变量getCurrentTimeStamp decrypt encrypt config 都可以覆盖进而改变对应
 *     的行为
 *  4. 
 */




/**
 *  * 真正设置数据的方法
 * @param type 'localStorage' 或者 'sessionStorage'
 * @param isEncript 是否加了密 
 * @param key 
 * @param value 
 */
function realSetItemFun(type:EYStorageTypeOptions, isEncrypt:boolean , key:string, value:string) {
  value = !isEncrypt?`000#${value}`:`${String(encryptId).padStart(3,'0')}#${value}`
  window[type].setItem(key,value)
}
/**
 * 真正获取存储的数据的方法
 * @param type 'localStorage' 或者 'sessionStorage'
 * @param key 
 */
function realGetItemFun(type:EYStorageTypeOptions, key:string):string | null{

  let value = window[type].getItem(key)
  if(value){
    if(value.indexOf('#') === 3) {
      const id = parseInt(value.substring(0,3))
      if(!isNaN(id)) usedDecryptWay = encryptArr[id].decrypt
    } else{
      usedDecryptWay = encryptArr[0].decrypt
    }
  }
  value = value?.substring(4) || ''
  return value

}


/**
 * 将key加上前缀转换成storage
 * @param key 
 * @param config 
 * @returns 
 */
function getStoreKey(key, config){
  const prefix = config.prefix
  return prefix ? prefix + `_${key}` : key
}
/**
 * 将storeKey还原成key，在调用前必须判断下storeKey的正确性
 * @param storeKey 
 * @param config 
 * @returns 
 */
function revertStoreKey(storeKey:string, config){
  const prefix = config.prefix?`${config.prefix}_`:''
  return storeKey.substring(prefix.length)
}

/**
 * 判断key是否属于当前prefix的StoreKey
 * @param key 
 * @param config 
 * @returns 
 */
function isStoreKey(key, config){
  const prefix = config.prefix?`${config.prefix}_`:''
  return key.startsWith(prefix)
}
/**
 * 解析storeStr获取想要存储的值
 * @param storeStr storage实际存储的字符串
 * @param config 
 * @returns 
 */
function parseValue(storeStr) {
  if (!storeStr) return null
  // const data = this.config.isEncrypt?JSON.parse(decrypt(storeStr)):JSON.parse(storeStr as string)
  const data = JSON.parse(usedDecryptWay(storeStr))
  // console.log(data.expire < EYStorage.getCurrentTimeStamp() - data.time)
  // 检查是否过期
  if(typeof(data.expire) === 'number' && (data.expire < EYStorage.getCurrentTimeStamp() - data.time)) { // 如果过期,直接删除
    return null
  } else {
    // 如果需要续期
    const value = data.value
    return value
  }
}

function saveItem(key:string, value:any,config:instanceConfig,expire?:number) {
  const data:Record<string, any> = {value, time: EYStorage.getCurrentTimeStamp()}
  if(expire && expire < 0) throw new Error('Expire must be greater than or equal to 0')
  data.expire = expire || config.expire
  // console.log(data)
  const storeStr = config.isEncrypt?usedEncryptWay(JSON.stringify(data)):JSON.stringify(data)
  // window[config.storageType].setItem(getStoreKey(key, config), storeStr)
  realSetItemFun(config.storageType,config.isEncrypt, getStoreKey(key, config),storeStr)
}

declare type encryptFun = (data:string) => string
declare type  decryptFun = (data:string) => string

// 收集加减密方法的容器
const encryptArr:Array<{encrypt:encryptFun,decrypt:decryptFun}> = []
encryptArr[0] = {
  encrypt:data => data,
  decrypt: data => data
}
encryptArr[1] = {
  encrypt,
  decrypt
}
// 当前使用的加密方法的id
let encryptId = 1
/**
 * 添加一组加解密的方法,并返回对应编号,一定要记住这个编号(大于0)和对应方法,不然可能会导致已经存储的加密信息无法解密的问题
 * @param encrypt 
 * @param decrypt 
 */
function registerEncrypt(encrypt:decryptFun, decrypt:decryptFun):number {
  return (encryptArr.push({encrypt,decrypt}) - 1)
}
/**
 * 根据编号切换加密方法
 * @param id 
 */
function selectEncryptWay(id:number) {
  if(id <= 0 || !encryptArr[id]) throw new Error('请输入正确的id')
  
  usedEncryptWay = encryptArr[id].encrypt
  encryptId = id
}

/**
 * 全局默认配置
 * 
 * storageType:  localStorage
 * 
 * prefix:  ''
 * 
 * expire： 1天
 * 
 * isEncrypt: true
 * 
 * isRenewal: true
 */
const defaultConfig:instanceConfig = {
  storageType: EYStorageTypeOptions.LOCALSTORAGE,
  prefix: '',
  expire: 24 * 60 * 60 * 1000,
  isEncrypt: true,
  isRenewal: true
}


declare type changeCallBack = (event:{key:string, newValue, oldValue}) => void
declare type storageCallBack = (event:{key:string, newValue, oldValue, url:string, storageArea: Storage}) => void

export class EYStorage {
  private config: instanceConfig
  private changeCallBackArr:Array<changeCallBack>
  private storageCallBackArr:Array<storageCallBack>
  onchange:changeCallBack | undefined
  onstorage:storageCallBack | undefined

  constructor(config?: EYStorageConfig) {
    this.config = Object.assign(defaultConfig, EYStorage.config, config)
    this.changeCallBackArr = []
    this.storageCallBackArr = []
    const spaceName = this.config.storageType + '@@@' + this.config.prefix
    if(ETStorageCache[spaceName]) {
      return ETStorageCache[spaceName]
    } else {
      ETStorageCache[spaceName] = this
    }
  }
  // 删除 key 的记录
  removeItem(key:string){
    const storeKey = getStoreKey(key,this.config)
    // const value = window[this.config.storageType].getItem(storeKey)
    const storeStr = realGetItemFun(this.config.storageType,storeKey)
    const value = JSON.parse(usedDecryptWay(storeStr))
    window[this.config.storageType].removeItem(storeKey)
    if(this.onchange) this.onchange.call(this,{key,newValue:null,oldValue:value.value})
    for(const cb of this.changeCallBackArr) {
      cb.call(this,{key,newValue:null,oldValue:value.value})
    }
  }

  /**
   * 获取符合当前expire的key
   * @returns 
   */
  getAllKeys():Array<string>{
    const keyArr:Array<string> = []
    const strageKeyArr = Object.keys(localStorage)
    for(const key of strageKeyArr){
      if(!isStoreKey(key,this.config)) continue
      keyArr.push(revertStoreKey(key, this.config))
    }
    return keyArr
  }
  
  // 清除当前空间下的全部记录
  clear(){
    const keyArr = this.getAllKeys()
    for(const key of keyArr){
      this.removeItem(key)
    }
  }

  // 设置 setItem
  setItem(key:string, value:any, expire?:number) {
    const oldValue = this.getItem(key)

    saveItem(key,value,this.config,expire)

    if(this.onchange) this.onchange.call(this,{key,newValue:value,oldValue})
    for(const cb of this.changeCallBackArr) {
      cb.call(this,{key,newValue:value,oldValue})
    }
  }

  // 获取 getItem
  getItem(key:string) {
    const originKey = key
    key = getStoreKey(key, this.config);
    // 找不到对应的key
    // const storeStr = window[this.config.storageType].getItem(key)
    const storeStr = realGetItemFun(this.config.storageType,key)
    if (!storeStr) return null
    let data
    try {
      // data = this.config.isEncrypt?JSON.parse(decrypt(storeStr)):JSON.parse(storeStr as string)      
      data = JSON.parse(usedDecryptWay(storeStr))
    } catch (error) {
      console.log(error);
      
    }
    // console.log(data.expire < EYStorage.getCurrentTimeStamp() - data.time)
    // 检查是否过期
    if(typeof(data.expire) === 'number' && (data.expire < EYStorage.getCurrentTimeStamp() - data.time)) { // 如果过期,直接删除
      window[this.config.storageType].removeItem(key)
      return null
    } else {
      // 如果需要续期
      const value = data.value
      if(this.config.isRenewal) {
        const expire = data.expire
        saveItem(originKey,value,this.config,expire)
      }
      return value
    }
  }
  /**
   * 判断当前EYStorage对象是否能用
   * @returns 
   */
  isSupported() :boolean {
    return testSupport(this.config.storageType)
  }

  activeStorageEventCB(event) {
    const {key, newValue, oldValue} = event
    if(!key || !isStoreKey(key,this.config)) return
    event.key = revertStoreKey(key, this.config)
    event.newValue = parseValue(newValue)
    event.oldValue = parseValue(oldValue)
    this.storageCallBackArr.forEach((cb) => {
      cb.call(this, event)
    })
    if(this.onstorage) this.onstorage.call(this,event)
    
  }

  addEventListener(event:'change',cb:changeCallBack)
  addEventListener(event:'storage',cb:storageCallBack)
  addEventListener(event, cb) {
    if(event === 'change' && this.changeCallBackArr.indexOf(cb) === -1) this.changeCallBackArr.push(cb)
    if(event === 'storage' && this.storageCallBackArr.indexOf(cb) === -1) this.storageCallBackArr.push(cb)
  }


  /**
   * 设置全局的默认配置
   */
  static config: EYStorageConfig = defaultConfig
  // /**
  //  * 内部用于加密的方法
  //  */
  // static encrypt = encrypt
  // /**
  //  * 内部用于解密的方法
  //  */
  // static decrypt = decrypt
  /**
   * 获取当前的时间戳，在内部用于过期时间的比较
   * @returns 当前的时间戳
   */
  static getCurrentTimeStamp:()=>number = function() {
    return Date.now()
  }
  /**
   * 切换加密方法
   */
  static selectEncryptWay = selectEncryptWay
  /**
   * 添加加解密放
   */
  static registerEncrypt = registerEncrypt
}

let usedEncryptWay = encrypt
let usedDecryptWay = decrypt

function testSupport(type:EYStorageTypeOptions) {
  try {
    const mod = '__storage_test__';
    window[type].setItem(mod, mod);
    window[type].removeItem(mod);
    return true;
  } catch(e) {
      return false;
  }
}

// // 注册storage函数
const storageCallBackMap:Map<Storage,Array<EYStorage>> = new Map()
if(testSupport(EYStorageTypeOptions.LOCALSTORAGE)) {
  window.addEventListener('storage',(event) => {
    if(!event.storageArea) return
    storageCallBackMap.get(event.storageArea)?.forEach((item)=>{
      item.activeStorageEventCB(event)
    })
  })
}