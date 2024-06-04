import React, {useContext, useEffect, useState} from "react";
import { StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import {AppContext} from "../../../App";
import {Icon} from "@rneui/themed";

const Main = ({theme, navigation}) => {

    const {userdata, loadUserdata} = useContext(AppContext);

    const [listingsLoading, setListingsLoading] = useState(true);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const load = async () => {
            await loadUserdata();
            await loadListingList();
        };
        load().then();
    }, []);

    const handleReloadBtn = async () => {
        try {
            await loadUserdata();
            await loadListingList();
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    const loadListingList = async () => {
        try {
            let newListingsArr = [];
            const listingsData = await firestore().collection("listings").limit(50).get();
            if (listingsData) {
                listingsData.forEach(doc => {
                    if (doc.data().ownerId !== auth().currentUser.uid) {
                        newListingsArr.push(doc.data());
                    }
                });
                for (let i = newListingsArr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newListingsArr[i], newListingsArr[j]] = [newListingsArr[j], newListingsArr[i]];
                }
                setListings(newListingsArr);
            }
        } catch (error) {
            console.error("Error fetching documents: ", error);
        } finally {
            setListingsLoading(false);
        }
    };

    const styles = StyleSheet.create({
        body: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
    });
    //
    // const headerComponent = () => (
    //
    // )
    //
    // const footerComponent = () => (
    //
    // )

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.body}>
                <View style={{
                    height: 60,
                    backgroundColor: theme.colors.background,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 6,
                }}>
                    <View style={{width: 26,}}>

                    </View>
                    <FastImage source={require('../../assets/images/logo/logo.png')} style={{width: 60, height: 60}}
                               resizeMode={FastImage.resizeMode.contain}/>
                    {auth().currentUser && !auth().currentUser.isAnonymous && auth().currentUser.emailVerified && userdata && userdata.passportData ?
                        <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => navigation.navigate('ProfileStack', {screen: 'Chat'})}>
                            <Icon type={"ionicon"} name={"chatbubbles-outline"} size={26} color={theme.colors.accent}/>
                        </TouchableOpacity> : <View style={{width: 26,}}></View>}
                </View>
                <>
                    {listings && (
                        <View
                            style={{
                                width: "100%",
                                height: '100%',
                                backgroundColor: theme.colors.background,
                                borderRadius: 15,
                                alignItems: "center",
                                justifyContent: listingsLoading ? "center" : "flex-start",
                            }}
                        >
                                <CardsGrid
                                theme={theme}
                                items={listings}
                                likes
                                screen={"Main"}
                                reloadFunction={() => handleReloadBtn()}
                                authHint
                                verifyHint={userdata && !userdata.passportData}
                                listingsLoading={listingsLoading}
                                // deals
                            />
                        </View>
                    )}
                </>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Main;
