import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import { Avatar, Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button, color } from "@rneui/base";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition, { TextRecognitionScript } from "@react-native-ml-kit/text-recognition";
import DocumentScanner from 'react-native-document-scanner-plugin'

const EditProfile = ({ theme, navigation }) => {

  const [passportData, setPassportData] = useState('');
  const passportRegexPattern = /^[0-9]{7}[A-Z][0-9]{3}[A-Z]{2}[0-9]$/;

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({croppedImageQuality: 100, maxNumDocuments: 1})

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      console.log(scannedImages);
      // set the img src, so we can view the first scanned image
      const result = await TextRecognition.recognize(scannedImages[0])
      console.log(result.blocks)
      const matchingBlock = result.blocks.find(block => block.text.includes('HYMAP'));
      if (matchingBlock) {
        const textArr = matchingBlock.text.split('\n');
        for (const word of textArr) {
          if (word.match(passportRegexPattern)){
            setPassportData(word);
            break;
          }
        }
      } else {
        // No matching block was found
        console.log('No matching block found');
      }
    }
  }

  const handleLaunchCamera = async () => {
    const photo = await launchCamera({
      mediaType: 'photo',
      allowsEditing: false,
      aspectRatio: 'square',
      quality: 1,
    });
    const result = await TextRecognition.recognize(photo.assets[0].uri, TextRecognitionScript.LATIN);
    const resultLength = result.blocks.length;
    setPassportData(result.blocks[resultLength-1].text);
    console.log(result.blocks.pop().text);
  }

  const handleLaunchCameraLibrary = async () => {
    const photo = await launchImageLibrary({
      mediaType: 'photo',
      allowsEditing: false,
      aspectRatio: 'square',
      quality: 1,
      selectionLimit: 1,
      includeBase64: true
    });
    const result = await TextRecognition.recognize(photo.assets[0].uri);
    const resultLength = result.blocks.length;
    setPassportData(result.text);
    console.log(result.blocks.pop().text);
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: wp(2),
    }, header: {
      height: 48,
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
      padding: 6,
    }, editImageShadowContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    }, editCard: {
      width: "100%",
      height: "100%",
      borderRadius: 15,
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
      padding: 6,
    }, editEmailContainer: {
      width: "100%",
      height: 240,
      borderRadius: 15,
      padding: 6,
    }, editPassportContainer: {
      width: "100%",
      height: 240,
      borderRadius: 15,
      padding: 6,
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
      <View style={styles.header}>
        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.text, alignSelf: "center" }}>Редактировать
          профиль</Text>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackBtnText}>Назад</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.editImageContainer}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3,
            opacity: 1,
            radius: 4,
            offset: [0, 0],
          }), styles.editImageShadowContainer]}>
            <View style={styles.editCard}>
              <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.editImageCardText}>Фото профиля</Text>
                <TouchableOpacity>
                  <Text style={styles.editImageCardText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 2,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingHorizontal: wp(10),
                marginBottom: 6,
              }}>
                <Avatar
                  size={"large"}
                  title={auth().currentUser.email.substring(0, 2).toUpperCase()}
                  containerStyle={{ backgroundColor: "blue" }}
                />
                <Avatar
                  size={"medium"}
                  rounded
                  title={auth().currentUser.email.substring(0, 2).toUpperCase()}
                  containerStyle={{ backgroundColor: "blue" }}
                />
                <Avatar
                  size={"small"}
                  rounded
                  title={auth().currentUser.email.substring(0, 2).toUpperCase()}
                  containerStyle={{ backgroundColor: "blue" }}
                />
              </View>
              <Button containerStyle={{ justifyContent: "flex-end", borderRadius: 15 }}
                      buttonStyle={styles.uploadImageBtn} titleStyle={{ color: theme.colors.grey1 }}>
                <Text style={styles.editImageCardText}>Загрузите ваше фото</Text>
              </Button>
            </View>
          </ShadowedView>
        </View>
        <View style={styles.editEmailContainer}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3,
            opacity: 1,
            radius: 4,
            offset: [0, 0],
          }), styles.editImageShadowContainer]}>
            <View style={styles.editCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.editImageCardText}>Email</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Input />
                <Input />
                <Input />
              </View>
            </View>
          </ShadowedView>
        </View>
        <View style={styles.editPassportContainer}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3,
            opacity: 1,
            radius: 4,
            offset: [0, 0],
          }), styles.editImageShadowContainer]}>
            <View style={styles.editCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.editImageCardText}>Пасспортные данные</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Button title={'camera'} onPress={handleLaunchCamera}/>
                <Button title={'gallery'} onPress={handleLaunchCameraLibrary}/>
                <Button title={'scan'} onPress={scanDocument}/>
              </View>
            </View>
          </ShadowedView>
        </View>
        <Text>{passportData}</Text>
        <Button containerStyle={styles.confirmBtnContainer} buttonStyle={styles.confirmBtn}
                titleStyle={{ color: theme.colors.grey1 }}>
          <Text style={styles.confirmBtnText}>Сохранить изменения</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
