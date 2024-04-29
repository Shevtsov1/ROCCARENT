import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Icon } from "@rneui/base";
import { Overlay } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";


const Profile = ({ user, theme, toggleMode, navigation }) => {

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  const handleAuthBtnPress = () => {
    navigation.navigate("LogIn");
  };

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex: 1,
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
      backgroundColor: theme.colors.secondary,
    }, profileMainCardContainer: {
      marginTop: hp(1),
      justifyContent: "center",
      alignSelf: "center",
    }, profileMainCard: {
      width: wp(90),
      height: 288,
      padding: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 15,
    }, profileMainCardHeader: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
    }, logoutOverlay: {
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      width: wp(80),
      maxWidth: wp(92),
    }, profileMainCardBody: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 1,
    }, profileMainCardUnder: {
      flex: 3,
      justifyContent: "center",
      alignItems: "center",
    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={styles.profileMainCardContainer}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.text,
            opacity: 0.8,
            radius: 4,
            offset: [0, 0],
          }), { borderRadius: 15 }]}>
            <View style={styles.profileMainCard}>
              <View style={styles.profileMainCardHeader}>
                <TouchableOpacity>
                  <Icon type={"ionicon"} name={"settings-outline"} size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleOverlay}>
                  <Icon type={"ionicon"} name={"log-out-outline"} size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Overlay overlayStyle={styles.logoutOverlay} isVisible={visible} onBackdropPress={toggleOverlay}>
                  <ShadowedView style={[{ alignSelf: "center", borderRadius: 15 }, shadowStyle({
                    color: theme.colors.error,
                    opacity: 0.3,
                    radius: 15,
                    offset: [0, 2],
                  })]}>
                    <Icon type={"ionicon"} name={"warning-outline"} color={theme.colors.error} size={36} />
                  </ShadowedView>
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{ fontFamily: "Roboto-Black", fontSize: 18, color: theme.colors.text, marginBottom: 12 }}>
                      Выход из аккаунта
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text style={{ fontFamily: "Roboto-Medium", fontSize: 14, color: theme.colors.text }}>
                      Вы уверены что хотите выйти?
                    </Text>
                    <Text style={{
                      fontFamily: "Roboto-Medium",
                      fontSize: 12,
                      color: theme.colors.text,
                      alignSelf: "center",
                      marginBottom: 12,
                    }}>
                      (Ваши данные будут сохранены)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity style={{
                      width: "46%",
                      height: 36,
                      borderRadius: 15,
                      backgroundColor: theme.colors.grey2,
                      alignItems: "center",
                      justifyContent: 'center'
                    }} onPress={toggleOverlay}>
                      <Text style={{ fontFamily: "Roboto-Bold", color: theme.colors.accentText, fontSize: 16 }}>Назад</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      width: "46%",
                      height: 36,
                      borderRadius: 15,
                      backgroundColor: theme.colors.error,
                      alignItems: "center",
                      justifyContent: 'center'
                    }} onPress={toggleOverlay}>
                      <Text style={{ fontFamily: "Roboto-Bold", color: theme.colors.accentText, fontSize: 16 }}>Выйти</Text>
                    </TouchableOpacity>
                  </View>
                </Overlay>
              </View>
              <View style={styles.profileMainCardBody}></View>
              <View style={styles.profileMainCardUnder}></View>
            </View>
          </ShadowedView>
        </View>
        <Text>P R O F I L E</Text>
        {user && <Text>{user.uid}</Text>}
        <Button onPress={() => auth()
          .signOut()
          .then(() => GoogleSignin.signOut().then(() => console.log("User signed out!")))} title={"LOGOUT"} />
        <Button onPress={toggleMode} title={"Change color mode"} />
        <Button onPress={handleAuthBtnPress} title={"Go to Auth"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
