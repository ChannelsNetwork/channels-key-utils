(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "text-encoding-shim"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const text_encoding_shim_1 = require("text-encoding-shim");
    const _crypto = self.crypto || self.msCrypto;
    const subtle = _crypto.subtle;
    function _toBase64(buffer) {
        const out = Array.prototype.map.call(buffer, (ch) => {
            return String.fromCharCode(ch);
        }).join('');
        return btoa(out);
    }
    function _fromBase64(data) {
        const binstr = atob(data);
        const buf = new Uint8Array(binstr.length);
        Array.prototype.forEach.call(binstr, function (ch, i) {
            buf[i] = ch.charCodeAt(0);
        });
        return buf;
    }
    async function gerenerateKey() {
        return (await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']));
    }
    exports.gerenerateKey = gerenerateKey;
    async function digest(publicKey) {
        const buffer = await subtle.exportKey('raw', publicKey);
        const digest = await subtle.digest('SHA-256', buffer);
        return _toBase64(new Uint8Array(digest));
    }
    exports.digest = digest;
    async function sign(value, privateKey) {
        const text = (typeof value === 'string') ? value : JSON.stringify(value);
        const array = new text_encoding_shim_1.TextEncoder('utf-8').encode(text);
        const signedBuffer = new Uint8Array(await subtle.sign({ name: 'ECDSA', hash: { name: 'SHA-256' } }, privateKey, array));
        return _toBase64(signedBuffer);
    }
    exports.sign = sign;
    async function verify(value, signature, publicKey) {
        const text = (typeof value === 'string') ? value : JSON.stringify(value);
        const textArray = new text_encoding_shim_1.TextEncoder('utf-8').encode(text);
        const signatureBuffer = _fromBase64(signature);
        return await subtle.verify({ name: 'ECDSA', hash: { name: 'SHA-256' } }, publicKey, signatureBuffer, textArray);
    }
    exports.verify = verify;
    async function exportKey(key) {
        return await subtle.exportKey('jwk', key);
    }
    exports.exportKey = exportKey;
    async function importKey(data, privateKey) {
        return await subtle.importKey('jwk', data, { name: 'ECDSA', namedCurve: 'P-256' }, true, privateKey ? ['sign'] : ['verify']);
    }
    exports.importKey = importKey;
});
