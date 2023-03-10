/**
 * type: 使用的类型 默认值为 localStorage
 * 
 * prefix: 存储的前缀 默认值为 ''
 * 
 * expire：持续时间，单位ms 默认值为 1天
 * 
 * isEncrypt: 是否使用加密 默认值为true
 * 
 * isRenewal: 是否续期 默认值为true，逻辑是：刷新插入时间，并且保存原本的持续时间
 */
export type EYStorageConfig = {
  storageType?: EYStorageTypeOptions
  prefix?: string
  expire?: number
  isEncrypt?: boolean
  isRenewal?: boolean
}

export type instanceConfig = {storageType: EYStorageTypeOptions,prefix: string,expire: number,isEncrypt: boolean,isRenewal: boolean}

export enum EYStorageTypeOptions {
  LOCALSTORAGE = 'localStorage',
  SESSIONSTORAGE = 'sessionStorage'
}
