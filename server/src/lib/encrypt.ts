import { Buffer } from 'node:buffer';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';

const key = process.env.ENCRYPTION_KEY??"";
const iv = process.env.ENCRYPTION_IV??"";

export const encrypt = (text:string)=>{
  let cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex')
}

export const decrypt = (text:string)=>{
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}



// Now transmit { ciphertext, nonce, tag }.

// const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
//   authTagLength: 16,
// });
// decipher.setAuthTag(tag);
// decipher.setAAD(aad, {
//   plaintextLength: ciphertext.length,
// });
// const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

// try {
//   decipher.final();
// } catch (err) {
//   throw new Error('Authentication failed!');
// }

// console.log(receivedPlaintext);