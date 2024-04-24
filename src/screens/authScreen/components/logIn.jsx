import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Icon, Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

const LogIn = ({ theme, setInitializing, onGoogleButtonPress, Advice, isAdviceShown }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [authBtnDisabled, setAuthBtnDisabled] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backColor = theme.colors.secondary;
  const textColor = theme.colors.text;

  let hasMinimumLength;
  let hasUppercaseLetter;
  let hasLowercaseLetter;
  let hasDigit;
  const [hasAllRequirements, setHasAllRequirements] = useState(false);

  useEffect(() => {
    const hasValidPassword = password;
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

  const handleLogInBtn = () => {
    setInitializing(true);
    auth().signInWithEmailAndPassword(email, password).then(() => {
      console.log("good");
    }).catch((error) => {
      console.log(error);
    });
    setInitializing(false);
  };

  return (
    <ScrollView style={{
      flex: 1, backgroundColor: backColor,
    }}>
      <View style={{ marginVertical: hp(2), marginBottom: 24, marginHorizontal: wp(4) }}>
        {isAdviceShown && <Advice authTypeWord={'Войдите'}/>  }
        <View style={{ flexDirection: "row" }}>
          <Image source={require("../../../assets/images/usingPhone/auth.png")}
                 style={{ width: 144, height: 144, alignSelf: "center" }} />
          <GoogleSigninButton style={{ alignSelf: "flex-end", marginBottom: "5%" }} onPress={onGoogleButtonPress}
                              size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark} />
        </View>
        <Input
          containerStyle={{ height: 60, paddingHorizontal: 0 }}
          inputContainerStyle={{
            paddingHorizontal: wp(3),
            borderColor: theme.colors.primary,
          }}
          disabledInputStyle={{ background: "#ddd" }}
          inputMode={"email"}
          inputStyle={{ color: textColor }}
          errorMessage=""
          leftIcon={<Icon type={"ionicon"} name="mail-outline" color={textColor} />}
          rightIcon={email &&
            <TouchableOpacity onPress={handleEmailClear}><Icon type={"ionicon"} name={"close"}
                                                               color={textColor} /></TouchableOpacity>}
          labelStyle={{ color: textColor }}
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
        />
        <Input
          containerStyle={{ height: 60, paddingHorizontal: 0, marginBottom: password ? (hasAllRequirements ? 0 : hp(2)) : 0 }}
          inputContainerStyle={{
            paddingHorizontal: wp(3),
            borderColor: theme.colors.primary,
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
        <TouchableOpacity
          style={{
            alignSelf: "center",
            height: 54,
            width: wp(92),
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: authBtnDisabled ? theme.colors.disabled : theme.colors.accent,
          }}
          disabled={authBtnDisabled}
          onPress={handleLogInBtn}>
          <Text style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 18,
            color: theme.colors.background,
          }}>Войти</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LogIn;
