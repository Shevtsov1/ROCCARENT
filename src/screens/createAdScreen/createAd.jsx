import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, ListItem } from "@rneui/themed";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { launchImageLibrary } from "react-native-image-picker";
import CategoryFields from "./components/categoryFields";

const CreateAd = ({ theme }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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
    handleCategoryModal(false);
  };

  const styles = StyleSheet.create({

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
      padding: 6,
      borderRadius: 5,
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

    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.headerMainText}>Новое объявление</Text>
          <TouchableOpacity>
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
              <View style={{ backgroundColor: `${theme.colors.grey1}5A`, borderRadius: 100 }}>
                <Icon type={"ionicon"} name={"add-outline"} size={30} color={theme.colors.accent}></Icon>
              </View>
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
                        <ListItem key={id} containerStyle={{ backgroundColor: theme.colors.background}}
                                  onPress={() => handleSubcategoryPress(subCategory)}>
                          <ListItem.Content>
                            <ListItem.Title style={styles.categoriesModalSubcategoryName}>{subCategory}</ListItem.Title>
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
        <View style={styles.categoryFields}>
          <CategoryFields category={selectedCategory} subcategory={selectedSubcategory}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAd;
