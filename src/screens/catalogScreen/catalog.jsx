import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CardsGrid from "../../components/cardsGrid";
import firestore, {Filter} from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {AppContext} from "../../../App";
import {SafeAreaView} from "react-native-safe-area-context";
import {Badge, Icon, Overlay, SearchBar} from "@rneui/base";
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
    const [searchString, setSearchString] = useState('');
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
            console.log(selectedSubcategory)
            await loadUserdata();
            await loadListingList(selectedSubcategory);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    const handleSearchStringChange = (value) => {
        setSearchString(value);
    }

    const handleSearchStringClear = () => {
        setSearchString('')
    }

    const loadListingList = async () => {
        try {
            let newListingsArr = [];
            let listingsData;
            {selectedSubcategory ?
                listingsData = await firestore().collection("listings")
                    .where('subcategory', '==', selectedSubcategory)
                    .limit(500)
                    .get()
                : listingsData = await firestore().collection("listings").limit(500).get();
            }
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

    const handleSubcategoryPress = async (subcategory) => {
        if (selectedSubcategory !== subcategory) {
            setSelectedSubcategory(subcategory);
        }
        try {
            let newListingsArr = [];
            const listingsData = await firestore().collection("listings")
                .where('subcategory', '==', subcategory)
                .limit(500)
                .get();
            if (listingsData) {
                listingsData.docs.forEach(doc => {
                    if (doc.data().ownerId !== auth().currentUser.uid) {
                        newListingsArr.push(doc.data());
                    }
                });
                setListings(newListingsArr);
            }
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
        handleCategoryModal(false);
    };

    const handleUnfilter = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    }

    const handleSearchByString = async () => {
        if (searchString.trim()) {
            const snapshot = await firestore()
                .collection('listings')
                .where(
                    Filter.or(
                        Filter.and(Filter('title', '==', 'Tim'), Filter('email', '==', 'tim@example.com')),
                        Filter.and(Filter('user', '==', 'Dave'), Filter('email', '==', 'dave@example.com')),
                    ),
                )
                .get();
            console.log(snapshot);
        }
    }

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

    const ClearIcon = () => {
        return <TouchableOpacity onPress={handleSearchStringClear}>
            <Icon type={'ionicon'} name={'close'} color={theme.colors.accent} />
        </TouchableOpacity>;
    };

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
                    inputStyle={{fontFamily: 'Roboto-Medium', color: theme.colors.text}}
                    blurOnSubmit
                    searchIcon={<Icon type={'ionicon'} name={'search'} color={theme.colors.accent}/>}
                    clearIcon={<ClearIcon/>}
                    placeholder="Поиск"
                    clearButtonMode={"while-editing"}
                    onChangeText={handleSearchStringChange}
                    value={searchString}
                    onSubmitEditing={handleSearchByString}
                />
                <View style={{alignSelf: 'center', marginEnd: 6}}>
                    <TouchableOpacity onPress={() => handleCategoryModal(true)}>
                        <Icon type={'ionicon'} name={'filter'} color={theme.colors.accent} size={24}/>
                    </TouchableOpacity>
                    {selectedSubcategory && <Badge
                        status="success"
                        containerStyle={{position: 'absolute', bottom: 24, left: 24}}
                    />}
                </View>
                {selectedSubcategory && <TouchableOpacity style={{alignSelf: 'center', marginEnd: 6,}}
                                                          onPress={handleUnfilter}>
                    <Icon type={'ionicon'} name={'close'} color={theme.colors.accent}/>
                </TouchableOpacity>}
                <Overlay isVisible={filtersModalVisible} overlayStyle={{width: '100%', height: '100%', padding: 0}}
                         onBackdropPress={() => handleCategoryModal(false)}>
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
