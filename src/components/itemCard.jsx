import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { BottomSheet, Button, Icon } from "@rneui/base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { AppContext } from "../../App";

const ItemCard = ({ theme, item, likes, editBtn, deleteBtn,}) => {

  const { userdata, loadUserdata } = useContext(AppContext);

  const screenWidth = Dimensions.get("window").width;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const contentWidth = screenWidth - 24;
  const cardWidth = wp(50);
  const cardMinWidth = screenWidth < 384 ? contentWidth : 192;


  function getRatingWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "оценок";
    }

    if (lastDigit === 1) {
      return "оценка";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "оценки";
    }

    return "оценок";
  }

  const handleDeleteListing = async () => {
    const deleteListingFromListings = async () => {
      await firestore().collection("listings").doc(item.listingId).delete();
    };
    const deleteListingFromStorage = async () => {
      const folderRef = storage().ref().child(`listings/${item.listingId}`);
      folderRef.listAll()
        .then((res) => {
          console.log(res);
          const deletePromises = res.items.map((itemRef) => itemRef.delete());
          return Promise.all(deletePromises);
        })
        .then(() => {
          console.log("Папка успешно удалена");
        })
        .catch((error) => {
          console.error("Ошибка при удалении папки:", error);
        });
    };
    const deleteListingFormUserListings = async () => {
      const userRef = firestore().collection("users").doc(auth().currentUser.uid);
      const userDoc = await userRef.get();
      const listings = userDoc.data().listings;
      const listingIdToRemove = item.listingId;
      const updatedListings = listings.filter(listingId => listingId !== listingIdToRemove);
      await userRef.update({ listings: updatedListings });
    };

    deleteListingFromListings().then();
    deleteListingFromStorage().then();
    deleteListingFormUserListings().then();
    setDeleteModalOpen(false);
  };

  const handleLikePress = async () => {
    const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get();
    if (snapshot.exists) {
      if (snapshot.data() && snapshot.data().favoriteListings) {
        const favoriteListings = snapshot.data().favoriteListings;
        if (favoriteListings.includes(item.listingId)) {
          const index = favoriteListings.findIndex(listing => listing === item.listingId);
          if (index !== -1) {
            favoriteListings.splice(index, 1);
          }
          await firestore().collection("users").doc(auth().currentUser.uid).update({ favoriteListings: favoriteListings });
        } else {
          favoriteListings.push(item.listingId);
          await firestore().collection("users").doc(auth().currentUser.uid).update({ favoriteListings: favoriteListings });
        }
      } else {
        await firestore().collection("users").doc(auth().currentUser.uid).set({ favoriteListings: [item.listingId] });
      }
      loadUserdata();
    }
  };

  const styles = StyleSheet.create({
    mainCardContainer: { minWidth: cardMinWidth, width: cardWidth, height: 312, borderRadius: 15 },
    mainCard: {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      backgroundColor: theme.colors.background,
      paddingVertical: 0,
      paddingHorizontal: 0,
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 15,
    }, mainCardContentContainer: {
      width: "100%",
      height: "100%",
    }, mainCardImageContainer: {
      width: "100%",
      height: "65%",
      paddingHorizontal: 2,
    },
    mainCardImage: { width: "100%", height: "100%", borderRadius: 15 },
    mainCardTextContainer: {
      width: "100%",
      height: "35%",
      paddingVertical: 6,
      paddingHorizontal: 12,
    }, mainCardTextPrice: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      color: theme.colors.text,
    }, mainCardTextTitle: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    }, mainCardTextMark: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    }, mainCardTextRating: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    },
  });

  const SaveToFavoritesBtn = () => (
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: 6,
          borderTopStartRadius: 5,
          borderTopEndRadius: 15,
          borderBottomStartRadius: 5,
          backgroundColor: `${theme.colors.background}AA`,
        }}
        onPress={handleLikePress}
      >
        <FastImage
          source={userdata.favoriteListings.includes(item.listingId) ? require("../assets/images/save.png") : require("../assets/images/save-outline.png")}
          style={{ width: 30, height: 30 }} tintColor={theme.colors.accent} resizeMode={FastImage.resizeMode.contain} />
      </TouchableOpacity>
  );

  return (
    <Button containerStyle={styles.mainCardContainer} buttonStyle={styles.mainCard}
            titleStyle={{ color: theme.colors.grey1, height: 0 }}>
      <View style={styles.mainCardContentContainer}>
        <View style={styles.mainCardImageContainer}>
          <FastImage source={{ uri: item.mainImageUrl }} resizeMode={FastImage.resizeMode.cover}
                     style={styles.mainCardImage} />
          {likes &&
            <SaveToFavoritesBtn theme={theme} />}
          {editBtn &&
            <>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  padding: 6,
                  borderTopEndRadius: 5,
                  borderTopStartRadius: 15,
                  borderBottomEndRadius: 5,
                  backgroundColor: `${theme.colors.background}AA`,
                }}
                onPress={() => {
                  setDeleteModalOpen(true);
                }}
              >
                <Icon type={"ionicon"} name={"pencil"} color={theme.colors.accent} size={30}/>
              </TouchableOpacity>
            </>
          }
          {deleteBtn &&
            <>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 6,
                  borderTopStartRadius: 5,
                  borderTopEndRadius: 15,
                  borderBottomStartRadius: 5,
                  backgroundColor: `${theme.colors.background}AA`,
                }}
                onPress={() => {
                  setDeleteModalOpen(true);
                }}
              >
                <Icon type={"ionicon"} name={"trash"} color={theme.colors.accent} size={30} />
              </TouchableOpacity>
              <BottomSheet modalProps={{}} isVisible={isDeleteModalOpen}
                           onBackdropPress={() => setDeleteModalOpen(false)}>
                <View style={{ backgroundColor: theme.colors.background }}>
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Roboto-Black", fontSize: 18, color: theme.colors.text, marginBottom: 6,
                      }}>
                      Удалить объявление
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{ fontFamily: "Roboto-Medium", fontSize: 14, color: theme.colors.text, marginBottom: 6 }}>
                      Вы уверены что хотите удалить объявление?
                    </Text>
                  </View>
                  <TouchableOpacity style={{
                    width: "100%",
                    height: 36,
                    backgroundColor: theme.colors.grey3,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 6,
                  }} onPress={() => setDeleteModalOpen(false)}>
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold", color: theme.colors.text, fontSize: 16,
                      }}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    width: "100%",
                    height: 36,
                    backgroundColor: theme.colors.error,
                    alignItems: "center",
                    justifyContent: "center",
                  }} onPress={handleDeleteListing}>
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold", color: theme.colors.accentText, fontSize: 16,
                      }}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </BottomSheet>
            </>
          }
        </View>
        <View style={styles.mainCardTextContainer}>
          <Text numberOfLines={1} style={styles.mainCardTextPrice}>{item.price}{" "}<Text
            style={{ fontSize: 14 }}>BYN/сут</Text></Text>
          <Text numberOfLines={1} style={[styles.mainCardTextTitle, { opacity: 0.8 }]}>{item.city}</Text>
          <Text numberOfLines={1} style={styles.mainCardTextTitle}>{item.title}</Text>
          <View style={{ flexDirection: "row" }}>
            {item.ratings ? <>
              <View style={{ justifyContent: "center" }}>
                <Icon type={"ionicon"} name={"star"} color={theme.colors.accent} size={14} />
              </View>
              <Text numberOfLines={1} style={styles.mainCardTextMark}>
                {"\t"}{item.mark ? item.mark.toFixed(1).replace(".", ",") : 0}{"\t"}
              </Text>
              <View style={{ justifyContent: "center" }}>
                <Icon type={"ionicon"} name={"ellipse"} color={theme.colors.grey1} size={8} />
              </View>
              <Text numberOfLines={1}
                    style={styles.mainCardTextRating}>{"\t"}{item.ratings ? item.ratings : 0} {getRatingWord(item.ratings)}</Text>
            </> : <Text numberOfLines={1} style={styles.mainCardTextRating}>Нет оценок</Text>}
          </View>
        </View>
      </View>
    </Button>
  );
};

export default ItemCard;
