import React, { useContext, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button } from "@rneui/base";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { useCameraDevice, useCameraPermission, Camera } from "react-native-vision-camera";
import FastImage from "react-native-fast-image";
import { launchImageLibrary } from "react-native-image-picker";
import CryptoJS from 'react-native-crypto-js';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AppContext } from "../../../../../App";

const EditPassport = ({ theme, navigation, route }) => {

  const { loadUserdata } = useContext(AppContext);

  const { passportData } = route.params;
  const [isCameraActive, setCameraActive] = useState(false);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [isTakingPhotoFromCamera, setTakingPhotoFromCamera] = useState(false);
  const [isTakingPhotoFromCameraLibrary, setTakingPhotoFromCameraLibrary] = useState(false);

  const [passportPhoto, setPassportPhoto] = useState("");
  const passportRegexPattern = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      requestPermission().then();
    }
    setPassportPhoto("");
    setCameraActive(true);
  };

  const handleTakePhotoBtn = async () => {
    setTakingPhotoFromCamera(true);
    const photo = await camera.current.takePhoto({
      flash: "auto", enableShutterSound: "false", enableAutoRedEyeReduction: true,
    });
    setPassportPhoto("file://" + photo.path);
    setCameraActive(false); // Останавливаем камеру
    setTakingPhotoFromCamera(false);
  };

  const handleTakePhotoFromLibraryBtn = async () => {
    setTakingPhotoFromCameraLibrary(true);
    try {
      const options = {
        title: "Выберите изображение",
        cancelButtonTitle: "Отмена",
        takePhotoButtonTitle: "Выбрать изображение",
        quality: 1,
        mediaType: "photo",
        storageOptions: {
          skipBackup: true, path: "images",
        },
        selectionLimit: 1,
      };
      const selectedImage = await launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("Пользователь отменил съемку фотографии");
        } else if (response.error) {
          console.log("Ошибка съемки фотографии:", response.error);
        }
      });
      if (selectedImage && selectedImage.assets[0]) {
        setPassportPhoto(selectedImage.assets[0].uri);
        setCameraActive(false);
      }
    } catch (e) {
      console.log(e);
    }
    setTakingPhotoFromCameraLibrary(false);
  };

  const verifyPassport = async (passportImageUri) => {
    let newPassportData;
    const result = await TextRecognition.recognize(passportImageUri);
    const textArr = result.text.split("\n");
    const finalArray = [];
    for (let i = 0; i < textArr.length; i++) {
      const words = textArr[i].split(" ");
      finalArray.push(...words);
    }
    for (let i = 0; i < finalArray.length; i++) {
      const element = finalArray[i];
      if (passportRegexPattern.test(element.trim())) {
        newPassportData = element;
      }
    }
    if (newPassportData) {
      await uploadPassportImage(newPassportData);
      ToastAndroid.show("Паспорт успешно подтвержден", 7000);
      loadUserdata();
      navigation.navigate("Profile");
    } else {
      setPassportPhoto("");
      setCameraActive(true);
      ToastAndroid.show("Не удалось просканировать пасспорт, повторите попытку", 7000);
    }
  };

  const uploadPassportImage = async (newPassportData) => {
    try {
      const secretKey = '2024roccarentbyvshevtsov2024'; // 32-байтовый ключ
      const ciphertext = CryptoJS.AES.encrypt(newPassportData.toString(), secretKey).toString();
      const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get();
      if (snapshot.exists) {
        await firestore().collection("users").doc(auth().currentUser.uid).update({
          passportData: ciphertext,
        });
      } else {
        await firestore().collection("users").doc(auth().currentUser.uid).set({
          passportData: ciphertext,
        });
      }
      loadUserdata();
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const handleVerifyAndUploadPassport = async () => {
    setLoadingPhoto(true);
    await verifyPassport(passportPhoto);
    setLoadingPhoto(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1, backgroundColor: theme.colors.background,
    }, editNameContainer: {
      width: "100%",
      height: "auto",
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    }, header: {
      height: 60,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }, headerBackBtn: {
      justifyContent: "center",
    }, headerBackBtnText: {
      fontFamily: "Roboto-Regular", fontSize: 16, color: theme.colors.accentText, alignSelf: "center",
    }, infoText: {
      width: "100%", fontFamily: "Roboto-Regular", fontSize: 14, color: theme.colors.grey1,
    }, submitBtnContainer: {
      borderRadius: 5, marginHorizontal: wp(2),
    }, submitBtn: {
      width: "100%", height: 48, backgroundColor: theme.colors.accent,
    },
  });

  return (<SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={{ paddingBottom: hp(1) }}>
        <View style={styles.editNameContainer}>
          <View style={styles.header}>
            <Text
              style={{
                fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.accentText, alignSelf: "center",
              }}>Подтверждение
              Паспорта</Text>
            <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.headerBackBtnText}>Назад</Text>
            </TouchableOpacity>
          </View>
          {passportData ? (<View style={{
              width: "100%",
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}>
              <Text numberOfLines={1} style={{ fontFamily: "Roboto-Black", fontSize: 18, color: theme.colors.text, alignSelf: 'center' }}>
                Ваш Паспорт подтвержден
              </Text>
              <Text numberOfLines={1} style={{
                fontFamily: "Roboto-Black",
                fontSize: 32,
                color: theme.colors.text,
                alignSelf: "center",
                marginTop: 12,
              }}>
                {passportData}
              </Text>
              <FastImage style={{ width: wp(50), height: wp(50), alignSelf: "center", marginTop: hp(1) }}
                         source={require("../../../../assets/images/passport.png")}
                         resizeMode={FastImage.resizeMode.contain} />
            </View>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
                <Text style={styles.infoText}>
                  Для подтверждения паспорта, пожалуйста, загрузите фотографию 33 стр. паспорта ниже.
                  Мы гарантируем конфиденциальность ваших данных и обеспечиваем их безопасность.
                </Text>
                <Text style={styles.infoText}>
                  Пожалуйста, убедитесь, что фотография является четкой и полностью воспроизводит информацию в
                  паспорте.
                </Text>
              </View>
              {((isCameraActive && hasPermission) || passportPhoto) && <View style={{
                width: wp(90),
                height: hp(30),
                borderWidth: 1,
                borderColor: theme.colors.accent,
                alignSelf: "center",
                marginBottom: 12,
              }}>
                {passportPhoto && !isCameraActive ? (
                  <FastImage style={{ width: "100%", height: "100%" }} resizeMode={FastImage.resizeMode.cover}
                             source={{ uri: passportPhoto }} />) : (
                  <Camera style={{ width: "100%", height: "100%" }} device={device} isActive={isCameraActive}
                          photo={true}
                          ref={camera} />)}
              </View>}
              <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                      titleStyle={{ color: theme.colors.grey1 }} loading={isTakingPhotoFromCamera}
                      loadingStyle={styles.submitBtn}
                      onPress={isCameraActive ? handleTakePhotoBtn : handleOpenCamera}
                      disabled={isTakingPhotoFromCameraLibrary || loadingPhoto}><Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  color: loadingPhoto || isTakingPhotoFromCameraLibrary ? theme.colors.greyOutline : theme.colors.accentText,
                }}>{isCameraActive ? ("Сделать снимок") : ("Открыть камеру")}</Text></Button>
              <Button containerStyle={[styles.submitBtnContainer, { marginTop: 12 }]} buttonStyle={styles.submitBtn}
                      titleStyle={{ color: theme.colors.grey1 }} loading={isTakingPhotoFromCameraLibrary}
                      loadingStyle={styles.submitBtn}
                      onPress={handleTakePhotoFromLibraryBtn} disabled={isTakingPhotoFromCamera || loadingPhoto}><Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  color: loadingPhoto || isTakingPhotoFromCamera ? theme.colors.greyOutline : theme.colors.accentText,
                }}>Выбрать из
                галереи</Text></Button>
              <Button containerStyle={[styles.submitBtnContainer, { marginTop: 12 }]} buttonStyle={styles.submitBtn}
                      titleStyle={{ color: theme.colors.grey1 }} loading={passportPhoto && loadingPhoto}
                      loadingStyle={styles.submitBtn}
                      onPress={handleVerifyAndUploadPassport}
                      disabled={!passportPhoto || isTakingPhotoFromCamera || isTakingPhotoFromCameraLibrary}><Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  color: !passportPhoto || isTakingPhotoFromCamera || isTakingPhotoFromCameraLibrary ? theme.colors.greyOutline : theme.colors.accentText,
                }}>Отправить на
                проверку</Text></Button>
            </View>)}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>);
};

export default EditPassport;
