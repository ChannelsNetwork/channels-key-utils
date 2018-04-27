export declare function gerenerateKey(): Promise<CryptoKeyPair>;
export declare function sign(value: any, privateKey: CryptoKey): Promise<string>;
export declare function verify(value: any, signature: string, publicKey: CryptoKey): Promise<boolean>;
