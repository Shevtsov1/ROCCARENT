import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button } from "@rneui/base";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { useCameraDevice, useCameraPermission, Camera } from "react-native-vision-camera";
import FastImage from "react-native-fast-image";

const EditPassport = ({ theme, navigation }) => {

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [passportPhoto, setPassportPhoto] = useState("");
  const [passportData, setPassportData] = useState("");
  const [passportVerified, setPassportVerified] = useState(false);
  const passportRegexPattern = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then();
    }
  }, []);


  const verifyPassport = async (passportImage) => {
    const result = await TextRecognition.recognize(passportImage.assets[0].uri);
    const textArr = result.text.split("\n");
    const finalArray = [];
    for (let i = 0; i < textArr.length; i++) {
      const words = textArr[i].split(" ");
      finalArray.push(...words);
    }
    for (let i = 0; i < finalArray.length; i++) {
      const element = finalArray[i];
      if (passportRegexPattern.test(element)) {
        setPassportData(element);
        setPassportVerified(true);
        console.log("Passport data found:", element);
      }
    }
    if (!passportVerified) console.log("Не удалось просканировать пасспорт, повторите попытку");
  };

  const handleVerifyPassport = async () => {
    setLoadingPhoto(true);
    await verifyPassport(passportPhoto);
    setLoadingPhoto(false);
  }

  const handleTakePhotoBtn = async () => {
    setLoadingPhoto(true);
    const photo = await camera.current.takePhoto({
      flash: "auto",
      enableShutterSound: "false",
      enableAutoRedEyeReduction: true,
    });
    setPassportPhoto(photo.path);
    setLoadingPhoto(false);
  };

  const handleSubmitBtn = () => {
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, editNameContainer: {
      width: "100%",
      height: "auto",
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    }, header: {
      height: 36,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }, headerBackBtn: {
      justifyContent: "center",
    }, headerBackBtnText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, infoText: {
      width: "100%",
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey1,
    }, inputComponentContainer: {
      height: 72,
      alignSelf: "center",
      marginBottom: 12,
    }, inputContainer: {
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: 5,
    }, inputTextStyle: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
    }, submitBtnContainer: {
      borderRadius: 5,
      marginHorizontal: wp(2),
    }, submitBtn: {
      width: "100%",
      height: 48,
      backgroundColor: theme.colors.accent,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingBottom: hp(1) }}>
          <View style={styles.editNameContainer}>
            <View style={styles.header}>
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 18,
                  color: theme.colors.accentText,
                  alignSelf: "center",
                }}>Подтверждение
                Паспорта</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
              <Text style={styles.infoText}>
                Для подтверждения паспорта, пожалуйста, загрузите фотографию паспорта ниже.
                Мы гарантируем конфиденциальность ваших данных и обеспечиваем их безопасность.
              </Text>
              <Text style={styles.infoText}>
                Пожалуйста, убедитесь, что фотография является четкой и полностью воспроизводит информацию в паспорте.
              </Text>
            </View>
            {hasPermission &&
              <View style={{
                width: wp(90),
                height: hp(30),
                borderWidth: 1,
                borderColor: theme.colors.accent,
                alignSelf: "center",
                marginBottom: 12,
              }}>
                {passportPhoto ? (
                  <FastImage style={{ width: "100%", height: "100%" }} resizeMode={FastImage.resizeMode.cover}
                             source={{ uri: "file://" + passportPhoto }} />) : (
                  <Camera style={{ width: "100%", height: "100%" }} device={device} isActive={true} photo={true}
                          ref={camera} />)}
              </View>}
            <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                    titleStyle={{ color: theme.colors.grey1 }} loading={loadingPhoto} loadingStyle={styles.submitBtn}
                    onPress={passportPhoto ? handleVerifyPassport : handleTakePhotoBtn}>{passportPhoto ?
              <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.accentText }}>
                Отправить на проверку
              </Text> : <Text
                style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.accentText }}>Сделать
                снимок</Text>}</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPassport;
