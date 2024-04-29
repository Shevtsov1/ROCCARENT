import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { Button } from "@rneui/base";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import { SafeAreaView } from "react-native-safe-area-context";

const LogIn = ({ theme, onGoogleButtonPress, setInitializing, navigation }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;

  const [hasValidPasswordLength, setHasValidPasswordLength] = useState(false);
  const [hasValidPassword, setHasValidPassword] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);

  useEffect(() => {
    if(auth().currentUser.isAnonymous) {
      onGoogleButtonPress().then();
    }
  }, []);


  useEffect(() => {
    const minimumLength = password.length >= 6;
    const validCharacters = /^(?=.*\d?)\w+$/.test(password);
    const validEmail = /^[a-zA-Z][a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

    setHasValidPasswordLength(minimumLength);
    setHasValidPassword(validCharacters);
    setHasValidEmail(validEmail);

    if (email && password && minimumLength && validCharacters && validEmail) {
      setAuthBtnDisabled(false);
    } else {
      setAuthBtnDisabled(true);
    }
  }, [email, password]);

  const handleEmailClear = () => {
    setEmail("");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogInBtn = async () => {
    setInitializing(true);
    await auth().signInWithEmailAndPassword(email, password).then(() => {
      setInitializing(false);
      console.log("User signed in!");
    }).catch((error) => {
      console.log(error);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1, backgroundColor: backColor, justifyContent: "center",
    },
    contentContainer: {
      marginTop: hp(30), marginHorizontal: wp(4),
    },
    imageContainer: {
      position: "absolute", alignSelf: "center", top: hp(20),
    },
    image: {
      width: 144, height: 144, alignSelf: "center",
    },
    buttonContainer: {
      alignSelf: "flex-end", marginBottom: "5%", flexDirection: "column",
    },
    inputViewContainer: {
      height: 84,
      borderRadius: 15,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    inputContainer: {
      height: 72, paddingHorizontal: 0,
    },
    inputLabelStyle: { fontFamily: "Roboto-Medium", fontWeight: "light", color: theme.colors.grey1, marginBottom: 10 },
    input: {
      height: 24, borderBottomWidth: 0,
    },
    emailInput: {
      paddingVertical: 0, fontFamily: "Roboto-Medium", color: textColor,
    },
    errorStyle: {
      marginTop: 0, fontFamily: "Roboto-Regular", marginHorizontal: 0, paddingHorizontal: 0,
    },
    googleAuthBtnText: {
      marginEnd: 18,
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.mode === "dark" ? theme.colors.text : theme.colors.accentText,
    },
    buttonSubmit: {
      alignSelf: "center",
      height: 54,
      width: wp(90) - 54,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontFamily: "Roboto-Bold", fontSize: 18, color: authBtnDisabled ? theme.colors.greyOutline : theme.colors.accentText,
    },
    googleAuthBtnContainer: {
      borderRadius: 15,
    },
    googleAuthBtn: {
      height: 54,
      width: 54,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    googleAuthBtnImageContainer: {
      height: 54,
      width: 54,
      backgroundColor: theme.mode === "dark" ? theme.colors.accentText : theme.colors.accentText,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    loginBtnContainer: {
      maxWidth: "100%", flexDirection: "row",
    },
    backButton: {
      position: "absolute",
      top: hp(2),
      left: wp(2),
    }, underButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    }, underButton: {
      height: 48,
    }, underButtonText: {
      fontFamily: "Roboto-Medium",
      color: theme.colors.grey1,
    },
  });

  return (<SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity style={{ width: 36, height: 36 }} onPress={() => navigation.navigate('Profile')}>
          <Icon type={"ionicon"} name="chevron-back-outline" color={theme.colors.text} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.image}
          resizeMode={"contain"}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={{ marginBottom: 12 }}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3, opacity: 0.4, radius: 8, offset: [0, 0],
          }), { borderRadius: 15 }]}>
            <View style={styles.inputViewContainer}>
              <Input
                label={"Email"}
                containerStyle={[styles.inputContainer]}
                inputContainerStyle={styles.input}
                inputMode={"email"}
                inputStyle={styles.emailInput}
                errorStyle={styles.errorStyle}
                errorMessage={email ? (hasValidEmail ? "" : "Введите корректный Email") : ""}
                leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
                rightIcon={email && (<TouchableOpacity onPress={handleEmailClear}>
                  <Icon type={"ionicon"} name={"close"} color={textColor} />
                </TouchableOpacity>)}
                labelStyle={styles.inputLabelStyle}
                placeholder="example@gmail.com"
                value={email}
                onChangeText={handleEmailChange}
                onSubmitEditing={() => {
                  // Переход к следующему инпуту (в данном случае, к инпуту password)
                  passwordRef.current.focus();
                }}
              />
            </View>
          </ShadowedView>
        </View>
        <View style={{ marginBottom: 12 }}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3, opacity: 0.4, radius: 8, offset: [0, 0],
          }), { borderRadius: 15 }]}>
            <View style={styles.inputViewContainer}>
              <Input
                label={"Пароль"}
                containerStyle={[styles.inputContainer]}
                inputContainerStyle={styles.input}
                inputStyle={styles.emailInput}
                errorStyle={styles.errorStyle}
                errorMessage={password ? (hasValidPasswordLength ? (hasValidPassword ? "" : "Латинские буквы, цифры и \"_\"") : "Минимум 6 символов") : ""}
                leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
                rightIcon={password && (<TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                  <Icon
                    color={textColor}
                    type={"ionicon"}
                    name={isPasswordSecure ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>)}
                labelStyle={styles.inputLabelStyle}
                placeholder="Введите пароль"
                secureTextEntry={isPasswordSecure}
                value={password}
                onChangeText={handlePasswordChange}
                ref={passwordRef}
              />
            </View>
          </ShadowedView>
        </View>
        <View style={styles.loginBtnContainer}>
          <View style={{ marginEnd: wp(2) }}>
            <ShadowedView style={[!authBtnDisabled && shadowStyle({
              color: theme.colors.grey3, opacity: 0.4, radius: 8, offset: [0, 0],
            }), { borderRadius: 15 }]}>
              <TouchableOpacity
                style={[styles.buttonSubmit, {
                  backgroundColor: authBtnDisabled ? theme.colors.disabled : theme.colors.accent,
                }]}
                disabled={authBtnDisabled}
                onPress={handleLogInBtn}
              >
                <Text style={styles.buttonText}>Войти</Text>
              </TouchableOpacity>
            </ShadowedView>
          </View>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.grey3, opacity: 0.4, radius: 8, offset: [0, 0],
          }), { borderRadius: 15 }]}>
            <Button containerStyle={styles.googleAuthBtnContainer} buttonStyle={styles.googleAuthBtn}
                    onPress={onGoogleButtonPress}
                    title={<Image source={require("../../assets/images/google-icon.png")}
                                  style={{ width: 30, height: 30 }} />} />
          </ShadowedView>
        </View>
        <View style={styles.underButtonsContainer}>
          <TouchableOpacity style={styles.underButton} onPress={() => navigation.navigate('LogUp')}>
            <Text style={styles.underButtonText}>Регистрация</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.underButton} >
            <Text style={styles.underButtonText}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </SafeAreaView>);
};

export default LogIn;
