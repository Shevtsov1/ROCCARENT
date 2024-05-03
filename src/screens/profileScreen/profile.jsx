import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Icon } from "@rneui/base";
import { Overlay, Avatar, Button, Skeleton, Divider } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import switchTheme from "react-native-theme-switch-animation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Profile = ({ theme, toggleMode, navigation, setInitializing }) => {

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
      paddingHorizontal: wp(4),
      backgroundColor: theme.colors.secondary,
    }, profileMainCardContainer: {
      marginTop: hp(1),
      justifyContent: "center",
      alignSelf: "center",
    }, profileMainCard: {
      width: wp(90),
      height: auth().currentUser.isAnonymous ? 360 : 240,
      padding: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 15,
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
      height: 240,
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      paddingHorizontal: 12,
      paddingBottom: 6,
      paddingTop: 12,
    }, profilePersonalDataName: {
      flex: 1, justifyContent: "center", alignItems: "flex-start",
    }, profilePersonalDataText: {
      width: "100%", fontFamily: "Roboto-Bold", fontSize: 16, color: theme.colors.text,
    }, profileAppDataContainer: {}, profileDataLogoContainer: {
      marginVertical: 24,
    }, profileAppDataBtnContainer: {
      width: "48%",
      height: 120,
      borderRadius: 15,
      backgroundColor: `${theme.colors.accent}AA`,
    }, profileAppDataBtn: {
      width: "100%",
      height: 120,
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 15,
    }, profileAppDataBtnIconContainer: {
      width: "30%",
      height: 48,
      borderRadius: 15,
      backgroundColor: theme.colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginEnd: 6,
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
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={{ paddingTop: hp(3) }}>
          <View style={styles.profileMainCardContainer}>
            <ShadowedView style={[shadowStyle({
              color: theme.colors.grey3,
              opacity: 1,
              radius: 4,
              offset: [0, 0],
            }), { borderRadius: 15 }]}>
              <View style={styles.profileMainCard}>
                {auth().currentUser.isAnonymous && <>
                  <View style={styles.profileMainCardHeader}>
                    <TouchableOpacity style={{ position: "absolute", top: 0, left: 0 }}>
                      <Icon type={"ionicon"} name={"settings-outline"} size={30} color={theme.colors.text} />
                    </TouchableOpacity>
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
                      <Image
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
                    <Image source={require("../../assets/images/usingPhone/auth.png")} resizeMode={"contain"}
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
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                      <Icon type={"ionicon"} name={"settings-outline"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onPress={handleToggleModePress}
                    >
                      <Image
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
                            marginBottom: 12,
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
                        title={auth().currentUser.email.substring(0, 2).toUpperCase()}
                        containerStyle={{ backgroundColor: "blue" }}
                      />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={{
                      fontFamily: "Roboto-Bold",
                      fontSize: 18,
                      color: theme.colors.text,
                    }}>{auth().currentUser.email}</Text>
                  </View>
                </>}
              </View>
            </ShadowedView>
          </View>
          {!auth().currentUser.isAnonymous && <View style={styles.profilePersonalDataContainer}>
            <View style={styles.profileDataLogoContainer}>
              <Text style={{ fontFamily: "Roboto-Black", color: theme.colors.accent, fontSize: 20 }}>Личные
                данные</Text>
            </View>
            <View style={{ paddingHorizontal: 6 }}>
              <ShadowedView style={[shadowStyle({
                color: theme.colors.grey3,
                opacity: 1,
                radius: 4,
                offset: [0, 0],
              }), styles.profilePersonalDataCard]}>
                <TouchableOpacity style={{ position: "absolute", top: 6, right: 6 }}
                                  onPress={() => navigation.navigate("EditProfile")}>
                  <Image source={require("../../assets/images/user-pen.png")} style={{ width: 24, height: 24 }}
                         resizeMode={"contain"} />
                </TouchableOpacity>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={[styles.profilePersonalDataText, { width: "90%" }]}>Никнейм: {auth().currentUser.email}daskdhajdhajdhajdhajh</Text></View>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={styles.profilePersonalDataText}>Имя:</Text></View>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={styles.profilePersonalDataText}>Фамилия:</Text></View>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={styles.profilePersonalDataText}>Номер
                  телефона:</Text></View>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={styles.profilePersonalDataText}>Email:</Text></View>
                <View style={styles.profilePersonalDataName}><Text numberOfLines={1}
                                                                   style={styles.profilePersonalDataText}>Паспорт:</Text></View>
              </ShadowedView>
            </View>
          </View>}
          <View style={styles.profileAppDataContainer}>
            <View style={styles.profileDataLogoContainer}>
              <Text style={{ fontFamily: "Roboto-Black", color: theme.colors.accent, fontSize: 20 }}>Профиль</Text>
            </View>
            <View style={{ paddingHorizontal: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3,
                  opacity: 1,
                  radius: 4,
                  offset: [0, 0],
                }), styles.profileAppDataBtnContainer, { marginBottom: 12, borderRadius: 15 }]}>
                  <Button type={"clear"} containerStyle={{ borderRadius: 15 }}
                          buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
                          icon={
                            <ShadowedView style={[shadowStyle({
                              color: theme.colors.grey2, opacity: 0.8,
                              radius: 4, offset: [0, 0],
                            }), styles.profileAppDataBtnIconContainer]}>
                              <Icon type={"ionicon"} name={"bookmarks"} color={theme.colors.accent} size={30} />
                            </ShadowedView>
                          } iconPosition={"left"} onPress={() => navigation.navigate("Favorites")}>
                    <View style={{ width: "70%", alignItems: "center" }}>
                      <Text numberOfLines={1}
                            style={{
                              fontFamily: "Roboto-Bold",
                              fontSize: 18,
                              color: theme.colors.text,
                            }}>Избранное</Text>
                    </View>
                  </Button>
                </ShadowedView>
                <ShadowedView style={[shadowStyle({
                  color: theme.colors.grey3,
                  opacity: 1,
                  radius: 4,
                  offset: [0, 0],
                }), styles.profileAppDataBtnContainer, { marginBottom: 12, borderRadius: 15 }]}>
                  <Button type={"clear"} containerStyle={{ borderRadius: 15 }}
                          buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
                          icon={
                            <ShadowedView style={[shadowStyle({
                              color: theme.colors.grey2, opacity: 0.8,
                              radius: 4, offset: [0, 0],
                            }), styles.profileAppDataBtnIconContainer]}>
                              <View>
                                <Icon type={"ionicon"} name={"settings"} color={theme.colors.accent} size={30} />
                              </View>
                            </ShadowedView>
                          } iconPosition={"left"} onPress={() => navigation.navigate('Settings')}>
                    <View style={{ width: "70%", alignItems: "center" }}>
                      <Text numberOfLines={1}
                            style={{
                              fontFamily: "Roboto-Bold",
                              fontSize: 18,
                              color: theme.colors.text,
                            }}>Настройки</Text>
                    </View>
                  </Button>
                </ShadowedView>
              </View>
              {!auth().currentUser.isAnonymous &&
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <ShadowedView style={[shadowStyle({
                    color: theme.colors.grey3,
                    opacity: 1,
                    radius: 4,
                    offset: [0, 0],
                  }), styles.profileAppDataBtnContainer, { marginBottom: 12, borderRadius: 15 }]}>
                    <Button type={"clear"} containerStyle={{ borderRadius: 15 }}
                            buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
                            icon={
                              <ShadowedView style={[shadowStyle({
                                color: theme.colors.grey2, opacity: 0.8,
                                radius: 4, offset: [0, 0],
                              }), styles.profileAppDataBtnIconContainer]}>
                                <Icon type={"ionicon"} name={"archive"} color={theme.colors.accent}
                                      size={30} />
                              </ShadowedView>
                            } iconPosition={"left"} onPress={() => navigation.navigate('DealArchive')}>
                      <View style={{ width: "70%", flexShrink: 2, alignItems: "center" }}>
                        <Text numberOfLines={2}
                              style={{ fontFamily: "Roboto-Bold", fontSize: 18, color: theme.colors.text }}>История
                          сделок</Text>
                      </View>
                    </Button>
                  </ShadowedView>
                  <ShadowedView style={[shadowStyle({
                    color: theme.colors.grey3,
                    opacity: 1,
                    radius: 4,
                    offset: [0, 0],
                  }), styles.profileAppDataBtnContainer, { marginBottom: 12, borderRadius: 15 }]}>
                    <Button type={"clear"} containerStyle={{ borderRadius: 15 }}
                            buttonStyle={styles.profileAppDataBtn} titleStyle={{ color: theme.colors.grey1 }}
                            onPress={toggleOverlay}
                            icon={
                              <ShadowedView style={[shadowStyle({
                                color: theme.colors.grey2, opacity: 0.8,
                                radius: 4, offset: [0, 0],
                              }), styles.profileAppDataBtnIconContainer]}>
                                <View>
                                  <Icon type={"ionicon"} name={"log-out"} color={theme.colors.accent} size={34} />
                                </View>
                              </ShadowedView>
                            } iconPosition={"left"}>
                      <View style={{ width: "70%", alignItems: "center" }}>
                        <Text numberOfLines={1}
                              style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                                color: theme.colors.text,
                              }}>Выход</Text>
                      </View>
                    </Button>
                  </ShadowedView>
                </View>}
            </View>
          </View>
          {/*{user && <Text>{user.uid}</Text>}*/}
          {/*<Button onPress={() => auth()*/}
          {/*  .signOut()*/}
          {/*  .then(() => GoogleSignin.signOut().then(() => console.log("User signed out!")))} title={"LOGOUT"} />*/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
