import React, {useContext, useEffect, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CardsGrid from "../../components/cardsGrid";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {AppContext} from "../../../App";
import {SafeAreaView} from "react-native-safe-area-context";
import {Icon, Overlay, SearchBar} from "@rneui/base";
import {ListItem} from "@rneui/themed";

const Catalog = ({theme}) => {

    const {loadUserdata} = useContext(AppContext);

    const categories = [
        {
            name: "Автомобили и транспорт",
            subCategories: ["Легковые автомобили", "Грузовики и коммерческий транспорт",
                "Мотоциклы и скутеры", "Велосипеды", "Яхты и лодки", "Автодома и прицепы"],
        },
        {
            name: "Недвижимость",
            subCategories: ["Квартиры", "Дома и коттеджи",
                "Коммерческая недвижимость", "Отпускные дома и виллы", "Земельные участки"],
        },
        {
            name: "Электроника",
            subCategories: ["Телефоны и планшеты", "Компьютеры и ноутбуки",
                "Телевизоры и аудио-видео техника", "Фото- и видеокамеры", "Игровые приставки и аксессуары"],
        },
        {
            name: "Спорт и отдых",
            subCategories: ["Спортивные снаряды и инвентарь", "Велосипеды и аксессуары",
                "Палатки и снаряжение для кемпинга", "Горнолыжное и сноубордическое снаряжение", "Рыболовные снасти"],
        },
        {
            name: "Мода и аксессуары",
            subCategories: ["Одежда и обувь", "Сумки и аксессуары",
                "Украшения и часы", "Костюмы и наряды для особых случаев", "Косметика и парфюмерия"],
        },
        {
            name: "Дом и сад",
            subCategories: ["Мебель и интерьер", "Бытовая техника",
                "Садовый инструмент и оборудование", "Декор и освещение", "Газоны и садовые участки"],
        },
    ];

    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
            const listingsData = await firestore().collection("listings").get();
            if (listingsData) {
                listingsData.forEach(doc => {
                    if (doc.data().ownerId !== auth().currentUser.uid) {
                        newListingsArr.push(doc.data());
                    }
                });
                setListings(newListingsArr);
            }
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    const handleCategoryModal = (mode) => {
        setFiltersModalVisible(mode);
    };

    const handleCategoryPress = (category) => {
        if (selectedCategory !== category) {
            setSelectedCategory(category);
            setSelectedSubcategory("");
        } else {
            setSelectedCategory("");
        }
    };

    const handleSubcategoryPress = (subcategory) => {
        if (selectedSubcategory !== subcategory) {
            setSelectedSubcategory(subcategory);
        }
        handleCategoryModal(false);
    };

    const styles = StyleSheet.create({

        /* BODY BEGIN */

        body: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
        },

        /* BODY END */
    });

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flexDirection: 'row', backgroundColor: theme.colors.background}}>
                <SearchBar
                    containerStyle={{
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        borderTopWidth: 0,
                        borderBottomWidth: 0
                    }}
                    inputContainerStyle={{
                        borderColor: theme.colors.accent,
                        borderRadius: 5,
                        borderBottomWidth: 2,
                        borderWidth: 2,
                        backgroundColor: `${theme.colors.background}9A`
                    }}
                    blurOnSubmit
                    searchIcon={<Icon type={'ionicon'} name={'search'} color={theme.colors.accent}/>}
                    clearIcon={<Icon type={'ionicon'} name={'close'} color={theme.colors.accent}/>}
                    placeholder="Поиск"
                    // onChangeText={updateSearch}
                    // value={search}
                />
                <TouchableOpacity style={{alignSelf: 'center', marginEnd: 6,}}
                                  onPress={() => handleCategoryModal(true)}>
                    <Icon type={'ionicon'} name={'filter'} color={theme.colors.accent}/>
                </TouchableOpacity>
                <Overlay isVisible={filtersModalVisible} overlayStyle={{width: '100%', height: '100%', padding: 0}} onBackdropPress={() => handleCategoryModal(false)}>
                    <ScrollView style={{backgroundColor: theme.colors.background}}>
                        <View style={{
                            height: 60,
                            paddingHorizontal: 12,
                            alignItems: "center",
                            backgroundColor: theme.colors.accent,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}><Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: theme.colors.accentText,
                            alignSelf: "center",
                        }}>
                            Выберите категорию
                        </Text><TouchableOpacity onPress={handleCategoryModal}>
                            <Text style={{
                                fontFamily: "Roboto-Regular",
                                fontSize: 16,
                                color: theme.colors.accentText,
                                alignSelf: "center",
                            }}>Отмена</Text>
                        </TouchableOpacity></View>
                        {categories.map((category) => (
                            <ListItem.Accordion
                                containerStyle={{backgroundColor: theme.colors.background}}
                                key={category.name}
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title style={{
                                            fontFamily: "Roboto-Medium",
                                            fontSize: 16,
                                            color: theme.colors.text,
                                        }}>{category.name}</ListItem.Title>
                                    </ListItem.Content>
                                }
                                icon={<Icon type={"ionicon"} name={"chevron-down"} color={theme.colors.text}
                                            size={18}/>}
                                isExpanded={selectedCategory === category.name}
                                onPress={() => handleCategoryPress(category.name)}
                            >
                                {selectedCategory === category.name &&
                                    category.subCategories.map((subCategory, id) => {
                                        return (
                                            <ListItem key={id}
                                                      containerStyle={{backgroundColor: theme.colors.background}}
                                                      onPress={() => handleSubcategoryPress(subCategory)}>
                                                <ListItem.Content>
                                                    <ListItem.Title
                                                        style={styles.categoriesModalSubcategoryName}>{subCategory}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        );
                                    })
                                }
                            </ListItem.Accordion>
                        ))}
                    </ScrollView>
                </Overlay>
            </View>
            <View style={styles.body}>
                <View
                    style={{
                        width: "100%",
                        backgroundColor: theme.colors.background,
                        borderRadius: 15,
                        alignItems: "center",
                    }}
                >
                    <CardsGrid
                        theme={theme}
                        items={listings}
                        likes
                        screen={"Main"}
                        reloadFunction={() => handleReloadBtn()}
                        authHint
                        // deals
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Catalog;
