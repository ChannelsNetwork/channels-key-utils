import { TextEncoder } from 'text-encoding-shim';

const _crypto = self.crypto || (self as any).msCrypto;
const subtle = _crypto.subtle;

function _toBase64(buffer: Uint8Array): string {
  const out = Array.prototype.map.call(buffer, (ch: number) => {
    return String.fromCharCode(ch)
  }).join('');
  return btoa(out);
}

function _fromBase64(data: string): Uint8Array {
  var binstr = atob(data);
  var buf = new Uint8Array(binstr.length);
  Array.prototype.forEach.call(binstr, function (ch: string, i: number) {
    buf[i] = ch.charCodeAt(0);
  });
  return buf;
}

export async function gerenerateKey(): Promise<CryptoKeyPair> {
  return (await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair;
}

export async function sign(value: any, privateKey: CryptoKey): Promise<string> {
  const text = (typeof value === 'string') ? value : JSON.stringify(value);
  const array = new TextEncoder('utf-8').encode(text);
  const signedBuffer = new Uint8Array(await subtle.sign({ name: 'ECDSA', hash: { name: "SHA-256" } }, privateKey, array));
  return _toBase64(signedBuffer);
}

export async function verify(value: any, signature: string, publicKey: CryptoKey): Promise<boolean> {
  const text = (typeof value === 'string') ? value : JSON.stringify(value);
  const textArray = new TextEncoder('utf-8').encode(text);
  const signatureBuffer = _fromBase64(signature);
  return await subtle.verify({ name: 'ECDSA', hash: { name: "SHA-256" } }, publicKey, signatureBuffer, textArray)
}

export async function exportKey(key: CryptoKey): Promise<JsonWebKey> {
  return await subtle.exportKey('jwk', key);
}

export async function importKey(data: JsonWebKey, privateKey: boolean): Promise<CryptoKey> {
  return await subtle.importKey('jwk', data, { name: 'ECDSA', namedCurve: 'P-256' }, true, privateKey ? ['sign'] : ['verify']);
}