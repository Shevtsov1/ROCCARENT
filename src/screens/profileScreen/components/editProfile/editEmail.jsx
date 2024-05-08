import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button } from "@rneui/base";

const EditEmail = ({ theme, navigation, passportData, setPassportData }) => {

  const [email, setEmail] = useState("");

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleSubmitBtn = () => {
    console.log(`New Email:\n${email}`);
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
                }}>Изменить
                Email</Text>
              <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.headerBackBtnText}>Назад</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12, marginVertical: 12, flex: 1 }}>
              <Text style={styles.infoText}>
                На указанный Вами электронный адрес будет отправлено письмо с сылкой для подтверждени адреса электронной почты :{"\n"}
              </Text>
              <Text style={styles.infoText}>
                Вы можете придумать изменить электронный адрес ниже:
              </Text>
            </View>
            <Input
              label={"Email"}
              labelStyle={styles.inputTextStyle}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputTextStyle}
              placeholder={"Новый e-mail"}
              value={email}
              onChangeText={handleChangeEmail}
            />
            <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                    titleStyle={{ color: theme.colors.grey1 }} onPress={handleSubmitBtn}><Text
              style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.accentText }}>Изменить Email</Text></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditEmail;
