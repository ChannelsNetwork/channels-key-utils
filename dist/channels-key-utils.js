import { TextEncoder } from 'text-encoding-shim';
const _crypto = self.crypto || self.msCrypto;
const subtle = _crypto.subtle;
function _toBase64(buffer) {
    const out = Array.prototype.map.call(buffer, (ch) => {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(out);
}
function _fromBase64(data) {
    var binstr = atob(data);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        buf[i] = ch.charCodeAt(0);
    });
    return buf;
}
export async function gerenerateKey() {
    return (await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']));
}
export async function sign(value, privateKey) {
    const text = (typeof value === 'string') ? value : JSON.stringify(value);
    const array = new TextEncoder('utf-8').encode(text);
    const signedBuffer = new Uint8Array(await subtle.sign({ name: 'ECDSA', hash: { name: "SHA-256" } }, privateKey, array));
    return _toBase64(signedBuffer);
}
export async function verify(value, signature, publicKey) {
    const text = (typeof value === 'string') ? value : JSON.stringify(value);
    const textArray = new TextEncoder('utf-8').encode(text);
    const signatureBuffer = _fromBase64(signature);
    return await subtle.verify({ name: 'ECDSA', hash: { name: "SHA-256" } }, publicKey, signatureBuffer, textArray);
}
