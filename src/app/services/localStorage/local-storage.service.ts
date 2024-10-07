import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  ignoreClear = [
'user-theme'
  ];

  ignoreEncryption = [
   'user-theme'
  ];

  constantIV = enc.Hex.parse('D7CA482B19C2EA1ADF4127B028C77A9E');
  keys: string[] = [
    'c729e96179ee4d453f5c9b6d00c31da7',
    '3b228aec589d6b75563ac79442f80379'
  ];


  /**
   * The function `setItem` stores a key-value pair in localStorage, optionally encrypting the value
   * based on the environment.
   * @param {string} key - The `key` parameter in the `setItem` function is a string that represents the
   * key under which the value will be stored in the localStorage.
   * @param {unknown} value - The `value` parameter in the `setItem` function is the data that you want
   * to store in the browser's localStorage. It can be of any type, as it is of type `unknown` in the
   * function signature. Before storing the value, it is stringified using `JSON.stringify`
   * @returns If the key is included in the `ignoreEncryption` array, the value will be stored directly
   * in localStorage without encryption, and then the function will return. If the key is not in the
   * `ignoreEncryption` array and the environment is not in development mode, the value will be encrypted
   * using AES encryption and stored in localStorage with the encrypted key, and then the function will
   * return.
   */
  setItem(key: string, value: unknown) {
    try {
      const stringifiedValue = JSON.stringify(value);

      if (this.ignoreEncryption.includes(key)) {
        localStorage.setItem(key, stringifiedValue);
        return;
      }

      if (!environment.isItDev) {
        const encryptedKey = this.encryptKey(key);
        const encryptedValue = AES.encrypt(
          stringifiedValue,
          this.keys[0]
        ).toString();
        localStorage.setItem(encryptedKey, encryptedValue);
      } else {
        localStorage.setItem(key, stringifiedValue);
      }
    } catch {
      //
    }
  }

  /**
   * The function `getItem` retrieves and decrypts a stored value from localStorage, handling encryption
   * and error cases gracefully.
   * @param {string} key - The `getItem` function you provided is used to retrieve an item from
   * localStorage, with optional encryption for certain keys. The function first checks if the key is
   * included in the `ignoreEncryption` array. If it is, the value is retrieved directly from
   * localStorage without encryption.
   * @returns The `getItem` function returns the value associated with the provided key after decrypting
   * it if necessary. If the key is found in the `ignoreEncryption` list, it directly retrieves the value
   * from `localStorage`. If the key is not in the `ignoreEncryption` list and the environment is not in
   * development mode, it decrypts the value using AES encryption before returning it. If decryption
   * fails at any
   */
  getItem(key: string) {
    try {
      if (this.ignoreEncryption.includes(key)) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }

      if (!environment.isItDev) {
        const encryptedKey = this.encryptKey(key);
        const encryptedValue = localStorage.getItem(encryptedKey);

        if (!encryptedValue) {
          return null;
        }

        try {
          const decryptedValue = AES.decrypt(
            encryptedValue,
            this.keys[0]
          ).toString(enc.Utf8);
          return JSON.parse(decryptedValue);
        } catch (error) {
          return null;
        }
      }

      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }


    /**
   * The encryptKey function encrypts a given key using AES encryption with a specific initialization
   * vector.
   * @param {string} key - The `encryptKey` function takes a `key` parameter as a string and encrypts it
   * using the AES encryption algorithm with a specific key and initialization vector (IV).
   * @returns The `encryptKey` function is returning an encrypted version of the input `key` string using
   * the AES encryption algorithm. The key is first formatted as UTF-8, then encrypted using AES with a
   * specific initialization vector (IV) and a constant key. The encrypted result is then converted to a
   * string and returned.
   */
    encryptKey(key: string) {
      const formattedKey = enc.Utf8.parse(key);
  
      return AES.encrypt(formattedKey, enc.Utf8.parse(this.keys[1]), {
        iv: this.constantIV
      }).toString();
    }
}
