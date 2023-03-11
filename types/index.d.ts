import { EYStorageConfig } from "./types";
declare type decryptFun = (data: string) => string;
declare function registerEncrypt(encrypt: decryptFun, decrypt: decryptFun): number;
declare function selectEncryptWay(id: number): void;
declare type changeCallBack = (event: {
    key: string;
    newValue: any;
    oldValue: any;
}) => void;
declare type storageCallBack = (event: {
    key: string;
    newValue: any;
    oldValue: any;
    url: string;
    storageArea: Storage;
}) => void;
export default class EYStorage {
    private config;
    private changeCallBackArr;
    private storageCallBackArr;
    onchange: changeCallBack | undefined;
    onstorage: storageCallBack | undefined;
    constructor(config?: EYStorageConfig);
    removeItem(key: string): void;
    getAllKeys(): Array<string>;
    clear(): void;
    setItem(key: string, value: any, expire?: number): void;
    getItem(key: string): any;
    isSupported(): boolean;
    activeStorageEventCB(event: any): void;
    addEventListener(event: 'change', cb: changeCallBack): any;
    addEventListener(event: 'storage', cb: storageCallBack): any;
    static config: EYStorageConfig;
    static getCurrentTimeStamp: () => number;
    static selectEncryptWay: typeof selectEncryptWay;
    static registerEncrypt: typeof registerEncrypt;
}
export {};
