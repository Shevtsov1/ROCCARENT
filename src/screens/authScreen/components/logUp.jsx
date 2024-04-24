import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator, ToastAndroid,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import TermsCheckbox from "./TermsCheckbox";
import auth from "@react-native-firebase/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

const LogUp = ({ theme, isDarkMode, setInitializing, onGoogleButtonPress, Advice, isAdviceShown }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);
  const [btnIsLoading, setBtnIsLoading] = useState(false);

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

  return (
    <>
      {btnIsLoading ?
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: backColor }}>
          <Image
            source={require("../../../assets/images/logo/logo_text_caps.png")}
            style={{ width: 192, height: 192, marginBottom: hp(1) }} borderRadius={30} />
          <ActivityIndicator size={48} color={textColor} />
        </View> : <ScrollView style={{
          flex: 1, backgroundColor: backColor,
        }}>
          <View style={{ marginVertical: hp(2), marginHorizontal: wp(4) }}>
            {isAdviceShown && <Advice authTypeWord={'Зарегистрируйтесь'}/> }
            <View>
              <View style={{ flexDirection: "row" }}>
                <Image source={require("../../../assets/images/usingPhone/auth.png")}
                       style={{ width: 144, height: 144, alignSelf: "center" }} />
                <GoogleSigninButton style={{ alignSelf: "flex-end", marginBottom: "5%" }} onPress={onGoogleButtonPress}
                                    size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark} />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Input
                  containerStyle={{ height: 60, paddingHorizontal: 0 }}
                  inputContainerStyle={{
                    paddingHorizontal: wp(3),
                    borderColor: theme.colors.grey1,
                  }}
                  disabledInputStyle={{ background: "#ddd" }}
                  inputMode={"email"}
                  inputStyle={{ color: textColor }}
                  errorMessage=""
                  leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
                  rightIcon={<View style={{ flexDirection: "row" }}>
                    {email && (
                      <TouchableOpacity style={{ justifyContent: "center", marginEnd: 12 }} onPress={handleEmailClear}>
                        <Icon type={"ionicon"} name={"close"} color={textColor} />
                      </TouchableOpacity>
                    )}
                  </View>}
                  rightIconContainerStyle={{ marginEnd: 0 }}
                  labelStyle={{ color: textColor }}
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                />
              </View>
              <Input
                containerStyle={{ height: 60, paddingHorizontal: 0, marginBottom: password ? (hasAllRequirements ? 0 : hp(1)) : 0}}
                inputContainerStyle={{
                  paddingHorizontal: wp(3),
                  borderColor: theme.colors.grey1,
                }}
                disabledInputStyle={{ background: "#ddd" }}
                inputStyle={{ color: textColor }}
                errorStyle={{ marginStart: wp(3) }}
                errorMessage={password ? (hasAllRequirements ? "" : "Пароль не соответствует требованиям") : ""}
                leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
                rightIcon={password &&
                  <TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                    <Icon color={textColor}
                          type={"ionicon"}
                          name={isPasswordSecure ? "eye-outline" : "eye-off-outline"} />
                  </TouchableOpacity>}
                labelStyle={{ color: textColor }}
                placeholder="Пароль"
                secureTextEntry={isPasswordSecure}
                value={password}
                onChangeText={handlePasswordChange}
              />
              <Input
                containerStyle={{
                  height: 60, paddingHorizontal: 0,
                  marginBottom: (password === passwordConfirmation ? 0 : hp(1.5)),
                }}
                inputContainerStyle={{
                  paddingHorizontal: wp(3),
                  borderColor: theme.colors.grey1,
                }}
                disabledInputStyle={{ background: "#ddd" }}
                inputStyle={{ color: textColor }}
                errorStyle={{ marginStart: wp(3) }}
                errorMessage={password === passwordConfirmation ? "" : "Пароли не совпадают"}
                leftIcon={<Icon type={"ionicon"} name="key-outline" color={textColor} />}
                rightIcon={passwordConfirmation &&
                  <TouchableOpacity
                    onPress={() => setIsConfirmPasswordSecure(!isConfirmPasswordSecure)}>
                    <Icon color={textColor}
                          type={"ionicon"}
                          name={isConfirmPasswordSecure ? "eye-outline" : "eye-off-outline"} />
                  </TouchableOpacity>}
                labelStyle={{ color: textColor }}
                placeholder="Подтвердите пароль"
                secureTextEntry={isConfirmPasswordSecure}
                value={passwordConfirmation}
                onChangeText={handlePasswordConfirmationChange}
              />
            </View>
            <View>
              <TermsCheckbox
                theme={theme}
                isDarkMode={isDarkMode}
                isActive={termsAccepted}
                onCheckboxToggle={handleTermsToggle}
              />
            </View>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                height: 54,
                width: "100%",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: authBtnDisabled ? theme.colors.disabled : accentColor,
                overflow: "hidden",
              }}
              disabled={authBtnDisabled || btnIsLoading}
              onPress={handleLogUpBtn}
            >
              <Text style={{
                fontFamily: "Montserrat-Bold",
                fontSize: 18,
                color: theme.colors.background,
              }}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>}
    </>
  );
};

export default LogUp;
