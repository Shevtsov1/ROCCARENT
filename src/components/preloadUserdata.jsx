import React from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import CryptoJS from "react-native-crypto-js";

export  const getNickname = async () => {
    const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get();
      if (snapshot.exists && snapshot.data().nickname) {
        return snapshot.data().nickname;
      } else {
        return "";
      }
  };

export  const getPassportData = async () => {
  const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get()
      if (snapshot.exists && snapshot.data().passportData) {
        let decryptedData;
        const localPassportData = snapshot.data().passportData;
        const secretKey = '2024roccarentbyvshevtsov2024'; // 32-байтовый ключ
        const bytes = CryptoJS.AES.decrypt(localPassportData, secretKey);
        decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        const visibleText = decryptedData.slice(0, 3);
        const hiddenText = decryptedData.slice(3, -1).replace(/./g, "*");
        const lastVisibleChar = decryptedData.slice(-1);
        return (visibleText + hiddenText + lastVisibleChar);
      } else {
        return "";
      }
  };

export  const getPhoneNumber = async () => {
    const loadedPhoneNumber = auth().currentUser.phoneNumber;
    if (loadedPhoneNumber) {
      return loadedPhoneNumber;
    } else {
      return "";
    }
  };

export const getUserListings = async () => {
  const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get();
  if (snapshot.exists && snapshot.data().listings) {
    return snapshot.data().listings;
  }
}
