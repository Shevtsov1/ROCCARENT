import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Carousel from "react-native-reanimated-carousel";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/base";
import { AppContext } from "../../App";
import RunningText from "./runningText";

const OpenedItemCard = ({ theme }) => {

    const { userdata } = useContext(AppContext);

    const route = useRoute();

    const { item, likes, editBtn, deleteBtn } = route.params;

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

    const handleProgressChange = (offsetProgress, absoluteProgress) => {
        if (Number.isInteger(absoluteProgress)) {
            setCurrentImageIndex(absoluteProgress)
        }
    };

    const styles = StyleSheet.create({
        imagesContainer: {
            height,
            marginBottom: 12,
        }, imageCounterContainer: {
            width: 36,
            height: 36.6,
            alignSelf: "flex-start",
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
            borderTopEndRadius: 5,
            borderBottomEndRadius: 5,
            backgroundColor: `${theme.colors.background}AA`,
        }, imageCounter: {
            fontFamily: 'Roboto-Bold',
            fontSize: 15,
            color: theme.colors.accent,
        },
    });

    const renderImageCounter = () => {
        const totalImages = listingImages.length;
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
          <RunningText text={'hello pupkin world hello pupkin world hello pupkin world hello pupkin world'}/>
          <View style={styles.imagesContainer}>
              <Carousel
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
              >
                  {likes &&
                    <FastImage
                      source={userdata && userdata.favoriteListings && userdata.favoriteListings.includes(item.listingId) ? require("../assets/images/save.png") : require("../assets/images/save-outline.png")}
                      style={{width: 24, height: 24}} tintColor={theme.colors.accent}
                      resizeMode={FastImage.resizeMode.contain}/>}
                  {deleteBtn && <View><Icon type={'ionicon'} name={'trash'} size={24} color={theme.colors.accent}/></View>}
              </TouchableOpacity>
              {editBtn && <TouchableOpacity style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  padding: 6,
                  borderTopEndRadius: 5,
                  borderBottomEndRadius: 5,
                  backgroundColor: `${theme.colors.background}AA`,
              }}><Icon type={'ionicon'} name={'pencil'} size={24} color={theme.colors.accent}/></TouchableOpacity>}
          </View>
      </SafeAreaView>
    );
};

export default OpenedItemCard;
