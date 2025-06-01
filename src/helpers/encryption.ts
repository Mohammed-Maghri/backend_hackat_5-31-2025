import CryptoJS from "crypto-js";

interface encrypte_data {
  message: string;
  key: string;
}

export const encrypte_token = ({ message, key }: encrypte_data) => {
  const dataEncrypted = CryptoJS.AES.encrypt(message, key);
  return dataEncrypted.toString();
};

export const decrypt_token = ({ message, key }: encrypte_data) => {
  const decrypted_data = CryptoJS.AES.decrypt(message, key);
  return decrypted_data.toString(CryptoJS.enc.Utf8);
};
