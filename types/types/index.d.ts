export type EYStorageConfig = {
    storageType?: EYStorageTypeOptions;
    prefix?: string;
    expire?: number;
    isEncrypt?: boolean;
    isRenewal?: boolean;
};
export type instanceConfig = {
    storageType: EYStorageTypeOptions;
    prefix: string;
    expire: number;
    isEncrypt: boolean;
    isRenewal: boolean;
};
export declare enum EYStorageTypeOptions {
    LOCALSTORAGE = "localStorage",
    SESSIONSTORAGE = "sessionStorage"
}
