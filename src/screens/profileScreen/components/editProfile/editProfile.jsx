import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import { Avatar, Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button, color } from "@rneui/base";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import TextRecognition, { TextRecognitionScript } from "@react-native-ml-kit/text-recognition";

const EditProfile = ({ theme, navigation, passportData, setPassportData }) => {

  const [passportVerified, setPassportVerified] = useState(false);
  const passportRegexPattern = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;
  const AvatarBackground = getRandomColor();

  const handleLaunchCamera = async () => {
    const photo = await launchCamera({
      mediaType: "photo",
      allowsEditing: false,
      aspectRatio: "square",
      quality: 1,
    });
    const result = await TextRecognition.recognize(photo.assets[0].uri, TextRecognitionScript.LATIN);
    const resultLength = result.blocks.length;
    setPassportData(result.blocks[resultLength - 1].text);
    console.log(result.blocks.pop().text);
  };

  const handleLaunchCameraLibrary = async () => {
    const passportImage = await launchImageLibrary({
      mediaType: "photo",
      allowsEditing: false,
      aspectRatio: "square",
      quality: 1,
      selectionLimit: 1,
      includeBase64: true,
    });
    await verifyPassport(passportImage);
  };

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

  function getRandomColor() {
    const colors = ["red", "green", "blue", "orange", "purple"]; // Add more colors if needed
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
    }, editAvatarAndNameContainer: {
      width: "100%",
      height: 120,
      backgroundColor: theme.colors.background,
      padding: 12,
      marginBottom: 12,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    }, header: {
      height: 24,
      flexDirection: "row",
      justifyContent: "space-between",
    }, headerBackBtn: {
      justifyContent: "center",
    }, headerBackBtnText: {
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.colors.text,
      alignSelf: "center",
    }, editImageContainer: {
      width: "100%",
      height: 192,
      borderRadius: 15,
    }, editImageShadowContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    }, editCard: {
      width: "100%",
      height: "100%",
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.background,
    }, editImageCardText: {
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.colors.text,
    }, uploadImageBtn: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 15,
    }, editPhoneNumberContainer: {
      width: "100%",
      height: 162,
      borderRadius: 15,
    }, editEmailContainer: {
      width: "100%",
      height: 240,
      borderRadius: 15,
    }, editPassportContainer: {
      width: "100%",
      height: 240,
      borderRadius: 15,
    }, confirmBtnContainer: {
      width: "98%",
      height: 48,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    }, confirmBtn: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.accent,
    }, confirmBtnText: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      color: theme.colors.accentText,
    }, personalDataViewContainer: {
      flexDirection: "row",
    }, personalDataFieldName: {
      borderWidth: 1, borderColor: "red",
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingBottom: hp(1) }}>
          <ShadowedView style={[styles.editAvatarAndNameContainer, shadowStyle({
            color: theme.colors.grey3,
            opacity: 1,
            radius: 4,
            offset: [0, 0],
          })]}>
            <View style={styles.header}>
              <Text style={{ fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.text, alignSelf: "center" }}>Мои
                данные</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <Button containerStyle={{
              flex: 2,
              width: '100%',
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 15,
            }} buttonStyle={{  width: '100%', borderRadius: 15, justifyContent: 'flex-start', backgroundColor: 'transparent' }} titleStyle={{color: theme.colors.grey1}} >
              <Avatar
                size={"medium"}
                rounded
                title={auth().currentUser.email.substring(0, 2).toUpperCase()}
                source={!auth().currentUser.email ? require('../../../../assets/images/telephone.png') : null}
                containerStyle={{ backgroundColor: auth().currentUser.email && AvatarBackground, marginEnd: 12}}
              />
              <View style={{flex: 1}}>
                <Text style={{fontFamily: 'Roboto-Regular', color: theme.colors.text, opacity: 0.8}}>Имя Фамилия</Text>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, color: theme.colors.text}}>{auth().currentUser.displayName}</Text>
                <TouchableOpacity style={{position: 'absolute', top: '20%', right: 0}}><Icon type='ionicon' name='chevron-forward-outline' size={18} color={theme.colors.text}/></TouchableOpacity>
              </View>
            </Button>
          </ShadowedView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

// <View style={{paddingBottom: hp(1)}}>
//   <View style={styles.editAvatarAndNameContainer}>
//     <ShadowedView style={[shadowStyle({
//       color: theme.colors.grey3,
//       opacity: 1,
//       radius: 4,
//       offset: [0, 0],
//     }), styles.editImageShadowContainer]}>
//       <View style={styles.editCard}>
//         <View style={styles.header}>
//           <Text style={{ fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.text, alignSelf: "center" }}>Мои
//             данные</Text>
//           <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
//             <Text style={styles.headerBackBtnText}>Назад</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{
//           flex: 2,
//           flexDirection: "row",
//           alignItems: "flex-end",
//           justifyContent: "space-between",
//           paddingHorizontal: wp(10),
//           marginBottom: 6,
//         }}>
//           <Avatar
//             size={"medium"}
//             rounded
//             title={auth().currentUser.email.substring(0, 2).toUpperCase()}
//             containerStyle={{ backgroundColor: "blue" }}
//           />
//         </View>
//       </View>
//     </ShadowedView>
//   </View>
//   <View style={styles.editImageContainer}>
//     <ShadowedView style={[shadowStyle({
//       color: theme.colors.grey3,
//       opacity: 1,
//       radius: 4,
//       offset: [0, 0],
//     }), styles.editImageShadowContainer]}>
//       <View style={styles.editCard}>
//         <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "space-between" }}>
//           <Text style={styles.editImageCardText}>Фото профиля</Text>
//           <TouchableOpacity>
//             <Text style={styles.editImageCardText}>Сохранить</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{
//           flex: 2,
//           flexDirection: "row",
//           alignItems: "flex-end",
//           justifyContent: "space-between",
//           paddingHorizontal: wp(10),
//           marginBottom: 6,
//         }}>
//           <Avatar
//             size={"large"}
//             title={auth().currentUser.email.substring(0, 2).toUpperCase()}
//             containerStyle={{ backgroundColor: "blue" }}
//
//           />
//           <Avatar
//             size={"medium"}
//             rounded
//             title={auth().currentUser.email.substring(0, 2).toUpperCase()}
//             containerStyle={{ backgroundColor: "blue" }}
//           />
//           <Avatar
//             size={"small"}
//             rounded
//             title={auth().currentUser.email.substring(0, 2).toUpperCase()}
//             containerStyle={{ backgroundColor: "blue" }}
//           />
//         </View>
//         <Button containerStyle={{ justifyContent: "flex-end", borderRadius: 15 }}
//                 buttonStyle={styles.uploadImageBtn} titleStyle={{ color: theme.colors.grey1 }}>
//           <Text style={styles.editImageCardText}>Загрузите ваше фото</Text>
//         </Button>
//       </View>
//     </ShadowedView>
//   </View>
//   <View style={styles.editEmailContainer}>
//     <ShadowedView style={[shadowStyle({
//       color: theme.colors.grey3,
//       opacity: 1,
//       radius: 4,
//       offset: [0, 0],
//     }), styles.editImageShadowContainer]}>
//       <View style={styles.editCard}>
//         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//           <Text style={styles.editImageCardText}>Email</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Input />
//           <Input />
//           <Input />
//         </View>
//       </View>
//     </ShadowedView>
//   </View>
//   <View style={styles.editPassportContainer}>
//     <ShadowedView style={[shadowStyle({
//       color: theme.colors.grey3,
//       opacity: 1,
//       radius: 4,
//       offset: [0, 0],
//     }), styles.editImageShadowContainer]}>
//       <View style={styles.editCard}>
//         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//           <Text style={styles.editImageCardText}>Пасспортные данные</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Button title={"camera"} onPress={handleLaunchCamera} />
//           <Button title={"gallery"} onPress={handleLaunchCameraLibrary} />
//         </View>
//       </View>
//     </ShadowedView>
//   </View>
//   <Text>{passportData}</Text>
//   <Button containerStyle={styles.confirmBtnContainer} buttonStyle={styles.confirmBtn}
//           titleStyle={{ color: theme.colors.grey1 }}>
//     <Text style={styles.confirmBtnText}>Сохранить изменения</Text>
//   </Button>
// </View>
