import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button } from "@rneui/base";
import TextRecognition from "@react-native-ml-kit/text-recognition";

const EditName = ({ theme, navigation, passportData, setPassportData }) => {

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  // const [passportVerified, setPassportVerified] = useState(false);
  // const passportRegexPattern = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;

  useEffect(() => {
    const displayNameArray = auth().currentUser.displayName.split(" ");
    setName(displayNameArray[0]);
    setSurname(displayNameArray[1]);
  }, []);

  useEffect(() => {

  }, [name, surname]);

  const handleChangeNickname = (value) => {
    setNickname(value);
  };

  const handleChangeName = (value) => {
    setName(value);
  };

  const handleChangeSurname = (value) => {
    setSurname(value);
  };

  const handleSubmitBtn = () => {
    console.log(`New name data:\n${nickname}\n${name}\n${surname}\n`);
  };

  // const verifyPassport = async (passportImage) => {
  //   const result = await TextRecognition.recognize(passportImage.assets[0].uri);
  //   const textArr = result.text.split("\n");
  //   const finalArray = [];
  //   for (let i = 0; i < textArr.length; i++) {
  //     const words = textArr[i].split(" ");
  //     finalArray.push(...words);
  //   }
  //   for (let i = 0; i < finalArray.length; i++) {
  //     const element = finalArray[i];
  //     if (passportRegexPattern.test(element)) {
  //       setPassportData(element);
  //       setPassportVerified(true);
  //       console.log("Passport data found:", element);
  //     }
  //   }
  //   if (!passportVerified) console.log("Не удалось просканировать пасспорт, повторите попытку");
  // };

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
                }}>Изменить
                имя</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
              <Text style={styles.infoText}>
                В случае отсутсвия никнейма ваше имя и фамилия будут отображаться
                другим пользователям:{"\n"}
              </Text>
              <Text style={styles.infoText}>
                {`${name} ${surname}`}{"\n"}
              </Text>
              <Text style={styles.infoText}>
                Вы можете придумать никнейм или изменить свое имя ниже:
              </Text>
            </View>
            <Input
              label={"Никнейм"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={nickname ? nickname : "Придумайте никнейм"}
              value={nickname}
              onChangeText={handleChangeNickname}
            />
            <Input
              label={"Имя"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={name ? name : "Введите имя"}
              value={name}
              onChangeText={handleChangeName}
            />
            <Input
              label={"Фамилия"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={surname ? surname : "Введите фамилию"}
              value={surname}
              onChangeText={handleChangeSurname}
            />
            <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                    titleStyle={{ color: theme.colors.grey1 }} onPress={handleSubmitBtn}><Text
              style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.accentText }}>Сохранить
              изменения</Text></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditName;
