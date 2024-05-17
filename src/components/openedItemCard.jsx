import React, {useEffect, useState} from "react";
import {View, StyleSheet, Dimensions, Text} from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Carousel from "react-native-reanimated-carousel";
import FastImage from "react-native-fast-image";
import {SafeAreaView} from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';

const OpenedItemCard = ({ theme }) => {

    const route = useRoute();

    const { item, likes, editBtn, deleteBtn } = route.params;

    const [listingImages, setListingImages] = useState([]);
    const screenWidth = Dimensions.get("window").width;
    const width = screenWidth;
    const height = screenWidth * 1.3;
    const carouselRef = React.useRef('ICarouselInstance');

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

    const styles = StyleSheet.create({
        imagesContainer: {
            height: 'auto',
        },
    });

    return (
        <SafeAreaView>
            <View style={styles.imagesContainer}>
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    width={width}
                    height={height}
                    data={listingImages}
                    renderItem={({item}) => (
                        <FastImage
                            source={{uri: item}}
                            style={{width: "100%", height: "100%"}}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default OpenedItemCard;
