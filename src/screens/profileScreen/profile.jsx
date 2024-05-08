import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Overlay, Avatar, Button, Divider, Icon } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import switchTheme from "react-native-theme-switch-animation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import FastImage from "react-native-fast-image";

const Profile = ({ theme, toggleMode, navigation, setInitializing, passportData }) => {

  const [visible, setVisible] = useState(false);
  const [isSun, setIsSun] = useState(theme.mode === "light");

  const handleToggleModePress = () => {
    switchTheme({
      switchThemeFunction: () => {
        toggleMode();
        setIsSun(!isSun);
      },
      animationConfig: {
        type: "circular",
        duration: 900,
        startingPoint: {
          cxRatio: 1,
          cyRatio: -1,
        },
      },
    });
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLogInBtnPress = () => {
    navigation.navigate("LogIn");
  };

  const handleLogUpBtnPress = () => {
    navigation.navigate("LogUp");
  };

  const handleSignOutBtnPress = async () => {
    setInitializing(true);
    const currentUser = auth().currentUser;
    if (currentUser) {
      await auth().signOut().then(GoogleSignin.signOut());
    }
    setInitializing(false);
  };

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, profileMainCardContainer: {
      width: "100%",
      justifyContent: "center",
      alignSelf: "center",
    }, profileMainCard: {
      width: "100%",
      height: (auth().currentUser && auth().currentUser.isAnonymous) ? 360 : 240,
      padding: 12,
      backgroundColor: theme.colors.background,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    }, profileMainCardHeader: {
      flex: auth().currentUser.isAnonymous ? 1 : 2,
      flexDirection: "row",
      justifyContent: auth().currentUser.isAnonymous ? "center" : "space-between",
    }, profileMainCardAuthBtnContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      bottom: "2%",
    }, profileMainCardAuthBtn: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    }, logoutOverlay: {
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      width: wp(80),
      maxWidth: wp(92),
    }, profileMainCardBody: {
      flex: auth().currentUser.isAnonymous ? 7 : 6,
      justifyContent: "space-between",
      paddingVertical: !auth().currentUser.isAnonymous && 30,
      alignItems: "center",
    }, profileMainCardUnder: {
      flex: auth().currentUser.isAnonymous ? 2 : 3,
      justifyContent: "center",
      alignItems: "center",
    }, profilePersonalDataContainer: {}, profilePersonalDataCard: {
      width: "100%",
      height: 144,
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      paddingHorizontal: 12,
      paddingBottom: 6,
      paddingTop: 12,
    }, profilePersonalData: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    }, profilePersonalDataName: {
      fontFamily: "Roboto-Bold", fontSize: 14, color: theme.colors.text, marginEnd: 6,
    }, profilePersonalDataText: {
      fontFamily: "Roboto-Bold", fontSize: 14, color: theme.colors.text,
    }, profileDataContainer: {
      height: "auto",
      width: wp(100),
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      marginTop: 12,
    }, profileAppDataBtnContainer: {
      borderRadius: 5,
    }, profileAppDataBtn: {
      width: "100%",
      height: 60,
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    /* BODY END */

    btnStyle: {
      width: "100%",
      height: "100%",
    },
    btnShadowContainer: {
      width: "46%",
      height: 42,
      borderRadius: 15,
    }, footerText: {
      alignSelf: 'center',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={{
          paddingBottom: hp(1),
        }}>
          <View style={styles.profileMainCardContainer}>
            <ShadowedView style={[shadowStyle({
              color: theme.colors.grey3,
              opacity: 0.8,
              radius: 24,
              offset: [0, 6],
            })]}>
              <View style={styles.profileMainCard}>
                {auth().currentUser.isAnonymous && <>
                  <View style={styles.profileMainCardHeader}>
                    <Text style={{
                      fontFamily: "Roboto-Black",
                      fontSize: 24,
                      color: theme.colors.accent,
                      alignSelf: "flex-start",
                    }}>RoccaRent</Text>
                    <TouchableOpacity
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onPress={handleToggleModePress}
                    >
                      <FastImage
                        source={isSun ? require("../../assets/images/sun.png") : require("../../assets/images/moon.png")}
                        style={{
                          width: 32,
                          height: 32,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.profileMainCardBody}>
                    <FastImage source={require("../../assets/images/usingPhone/auth.png")} resizeMode={"contain"}
                               style={{ width: 240, height: 240 }} />
                    <View style={styles.profileMainCardAuthBtnContainer}>
                      <ShadowedView style={[shadowStyle({
                        color: theme.colors.grey3,
                        opacity: 1,
                        radius: 4,
                        offset: [0, 0],
                      }), styles.btnShadowContainer]}>
                        <Button
                          type={"clear"}
                          buttonStyle={[styles.btnStyle, { backgroundColor: theme.colors.accent }]}
                          containerStyle={styles.profileMainCardAuthBtn}
                          titleStyle={{ color: theme.colors.grey1 }}
                          onPress={handleLogInBtnPress}
                        >
                          <Text
                            style={{
                              fontFamily: "Roboto-Bold",
                              fontSize: 16,
                              color: theme.colors.accentText,
                            }}>Вход</Text>
                        </Button>
                      </ShadowedView>
                      <ShadowedView style={[shadowStyle({
                        color: theme.colors.grey3,
                        opacity: 1,
                        radius: 4,
                        offset: [0, 0],
                      }), styles.btnShadowContainer]}>
                        <Button
                          type={"clear"}
                          buttonStyle={[styles.btnStyle, { backgroundColor: theme.colors.secondary }]}
                          containerStyle={styles.profileMainCardAuthBtn}
                          titleStyle={{ color: theme.colors.grey1 }}
                          onPress={handleLogUpBtnPress}
                        >
                          <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                            color: theme.colors.text,
                          }}>Регистрация</Text>
                        </Button>
                      </ShadowedView>
                    </View>
                  </View>
                </>}
                {!auth().currentUser.isAnonymous && <>
                  <View style={styles.profileMainCardHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                      <Icon type={"ionicon"} name={"settings-outline"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onPress={handleToggleModePress}
                    >
                      <FastImage
                        source={isSun ? require("../../assets/images/sun.png") : require("../../assets/images/moon.png")}
                        style={{
                          width: 32,
                          height: 32,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Overlay overlayStyle={styles.logoutOverlay} isVisible={visible} onBackdropPress={toggleOverlay}>
                      <ShadowedView style={[{ alignSelf: "center", borderRadius: 15 }, shadowStyle({
                        color: theme.colors.error,
                        opacity: 0.1,
                        radius: 15,
                        offset: [0, 2],
                      })]}>
                        <Icon type={"ionicon"} name={"warning-outline"} color={theme.colors.error} size={36} />
                      </ShadowedView>
                      <View style={{ alignSelf: "center" }}>
                        <Text
                          style={{
                            fontFamily: "Roboto-Black",
                            fontSize: 18,
                            color: theme.colors.text,
                            marginBottom: 6,
                          }}>
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
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity style={{
                          width: "46%",
                          height: 36,
                          borderRadius: 15,
                          backgroundColor: theme.colors.grey3,
                          alignItems: "center",
                          justifyContent: "center",
                        }} onPress={toggleOverlay}>
                          <Text
                            style={{
                              fontFamily: "Roboto-Bold",
                              color: theme.colors.accentText,
                              fontSize: 16,
                            }}>Назад</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                          width: "46%",
                          height: 36,
                          borderRadius: 15,
                          backgroundColor: theme.colors.error,
                          alignItems: "center",
                          justifyContent: "center",
                        }} onPress={handleSignOutBtnPress}>
                          <Text
                            style={{
                              fontFamily: "Roboto-Bold",
                              color: theme.colors.accentText,
                              fontSize: 16,
                            }}>Выйти</Text>
                        </TouchableOpacity>
                      </View>
                    </Overlay>
                  </View>
                  <View style={styles.profileMainCardBody}>
                    <TouchableOpacity>
                      <Avatar
                        size={"large"}
                        rounded
                        icon={{ name: "person", type: "ionicon" }}
                        containerStyle={{ backgroundColor: `${theme.colors.greyOutline}AA` }}
                      />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={{
                      fontFamily: "Roboto-Bold",
                      fontSize: 18,
                      color: theme.colors.text,
                    }}>{auth().currentUser.displayName}</Text>
                  </View>
                </>}
              </View>
            </ShadowedView>
          </View>
          {/*{!auth().currentUser.isAnonymous && <View style={styles.profileDataContainer}>*/}
          {/*  /!*<View style={styles.profileDataLogoContainer}>*!/*/}
          {/*  /!*  <Text style={{ fontFamily: "Roboto-Black", color: theme.colors.text, fontSize: 18 }}>Личные*!/*/}
          {/*  /!*    данные</Text>*!/*/}
          {/*  /!*</View>*!/*/}
          {/*  /!*<View>*!/*/}
          {/*  /!*  <ShadowedView style={[shadowStyle({*!/*/}
          {/*  /!*    color: theme.colors.grey3,*!/*/}
          {/*  /!*    opacity: 1,*!/*/}
          {/*  /!*    radius: 4,*!/*/}
          {/*  /!*    offset: [0, 0],*!/*/}
          {/*  /!*  }), styles.profilePersonalDataCard]}>*!/*/}
          {/*  /!*    <TouchableOpacity style={{ position: "absolute", top: 6, right: 6 }}*!/*/}
          {/*  /!*                      onPress={() => navigation.navigate("EditProfileStackNavigator")}>*!/*/}
          {/*  /!*      <FastImage source={require("../../assets/images/user-pen.png")}*!/*/}
          {/*  /!*                 style={{ width: 24, height: 24 }}*!/*/}
          {/*  /!*                 tintColor={theme.colors.text}*!/*/}
          {/*  /!*                 resizeMode={"contain"} />*!/*/}
          {/*  /!*    </TouchableOpacity>*!/*/}
          {/*  /!*    <View style={styles.profilePersonalData}><Text numberOfLines={1}*!/*/}
          {/*  /!*                                                   style={styles.profilePersonalDataName}>Имя:</Text><Text*!/*/}
          {/*  /!*      numberOfLines={1}*!/*/}
          {/*  /!*      style={styles.profilePersonalDataText}>{auth().currentUser.displayName}</Text></View>*!/*/}
          {/*  /!*    <View style={styles.profilePersonalData}><Text numberOfLines={1}*!/*/}
          {/*  /!*                                                   style={styles.profilePersonalDataName}>Email:</Text><Text*!/*/}
          {/*  /!*      numberOfLines={1} style={styles.profilePersonalDataText}>{auth().currentUser.email}</Text></View>*!/*/}
          {/*  /!*    <View style={styles.profilePersonalData}><Text numberOfLines={1}*!/*/}
          {/*  /!*                                                   style={styles.profilePersonalDataName}>Паспорт:</Text><Text*!/*/}
          {/*  /!*      numberOfLines={1}*!/*/}
          {/*  /!*      style={styles.profilePersonalDataText}>{passportData ? (passportData.substring(0, 3) + "*".repeat(passportData.length - 3)) : "Заполните профиль"}</Text></View>*!/*/}
          {/*  /!*  </ShadowedView>*!/*/}
          {/*  /!*</View>*!/*/}
          {/*</View>}*/}
          <ShadowedView style={[styles.profileDataContainer, shadowStyle({
            color: theme.colors.grey3,
            opacity: 0.8,
            radius: 24,
            offset: [0, 6],
          })]}>
            <Button
              containerStyle={[styles.profileAppDataBtnContainer, { borderRadius: 15 }]}
              buttonStyle={[styles.profileAppDataBtn, { height: 96 }]} titleStyle={{ color: theme.colors.grey1 }}
              onPress={() => navigation.navigate("SupportStackNavigator")}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontFamily: "Roboto-Regular",
                  color: theme.colors.text,
                  fontSize: 16,
                  marginStart: 12,
                }}>Поддержка</Text>
                <Text style={{
                  fontFamily: "Roboto-Regular",
                  color: `${theme.colors.text}AA`,
                  fontSize: 14,
                  marginStart: 12,
                }}>Задайте вопрос, если вам требуется консультация</Text>
              </View>
              <FastImage style={{ width: 72, height: 72, marginEnd: 12 }}
                         source={require("../../assets/images/support.png")}
                         resizeMode={FastImage.resizeMode.contain} />
            </Button>
          </ShadowedView>
          <ShadowedView style={[styles.profileDataContainer, { marginBottom: 24 }, shadowStyle({
            color: theme.colors.grey3,
            opacity: 0.8,
            radius: 24,
            offset: [0, 6],
          })]}>
            <Button
              containerStyle={[styles.profileAppDataBtnContainer, { borderTopStartRadius: 15, borderTopEndRadius: 15 }]}
              buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
              onPress={() => navigation.navigate("Favorites")}>
              <Text style={{
                fontFamily: "Roboto-Regular",
                color: theme.colors.text,
                fontSize: 16,
                marginStart: 12,
              }}>Избранное</Text>
              <Icon type={"ionicon"} name={"chevron-forward"} size={18} color={theme.colors.text} />
            </Button>
            <Divider />
            <Button containerStyle={[styles.profileAppDataBtnContainer, {
              borderBottomStartRadius: 15,
              borderBottomEndRadius: 15,
            }]} buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
                    onPress={() => navigation.navigate("Settings")}>
              <Text style={{
                fontFamily: "Roboto-Regular",
                color: theme.colors.text,
                fontSize: 16,
                marginStart: 12,
              }}>Настройки</Text>
              <Icon type={"ionicon"} name={"chevron-forward"} size={18} color={theme.colors.text} />
            </Button>
          </ShadowedView>
          <Text style={styles.footerText}>
            Все права защищены © 2024 RoccaRent
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
