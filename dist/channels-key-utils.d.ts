export declare function gerenerateKey(): Promise<CryptoKeyPair>;
export declare function digest(publicKey: CryptoKey): Promise<string>;
export declare function sign(value: any, privateKey: CryptoKey): Promise<string>;
export declare function verify(value: any, signature: string, publicKey: CryptoKey): Promise<boolean>;
export declare function exportKey(key: CryptoKey): Promise<JsonWebKey>;
export declare function importKey(data: JsonWebKey, privateKey: boolean): Promise<CryptoKey>;
