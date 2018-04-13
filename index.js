const Buffer = require('safe-buffer').Buffer;
const secp256k1 = require('secp256k1');
const ethereumUtils = require('ethereumjs-util');
const KeyEncoder = require('key-encoder');
const jwa = require('jwa');

function randomBytes(size) {
  const rawBytes = new Uint8Array(size);
  const crypto = self.crypto || self.msCrypto;
  if (!crypto) {
    throw 'Crypto not supported.';
  }
  crypto.getRandomValues(rawBytes);
  return Buffer.from(rawBytes.buffer);
}

function generatePrivateKey() {
  let buffer;
  do {
    buffer = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(buffer));
  return new Uint8Array(buffer);
}

export function generateKey(privateKeyBase64) {
  let privateKey;
  if (privateKeyBase64) {
    privateKey = new Buffer(privateKeyBase64, 'base64');
  } else {
    privateKey = new Buffer(generatePrivateKey());
  }
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const ethPublic = ethereumUtils.importPublic(new Buffer(publicKey));
  const address = ethereumUtils.pubToAddress(ethPublic, false);
  const keyEncoder = new KeyEncoder('secp256k1');
  const privateKeyPem = keyEncoder.encodePrivate(privateKey.toString('hex'), 'raw', 'pem');
  const publicKeyPem = keyEncoder.encodePublic(new Buffer(publicKey).toString('hex'), 'raw', 'pem');
  return {
    privateKey: privateKey.toString('base64'),
    privateKeyPem: privateKeyPem,
    publicKey: (new Buffer(publicKey).toString('base64')),
    publicKeyPem: publicKeyPem,
    ethPublic: (new Buffer(ethPublic).toString('base64')),
    address: (new Buffer(address).toString('base64')),
    ethAddress: '0x' + new Buffer(address).toString('hex')
  };
}

export function sign(value, privateKeyPem) {
  const rs256 = jwa('RS256');
  return rs256.sign(value, privateKeyPem);
}

export function verify(value, publicKeyPem, signature) {
  const rs256 = jwa('RS256');
  return rs256.verify(value, signature, publicKeyPem);
}