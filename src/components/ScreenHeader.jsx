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

const ProfileScreenHeader = ({ user, theme, setInitializing, styles }) => {
  const handleSignOutBtn = () => {
    setInitializing(true);

    const currentUser = auth().currentUser;
    if (currentUser) {
      const providerId = currentUser.providerData[0].providerId;

      if (providerId === "google.com") {
        GoogleSignin.signOut()
          .then(() => console.log("User signed out from Google!"))
          .catch((error) => console.log("Google sign out error:", error));
      }

      auth()
        .signOut()
        .then(() => console.log("User signed out!"))
        .catch((error) => console.log("Sign out error:", error));
    }

    setInitializing(false);
  };

  return (
    <View></View>
    // <View style={{height: 144, width: wp(100), backgroundColor: theme.colors.background}}>
    //   <ShadowedView style={shadowStyle({
    //     color: theme.colors.text,
    //     opacity: 0.4,
    //     radius: 8,
    //     offset: [0,0]
    //   })}>
    //     <View style={{height: 138, width: wp(100), borderBottomStartRadius: 200, borderBottomEndRadius: 200, backgroundColor: theme.colors.background}}>
    //
    //     </View>
    //   </ShadowedView>
    // </View>
    // <View style={styles.header}>
    //   <Text style={{
    //     fontFamily: "Montserrat-Black",
    //     fontSize: 24,
    //     color: theme.colors.accent,
    //   }}>Профиль</Text>
    //   {!user.isAnonymous && (
    //     <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
    //       <TouchableOpacity
    //         style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center", marginEnd: 12 }}>
    //         <Image
    //           source={require("../assets/images/screens/profile/settings.png")}
    //           style={{
    //             width: 24,
    //             height: 24,
    //             tintColor: theme.colors.accent,
    //           }} resizeMode={"contain"} />
    //       </TouchableOpacity>
    //       <TouchableOpacity style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
    //                         onPress={handleSignOutBtn}>
    //         <Image
    //           source={require("../assets/images/screens/profile/logout-filled.png")}
    //           style={{
    //             width: 24,
    //             height: 24,
    //             tintColor: theme.colors.accent,
    //           }} resizeMode={"contain"} />
    //       </TouchableOpacity>
    //     </View>
    //   )}
    // </View>
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
    } else if (page === "profile") {
      return <ProfileScreenHeader theme={theme} styles={styles}
                                  user={user} setInitializing={setInitializing} />;
    } else if (page === "auth") {
      return <AuthScreenHeader theme={theme} styles={styles}
                               user={user} navigation={navigation} />;
    } else {
      return null;
    }
  }
;

export default ScreenHeader;
