import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Carousel from "react-native-reanimated-carousel";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { BottomSheet, Button, Icon } from "@rneui/base";
import { AppContext } from "../../App";
import TextTicker from "react-native-text-ticker";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import { handleDeleteListing, handleLikePress } from "./itemCard";
import auth from "@react-native-firebase/auth";

const OpenedItemCard = ({ theme, navigation }) => {

  const { userdata, loadUserdata } = useContext(AppContext);

  const route = useRoute();

  const { item, likes, editBtn, deleteBtn } = route.params;

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingImages, setListingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const width = screenWidth;
  const height = screenWidth * 1.3;

  useEffect(() => {
    const getListingImages = async () => {
      if (item && item.listingId) {
        let newListingImagesArr = [];
        const firestoreSnapshot = await firestore()
          .collection("listings")
          .doc(item.listingId)
          .get();
        if (
          firestoreSnapshot.exists &&
          firestoreSnapshot.data().mainImageUrl
        ) {
          newListingImagesArr.push(firestoreSnapshot.data().mainImageUrl);
        }
        const storageSnapshot = await storage()
          .ref(`listings/${item.listingId}/otherImages`)
          .listAll();
        for (const imageRef of storageSnapshot.items) {
          const imageURL = await imageRef.getDownloadURL();
          newListingImagesArr.push(imageURL);
        }
        setListingImages(newListingImagesArr);
      }
    };

    getListingImages().then();
  }, []);

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

  const handleProgressChange = (offsetProgress, absoluteProgress) => {
    if (Number.isInteger(absoluteProgress)) {
      setCurrentImageIndex(absoluteProgress);
    }
  };

  const styles = StyleSheet.create({
    imagesContainer: {
      height,
    }, imageCounterContainer: {
      width: 'auto',
      height: 36.6,
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
      padding: 6,
      borderTopEndRadius: 5,
      borderBottomEndRadius: 5,
      backgroundColor: `${theme.colors.background}AA`,
    }, imageCounter: {
      fontFamily: "Roboto-Bold",
      fontSize: 15,
      color: theme.colors.accent,
    }, cardBtnContainer: {
      borderRadius: 5,
    }, cardBtn: {
      backgroundColor: theme.colors.background,
    },
  });

  const renderImageCounter = () => {
    const totalImages = listingImages.length;
    console.log(totalImages)
    return (
      <View style={styles.imageCounterContainer}>
        <Text style={styles.imageCounter}>
          {`${currentImageIndex + 1}/${totalImages}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BottomSheet modalProps={{}} isVisible={isDeleteModalOpen}
                   onBackdropPress={() => setDeleteModalOpen(false)}>
        <View style={{ backgroundColor: theme.colors.background }}>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Roboto-Black",
                fontSize: 18,
                color: theme.colors.text,
                marginBottom: 6,
              }}>
              Удалить объявление
            </Text>
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Roboto-Medium",
                fontSize: 14,
                color: theme.colors.text,
                marginBottom: 6,
              }}>
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
          }} onPress={() => handleDeleteListing(item, setDeleteModalOpen, loadUserdata)}>
            <Text
              style={{
                fontFamily: "Roboto-Bold",
                color: theme.colors.accentText,
                fontSize: 16,
              }}>Удалить</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <ScrollView>
        <View style={styles.imagesContainer}>
          <Carousel
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
              activeOffsetY: [-10, 10],
              failOffsetY: [-10, 10],
            }}
            ref={carouselRef}
            loop={false}
            width={width}
            height={height}
            data={listingImages}
            renderItem={({ item }) => (
              <FastImage
                source={{ uri: item }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
            onProgressChange={handleProgressChange}
          />
          {renderImageCounter()}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: 6,
              borderTopStartRadius: 5,
              borderBottomStartRadius: 5,
              backgroundColor: `${theme.colors.background}AA`,
            }}
            onPress={() => {
              if (likes) {
                handleLikePress(item, loadUserdata).then();
              }
              if (deleteBtn) {
                setDeleteModalOpen(true);
              }
            }}
          >
            {likes &&
              <FastImage
                source={userdata && userdata.favoriteListings && userdata.favoriteListings.includes(item.listingId) ? require("../assets/images/save.png") : require("../assets/images/save-outline.png")}
                style={{ width: 24, height: 24 }} tintColor={theme.colors.accent}
                resizeMode={FastImage.resizeMode.contain} />}
            {deleteBtn && <View><Icon type={"ionicon"} name={"trash"} size={24} color={theme.colors.accent} /></View>}
          </TouchableOpacity>
          {editBtn && <TouchableOpacity style={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: 6,
            borderTopEndRadius: 5,
            borderBottomEndRadius: 5,
            backgroundColor: `${theme.colors.background}AA`,
          }}><Icon type={"ionicon"} name={"pencil"} size={24} color={theme.colors.accent} /></TouchableOpacity>}
        </View>
        <ShadowedView style={[{
          backgroundColor: theme.colors.background,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
          marginBottom: 12,
        }, shadowStyle({
          color: theme.colors.grey3, opacity: 0.8, radius: 24, offset: [0, 6],
        })]}>
          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <TextTicker
                style={{ fontFamily: "Roboto-Medium", fontSize: 18, color: theme.colors.text }}
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                numberOfLines={1}
              >
                {item.title}
              </TextTicker>
              <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                color: theme.colors.text,
              }}>{item.price} BYN/сут</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontFamily: "Roboto-Regular", color: theme.colors.text }}>{item.city}</Text>
              <Text style={{
                fontFamily: "Roboto-Regular",
                color: theme.colors.text,
              }}>{item.ratings ? <>
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
                      style={{
                        fontFamily: "Roboto-Regular",
                        fontSize: 14,
                        color: theme.colors.text,
                      }}>{"\t"}{item.ratings ? item.ratings : 0} {getRatingWord(item.ratings)}</Text>
              </> : <Text numberOfLines={1}
                          style={{ fontFamily: "Roboto-Regular", fontSize: 14, color: theme.colors.text }}>Нет
                оценок</Text>}</Text>
            </View>
          </View>
        </ShadowedView>
        <ShadowedView style={[{
          backgroundColor: theme.colors.background,
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
          padding: 6,
          marginBottom: 24,
        }, shadowStyle({
          color: theme.colors.grey3, opacity: 0.8, radius: 24, offset: [0, 6],
        })]}>
          <View style={{ marginBottom: 6 }}>
            <View>
              <Text style={{ fontFamily: "Roboto-Medium", color: theme.colors.text }}>Категория:</Text>
              <Text style={{ fontFamily: "Roboto-Regular", color: theme.colors.text }}>{item.subcategory}</Text>
            </View>
            <View>
              <Text style={{ fontFamily: "Roboto-Medium", color: theme.colors.text }}>Описание:</Text>
              <Text style={{ fontFamily: "Roboto-Regular", color: theme.colors.text }}>{item.description.trim()}</Text>
            </View>
          </View>
          {likes &&
            // !auth().currentUser.isAnonymous && auth().currentUser.emailVerified && userdata.passportData.length !== 0 &&
            <>
              {auth().currentUser && !auth().currentUser.isAnonymous && auth().currentUser.emailVerified && userdata && userdata.passportData &&
                  <ShadowedView style={[{marginBottom: 6}, shadowStyle({
                color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
              })]}>
                <Button containerStyle={styles.cardBtnContainer} buttonStyle={styles.cardBtn}
                        titleStyle={{color: theme.colors.text}} title={"Чат с владельцем"} onPress={() => {
                  navigation.navigate('ProfileStack', {screen: 'OpenedChat', params: {otherUserId: item.ownerId}})
                }}/>
              </ShadowedView>}
              {auth().currentUser && !auth().currentUser.isAnonymous && auth().currentUser.emailVerified && userdata && userdata.passportData &&
              <ShadowedView style={[{ marginBottom: 6 }, shadowStyle({
                color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
              })]}>
                <Button containerStyle={styles.cardBtnContainer} buttonStyle={styles.cardBtn}
                        titleStyle={{ color: theme.colors.text }} title={"Запросить аренду"} />
              </ShadowedView>}
            </>
          }
          <ShadowedView style={[{ marginBottom: 6 }, shadowStyle({
            color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
          })]}>
            <Button containerStyle={styles.cardBtnContainer} buttonStyle={styles.cardBtn}
                    titleStyle={{ color: theme.colors.text }} title={"Назад"} onPress={() => navigation.goBack()}/>
          </ShadowedView>
          {editBtn &&
            <ShadowedView style={[{ marginBottom: 6 }, shadowStyle({
              color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
            })]}>
              <Button containerStyle={styles.cardBtnContainer} buttonStyle={styles.cardBtn}
                      titleStyle={{ color: theme.colors.text }} title={"Редактировать"} />
            </ShadowedView>}
          {deleteBtn &&
            <ShadowedView style={[{ marginBottom: 6 }, shadowStyle({
              color: theme.colors.grey3, opacity: 0.8, radius: 3, offset: [0, 0],
            })]}>
              <Button containerStyle={styles.cardBtnContainer} buttonStyle={styles.cardBtn}
                      titleStyle={{ color: theme.colors.text }} title={"Удалить"}
                      onPress={() => setDeleteModalOpen(true)} />
            </ShadowedView>}
        </ShadowedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OpenedItemCard;
