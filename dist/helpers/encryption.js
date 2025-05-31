import CryptoJS from "crypto-js";
export const encrypte_token = ({ message, key }) => {
    const dataEncrypted = CryptoJS.AES.encrypt(message, key);
    return dataEncrypted.toString();
};
export const decrypt_token = ({ message, key }) => {
    const decrypted_data = CryptoJS.AES.decrypt(message, key);
    return decrypted_data.toString(CryptoJS.enc.Utf8);
};
