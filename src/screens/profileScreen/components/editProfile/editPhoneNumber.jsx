import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Input, Overlay } from "@rneui/themed";
import { Button } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { AppContext } from "../../../../../App";

const EditPhoneNumber = ({ theme, navigation, route }) => {

  const { loadUserdata } = useContext(AppContext);

  const phoneNumber = route.params;
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState("");
  const [codeSending, setCodeSending] = useState(false);
  const [codeVerifying, setCodeVerifying] = useState(false);

  const handleChangePhoneNumber = (value) => {
    setNewPhoneNumber(value);
  };

  const handleChangeVerificationCode = (value) => {
    setVerificationCode(value);
  };

  const handleSendVerification = async () => {
    setCodeSending(true);
    try {
      const confirmationResult = await auth().verifyPhoneNumber(newPhoneNumber);
      setVerificationSent(true);
      setConfirmationResult(confirmationResult); // Сохраняем confirmationResult в состоянии
    } catch (error) {
      console.error(error);
    }
    setCodeSending(false);
  };

  const handleVerifyPhoneNumber = async () => {
    setCodeVerifying(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        verificationCode,
      );
      await auth().currentUser.updatePhoneNumber(credential);
      loadUserdata();
      setCodeVerifying(false);
      navigation.navigate("Profile");
    } catch (error) {
      setNewPhoneNumber("");
      setVerificationCode("");
      setVerificationSent(false);
      console.error(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1, width: wp(100), height: hp(100), backgroundColor: theme.colors.background, padding: 0,
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
    <Overlay overlayStyle={styles.container}>
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
                номер телефона</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
              <Text style={styles.infoText}>
                На указанный Вами номер телефона будет отправлено сообщение с кодом для подтверждения номера телефона
                :{"\n"}
              </Text>
              <Text style={styles.infoText}>
                Вы можете указать новый номер мобильного телефона ниже:
              </Text>
            </View>
            <Input
              label={"Номер телефона"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={"Введите номер телефона"}
              onChangeText={handleChangePhoneNumber}
              value={newPhoneNumber}
            />
            {verificationSent && <>
              <Text style={[styles.infoText, { marginStart: 12, marginBottom: 12 }]}>
                Код отправлен на номер: {newPhoneNumber}
              </Text>
              <Input
                label={"Код подтверждения"}
                labelStyle={styles.inputTextStyle}
                containerStyle={styles.inputComponentContainer}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputTextStyle}
                placeholder={"Введите код подтверждения"}
                onChangeText={handleChangeVerificationCode}
                value={verificationCode}
              />
            </>}
            <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                    titleStyle={{ color: theme.colors.grey1 }}
                    onPress={verificationSent ? handleVerifyPhoneNumber : handleSendVerification}
                    loading={codeSending || codeVerifying} loadingStyle={styles.submitBtn}><Text
              style={{
                fontFamily: "Roboto-Medium",
                fontSize: 18,
                color: theme.colors.accentText,
              }}>{verificationSent ? "Подтвердить номер" : "Получить код"}</Text></Button>
          </View>
        </View>
      </ScrollView>
    </Overlay>
  );
};

export default EditPhoneNumber;
