import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import TermsCheckbox from "./TermsCheckbox";
import auth from "@react-native-firebase/auth";

const LogUp = ({ theme, setInitializing, onGoogleButtonPress, Advice, isAdviceShown }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;
  const accentColor = theme.colors.accent;

  let hasMinimumLength;
  let hasUppercaseLetter;
  let hasLowercaseLetter;
  let hasDigit;
  const [hasAllRequirements, setHasAllRequirements] = useState(false);

  useEffect(() => {
    const hasValidPassword =
      password && passwordConfirmation && password === passwordConfirmation;
    hasMinimumLength = password.length >= 8;
    hasUppercaseLetter = /[A-Z]/.test(password);
    hasLowercaseLetter = /[a-z]/.test(password);
    hasDigit = /\d/.test(password);

    if (password && hasMinimumLength && hasDigit && hasUppercaseLetter && hasLowercaseLetter) {
      setHasAllRequirements(true);
    } else {
      setHasAllRequirements(false);
    }

    if (
      email &&
      password &&
      passwordConfirmation &&
      termsAccepted &&
      hasValidPassword &&
      hasMinimumLength &&
      hasUppercaseLetter &&
      hasLowercaseLetter &&
      hasDigit
    ) {
      setAuthBtnDisabled(false);
    } else {
      setAuthBtnDisabled(true);
    }
  }, [email, password, passwordConfirmation, termsAccepted]);

  const handleEmailClear = () => {
    setEmail("");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handlePasswordConfirmationChange = (value) => {
    setPasswordConfirmation(value);
  };

  const handleTermsToggle = (isChecked) => {
    setTermsAccepted(isChecked);
  };

  const handleLogUpBtn = async () => {
    setInitializing(true);
    let toastText = "";

    try {
      const emailAuthCredential = auth.EmailAuthProvider.credential(email, password);
      await auth().currentUser.linkWithCredential(emailAuthCredential);
      toastText = "Регистрация завершена";
    } catch (error) {
      console.log(error);
      console.log(error.code);
      console.log(error.message);
      if (error.message === "[auth/unknown] User has already been linked to the given provider.") {
        toastText = "Пользователь с таким Email уже зарегистрирован";
      }
    }

    setTimeout(() => {
      setInitializing(false);
      ToastAndroid.show(toastText, ToastAndroid.LONG);
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backColor,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: backColor,
    },
    logoImage: {
      width: 192,
      height: 192,
      marginBottom: hp(1),
      borderRadius: 30,
    },
    buttonContainer: {
      alignSelf: "center",
      height: 54,
      width: "100%",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: authBtnDisabled ? theme.colors.disabled : accentColor,
      overflow: "hidden",
    },
    buttonText: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      color: authBtnDisabled ? theme.colors.accentText : theme.colors.text,
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: 'space-between',
    },
    image: {
      width: 144,
      height: 144,
      alignSelf: "center",
    },
    googleButton: {
      alignSelf: "flex-end",
      marginBottom: "5%",
    },
    inputContainer: {
      height: 60,
      paddingHorizontal: 0,
    },
    input: {
      paddingHorizontal: wp(3),
      borderColor: theme.colors.grey1,
    },
    inputIcon: {
      marginEnd: 12,
    },
    inputRightIconContainer: {
      marginEnd: 0,
    },
    errorStyle: {
      marginStart: wp(3),
    },
    googleButtonContainer: {
      alignSelf: "flex-end",
      marginBottom: "5%",
      flexDirection: 'column',
    },
    googleAuthBtn: {
      right: 0,
      height: 36,
      width: 200,
      flexDirection: 'row',
      backgroundColor: theme.colors.googleBlue,
      borderRadius: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.colors.grey1,
      elevation: 8,
    },
    googleAuthBtnImageContainer: {
      height: 36,
      width: 42,
      backgroundColor: theme.mode === 'dark' ? theme.colors.text : theme.colors.accentText,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopStartRadius: 15,
      borderBottomStartRadius: 15,
    },
    googleAuthBtnText: {
      marginEnd: 6,
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      color: theme.mode === 'dark' ? theme.colors.text : theme.colors.accentText,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: hp(2), marginHorizontal: wp(4) }}>
        {isAdviceShown && <Advice authTypeWord={"Зарегистрируйтесь"} />}
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/images/usingPhone/auth.png")}
              style={styles.image}
            />
            <View style={styles.googleButtonContainer}>
              <TouchableOpacity style={styles.googleAuthBtn} onPress={onGoogleButtonPress}>
                <View style={styles.googleAuthBtnImageContainer}>
                  <Image source={require('../../../assets/images/google-icon.png')} style={{width: 24, height: 24}}/>
                </View>
                <Text style={styles.googleAuthBtnText}>Войти с Google</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Input
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
              inputMode={"email"}
              inputStyle={{ color: textColor }}
              errorMessage=""
              leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
              rightIcon={
                <View style={{ flexDirection: "row" }}>
                  {email && (
                    <TouchableOpacity style={{ justifyContent: "center", marginEnd: 12 }}
                                      onPress={handleEmailClear}>
                      <Icon type={"ionicon"} name={"close"} color={textColor} />
                    </TouchableOpacity>
                  )}
                </View>
              }
              rightIconContainerStyle={styles.inputRightIconContainer}
              labelStyle={{ color: textColor }}
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
            />
          </View>
          <Input
            containerStyle={[styles.inputContainer, { marginBottom: password ? (hasAllRequirements ? 0 : hp(1)) : 0 }]}
            inputContainerStyle={styles.input}
            inputStyle={{ color: textColor }}
            errorStyle={styles.errorStyle}
            errorMessage={password ? (hasAllRequirements ? "" : "Пароль не соответствует требованиям") : ""}
            leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
            rightIcon={
              password && (
                <TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                  <Icon
                    color={textColor}
                    type={"ionicon"}
                    name={isPasswordSecure ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              )
            }
            labelStyle={{ color: textColor }}
            placeholder="Пароль"
            secureTextEntry={isPasswordSecure}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <Input
            containerStyle={[
              styles.inputContainer,
              { marginBottom: password ? (hasAllRequirements ? 0 : hp(1)) : 0 },
            ]}
            inputContainerStyle={styles.input}
            inputStyle={{ color: textColor }}
            errorStyle={styles.errorStyle}
            errorMessage={passwordConfirmation ? (hasAllRequirements ? "" : "Пароли не совпадают") : ""}
            leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
            rightIcon={
              passwordConfirmation && (
                <TouchableOpacity onPress={() => setIsConfirmPasswordSecure(!isConfirmPasswordSecure)}>
                  <Icon
                    color={textColor}
                    type={"ionicon"}
                    name={isConfirmPasswordSecure ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              )
            }
            labelStyle={{ color: textColor }}
            placeholder="Подтвердите пароль"
            secureTextEntry={isConfirmPasswordSecure}
            value={passwordConfirmation}
            onChangeText={handlePasswordConfirmationChange}
          />
          <View>
            <TermsCheckbox
              theme={theme}
              isActive={termsAccepted}
              onCheckboxToggle={handleTermsToggle}
            />
          </View>
          <TouchableOpacity disabled={authBtnDisabled} style={styles.buttonContainer} onPress={handleLogUpBtn}>
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LogUp;
