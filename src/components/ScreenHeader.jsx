import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const AuthScreenHeader = ({ theme, styles, navigation }) => {

  const handleCloseAuthBtn = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.header}>
      <Text style={{ fontFamily: "Roboto-Black", fontSize: 26, color: theme.colors.accent }}>RoccaRent</Text>
      <TouchableOpacity onPress={handleCloseAuthBtn}>
        <Text style={{
          fontFamily: "Roboto-Medium",
          fontSize: 16,
          color: theme.colors.text,
        }}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
};


const MainScreenHeader = ({ theme, styles }) => {

  return (
    <View style={styles.header}>
      <TouchableOpacity style={{
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Image
          source={require("../assets/images/Chat/chat.png")}
          style={{
            tintColor: theme.colors.accent, width: 24,
            height: 24,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
      <Image source={require("../assets/images/logo/logo.png")} style={{
        width: 60,
        height: 60,
        resizeMode: "contain",
      }} />
      <Image source={require("../assets/images/logo/logo.png")} style={{
        width: 24,
        height: 24,
        resizeMode: "contain",
      }} />
    </View>
  );
};

const CatalogScreenHeader = ({ theme, styles }) => {

  return (
    <View style={styles.header}>
      <Text>Chat</Text>
    </View>
  );
};

const FavoritesScreenHeader = ({ theme, styles }) => {

  return (
    <View style={styles.header}>
      <Text>Chat</Text>
    </View>
  );
};

const ScreenHeader = ({ user, theme, page, setInitializing, navigation }) => {


    const styles = StyleSheet.create({
      header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(5),
        minHeight: hp("6%"),
        height: hp("8%"),
        maxHeight: hp("8%"),
        backgroundColor: theme.colors.background,
        elevation: 8,
        shadowColor: theme.colors.background,
      },
      logoText: {
        fontFamily: "Montserrat-Black",
        fontSize: 26,
      },
    });

    // В зависимости от значения `page`, выбираем нужный компонент для рендеринга
    if (page === "main") {
      return <MainScreenHeader theme={theme} styles={styles}
      />;
    } else if (page === "catalog") {
      return <CatalogScreenHeader theme={theme} styles={styles}
      />;
    } else if (page === "favorites") {
      return <FavoritesScreenHeader theme={theme} styles={styles}
      />;
    }  else if (page === "auth") {
      return <AuthScreenHeader theme={theme} styles={styles}
                               user={user} navigation={navigation} />;
    } else {
      return null;
    }
  }
;

export default ScreenHeader;
