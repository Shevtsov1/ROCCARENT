import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, ListItem } from "@rneui/themed";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { launchImageLibrary } from "react-native-image-picker";
import { Input } from "@rneui/base";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const CreateAd = ({ theme }) => {


  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [fieldsData, setFieldsData] = useState({});

  const handleFieldsChange = (fieldName, value) => {
    setFieldsData(prevData => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

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

  const handleAddImageBtn = async () => {
    const options = {
      title: "Выберите изображение",
      cancelButtonTitle: "Отмена",
      takePhotoButtonTitle: "Выбрать изображение",
      quality: 1,
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      selectionLimit: 20,
    };
    const selectedImage = await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Пользователь отменил съемку фотографии");
      } else if (response.error) {
        console.log("Ошибка съемки фотографии:", response.error);
      }
    });
  };

  const NUM_ITEMS = 20;

  type Item = {
    key: string;
    label: string;
    height: number;
    width: number;
    backgroundColor: string;
  };

  const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = theme.colors.grey3;
    return {
      key: `item-${index}`,
      label: String(index) + "",
      height: 100,
      width: 60 + Math.random() * 40,
      backgroundColor,
    };
  });

  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator activeScale={0.9}>
        <View style={{ width: 72, height: 72, justifyContent: "center", alignItems: "center", marginEnd: 6 }}>
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[{ width: 72, height: 72, borderRadius: 5 },
              { backgroundColor: isActive ? `${theme.colors.grey1}3A` : item.backgroundColor },
            ]}
          >
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  const handleCategoryModal = (mode) => {
    setModalVisible(mode);
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
    setSelectedSubcategory(subcategory);
    setFieldsData({});
    handleCategoryModal(false);
  };

  const handleStartsDayChoose = async (value) => {
    if (value.type === "set") {
      if (fieldsData.dates) {
        const prevDates = fieldsData.dates;
        const newDates = { ...prevDates, startsDay: new Date(value.nativeEvent.timestamp) };
        handleFieldsChange("dates", newDates);
      } else {
        handleFieldsChange("dates", { startsDay: new Date(value.nativeEvent.timestamp) });
      }
    } else {
      await DateTimePickerAndroid.dismiss("date");
    }
  };

  const handleEndsDayChoose = async (value) => {
    if (value.type === "set") {
      if (fieldsData.dates) {
        const prevDates = fieldsData.dates;
        const newDates = { ...prevDates, endsDay: new Date(value.nativeEvent.timestamp) };
        handleFieldsChange("dates", newDates);
      } else {
        handleFieldsChange("dates", { endsDay: new Date(value.nativeEvent.timestamp) });
      }
    } else {
      await DateTimePickerAndroid.dismiss("date");
    }
  };

  const handleStartsDayModalOpen = () => {
    const currentDate = new Date();  // Получаем текущую дату
    const currentYear = currentDate.getFullYear();  // Получаем текущий год
    const currentMonth = currentDate.getMonth();  // Получаем текущий год
    const currentDay = currentDate.getDate();  // Получаем текущий год
    const desiredYear = currentYear + 2;  // Например, добавляем 1 год
    const maximumDate = new Date(desiredYear, currentMonth, currentDay - 1);  // 1 января желаемого года
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: "date",
      display: "spinner",
      onChange: handleStartsDayChoose,
      maximumDate: fieldsData.dates ? fieldsData.dates.endsDay && fieldsData.dates.endsDay : maximumDate,
      minimumDate: new Date(),
    });
  };

  const handleEndsDayModalOpen = () => {
    const currentDate = new Date();  // Получаем текущую дату
    const currentYear = currentDate.getFullYear();  // Получаем текущий год
    const currentMonth = currentDate.getMonth();  // Получаем текущий год
    const currentDay = currentDate.getDate();  // Получаем текущий год
    const desiredYear = currentYear + 2;  // Например, добавляем 1 год
    const maximumDate = new Date(desiredYear, currentMonth, currentDay);  // 1 января желаемого года
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: "date",
      display: "spinner",
      onChange: handleEndsDayChoose,
      minimumDate: fieldsData.dates ? fieldsData.dates.startsDay && fieldsData.dates.startsDay : new Date(),
      maximumDate: maximumDate,
    });
  };

  const styles = StyleSheet.create({

    defaultFieldsContainer: {},
    listingTitleContainer: {
      marginVertical: 12,
    },
    listingTitleFooterText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey3,
    },
    listingTitleInputContainer: {
      height: 42,
      paddingHorizontal: 0,
    },
    listingTitleInputInputContainer: {
      height: 36,
      borderColor: theme.colors.grey3,
      marginHorizontal: 0,
      paddingHorizontal: 0,
    },
    listingTitleInput: {
      marginHorizontal: 0,
      paddingHorizontal: 0,
      borderRadius: 5,
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
    },


    listingDescriptionContainer: {
      borderWidth: 1,
      borderColor: theme.colors.grey3,
      borderRadius: 5,
      backgroundColor: `${theme.colors.grey3}5A`,
      height: 120,
    },
    listingDescriptionText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
    },


    listingPriceContainer: {},


    listingDatesContainer: {
      marginTop: 12,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    }, listingDatesBtn: {
      width: "49%",
      borderBottomWidth: 1,
      borderColor: theme.colors.grey3,
    },


    listingGeoContainer: {},


    submitBtnViewContainer: {
      marginHorizontal: 12,
    },
    submitBtnContainer: {
      borderRadius: 5,
    },
    submitBtn: {
      borderRadius: 5,
      backgroundColor: theme.colors.accent,
    },
    submitBtnText: {
      fontFamily: "Roboto-Bold",
      fontSize: 16,
      color: theme.colors.accentText,
    },

    /* BODY BEGIN */

    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, header: {
      flex: 1,
      height: 60,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      marginBottom: 12,
    }, headerMainText: {
      fontFamily: "Roboto-Medium",
      fontSize: 18,
      color: theme.colors.accentText,
    }, headerCancelText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, imagesContainer: {
      flex: 1,
      height: 144,
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      paddingHorizontal: 12,
    }, imagesHeaderContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    }, imagesHeaderMainText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
      alignSelf: "center",
    }, imagesHeaderInfoText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey1,
      alignSelf: "center",
    }, imagesPickerContainer: {
      flex: 2,
      flexDirection: "row",
    }, imagesAddImageBtnContainer: {
      borderRadius: 5,
      marginEnd: 6,
    }, imagesAddImageBtn: {
      borderColor: theme.colors.accent,
      borderWidth: 1,
      borderRadius: 5,
      width: 72, height: 72,
      backgroundColor: theme.colors.grey3,
    }, imagesFooterContainer: {
      flex: 1,
    },
    categoriesModalBtnContainer: {
      marginHorizontal: 12,
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderColor: theme.colors.grey3,
    }, categoriesModalBtn: {
      flexDirection: "row",
      justifyContent: "space-between",
    }, categoriesModalBtnText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.text,
    }, categoriesModal: {
      backgroundColor: theme.colors.background,
    }, categoriesModalHeader: {
      height: 60,
      paddingHorizontal: 12,
      alignItems: "center",
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
    }, categoriesModalHeaderMainText: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, categoriesModalHeaderBackBtnText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
      alignSelf: "center",
    }, categoriesModalCategoryName: {
      fontFamily: "Roboto-Medium",
      fontSize: 16,
      color: theme.colors.text,
    }, categoriesModalSubcategoryName: {
      marginStart: 12,
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.text,
    }, categoryFields: {
      marginHorizontal: 12,
    },

    /* BODY END */
  });

  useEffect(() => {
    console.log(fieldsData);
  }, [fieldsData]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={{ marginBottom: 12 }}>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.headerMainText}>Новое объявление</Text>
            <TouchableOpacity onPress={() => setFieldsData({})}>
              <Text numberOfLines={1} style={styles.headerCancelText}>Очистить</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imagesContainer}>
            <View style={styles.imagesHeaderContainer}>
              <Text style={styles.imagesHeaderMainText}>Добавьте фотографии</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Icon style={{ marginEnd: 6 }} type={"ionicon"} name={"image"} size={20} color={theme.colors.grey1} />
                <Text style={styles.imagesHeaderInfoText}>0 из 20</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", paddingVertical: 12 }}>
              <Button containerStyle={styles.imagesAddImageBtnContainer} buttonStyle={styles.imagesAddImageBtn}
                      onPress={handleAddImageBtn}>
                <Icon type={"ionicon"} name={"add-outline"} size={30} color={theme.colors.accent}></Icon>
              </Button>
              <DraggableFlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                animationConfig={{ clamp: 1 }}
                data={data}
                onDragEnd={({ data }) => setData(data)}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                containerStyle={{ flex: 1 }}
              />
            </View>
            <View style={styles.imagesFooterContainer}>
              <Text style={[styles.imagesHeaderInfoText, { alignSelf: "flex-start" }]}>Первое изображение будет помещено
                на обложку</Text>
            </View>
          </View>
          <View style={styles.categoriesModal}>
            <View style={styles.categoriesModalBtnContainer}>
              <TouchableOpacity onPress={() => handleCategoryModal(true)} style={styles.categoriesModalBtn}>
                {selectedSubcategory ? (<Text style={styles.categoriesModalBtnText}>{selectedSubcategory}</Text>) : (
                  <Text style={styles.categoriesModalBtnText}>Выберите категорию</Text>)}
                <Icon type={"ionicon"} name={"chevron-down"} color={theme.colors.text} size={18} />
              </TouchableOpacity>
            </View>
            <Modal visible={isModalVisible}>
              <ScrollView style={styles.categoriesModal}>
                <View style={styles.categoriesModalHeader}><Text style={styles.categoriesModalHeaderMainText}>
                  Выберите категорию
                </Text><TouchableOpacity onPress={handleCategoryModal}>
                  <Text style={styles.categoriesModalHeaderBackBtnText}>Отмена</Text>
                </TouchableOpacity></View>
                {categories.map((category) => (
                  <ListItem.Accordion
                    containerStyle={{ backgroundColor: theme.colors.background }}
                    key={category.name}
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.categoriesModalCategoryName}>{category.name}</ListItem.Title>
                      </ListItem.Content>
                    }
                    icon={<Icon type={"ionicon"} name={"chevron-down"} color={theme.colors.text} size={18} />}
                    isExpanded={selectedCategory === category.name}
                    onPress={() => handleCategoryPress(category.name)}
                  >
                    {selectedCategory === category.name &&
                      category.subCategories.map((subCategory, id) => {
                        return (
                          <ListItem key={id} containerStyle={{ backgroundColor: theme.colors.background }}
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
            </Modal>
          </View>
          {selectedSubcategory &&
            <>
              <View style={styles.categoryFields}>
                <View style={styles.defaultFieldsContainer}>
                  <View style={styles.listingTitleContainer}>
                    <Input containerStyle={styles.listingTitleInputContainer}
                           inputContainerStyle={styles.listingTitleInputInputContainer}
                           inputStyle={styles.listingTitleInput}
                           placeholder={"Название товара"}
                           placeholderTextColor={theme.colors.grey3}
                           maxLength={50}
                           value={fieldsData.title}
                           onChangeText={value => handleFieldsChange("title", value)}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                      <Text numberOfLines={1} style={styles.listingTitleFooterText}>0/50</Text>
                    </View>
                  </View>
                  <View style={{ marginHorizontal: 12, marginBottom: 12 }}>
                    <View style={styles.listingDescriptionContainer}>
                      <TextInput placeholder="Описание" placeholderTextColor={theme.colors.grey3}
                                 style={styles.listingDescriptionText} maxLength={1000} multiline
                                 value={fieldsData.description}
                                 onChangeText={value => handleFieldsChange("description", value)} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                      <Text numberOfLines={1} style={styles.listingTitleFooterText}>0/1000</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={styles.listingPriceContainer}>
                    <Input containerStyle={styles.listingTitleInputContainer}
                           inputContainerStyle={styles.listingTitleInputInputContainer}
                           inputStyle={styles.listingTitleInput}
                           placeholder={"Цена"}
                           placeholderTextColor={theme.colors.grey3}
                           inputMode={"numeric"}
                           maxLength={7}
                           value={fieldsData.price}
                           rightIcon={<Text style={styles.listingTitleInput}>р./сут.</Text>}
                           onChangeText={value => handleFieldsChange("price", value)}
                    />
                  </View>
                  <View style={styles.listingDatesContainer}>
                    <TouchableOpacity style={styles.listingDatesBtn} onPress={handleStartsDayModalOpen}>
                      {(fieldsData.dates && fieldsData.dates.startsDay) ?
                        <Text>{fieldsData.dates.startsDay.getDate()}-
                          {fieldsData.dates.startsDay.getMonth()+1}-
                          {fieldsData.dates.startsDay.getFullYear()}</Text> :
                        <Text>С</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listingDatesBtn} onPress={handleEndsDayModalOpen}>
                      {(fieldsData.dates && fieldsData.dates.endsDay) ?
                        <Text>{fieldsData.dates.endsDay.getDate()}-
                          {fieldsData.dates.endsDay.getMonth()+1}-
                          {fieldsData.dates.endsDay.getFullYear()}</Text> :
                        <Text>По</Text>}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.listingGeoContainer}>
                    <Text>geo</Text>
                  </View>
                </View>
                <View style={styles.submitBtnViewContainer}>
                  <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>Подать объявление</Text>
                  </Button>
                </View>
              </View>
              {selectedSubcategory === "Мотоциклы и скутеры" && <View></View>}
            </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAd;
