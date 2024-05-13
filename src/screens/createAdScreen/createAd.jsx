import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FAB, Icon, ListItem } from "@rneui/themed";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { launchImageLibrary } from "react-native-image-picker";
import { Input, Skeleton } from "@rneui/base";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import Geolocation from "@react-native-community/geolocation";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";
import LoadingScreen from "../../components/loadingScreen";
import auth from "@react-native-firebase/auth";
import { AppContext } from "../../../App";
import FastImage from "react-native-fast-image";
import { verifyNewListingDataBeforeCreating, getAddressName, translateAddressName } from "./components/categoryFields";
import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
import ImageResizer from "@bam.tech/react-native-image-resizer";

const CreateAd = ({ theme, navigation }) => {

  const { userdata } = useContext(AppContext);

  const [listingUploading, setListingUploading] = useState(false);

  const [isSubmitBtnEnabled, setIsSubmitBtnEnabled] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [fieldsData, setFieldsData] = useState({});

  const [selectedImages, setSelectedImages] = useState([]);
  const [isAddingImageInProcess, setIsAddingImageInProcess] = useState(false);

  const [userCoordinates, setUserCoordinates] = useState({
    latitude: 53.9045, // Широта Минска
    longitude: 27.5615, // Долгота Минска
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [markerCoordinates, setMarkerCoordinates] = useState(userCoordinates);
  const [selectedCoordinates, setSelectedCoordinates] = useState({});
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const mapRef = useRef(null);

  const [isMapOpen, setIsMapOpen] = useState(false);

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

  const handleCleanBtn = () => {
    setFieldsData({});
    setSelectedImages([]);
    setSelectedCoordinates({});
  };

  const handleAddImageBtn = async () => {
    setIsAddingImageInProcess(true);
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
      selectionLimit: 20 - selectedImages.length,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log("Пользователь отменил съемку фотографии");
        setIsAddingImageInProcess(false);
        return;
      }

      if (response.error) {
        console.log("Ошибка съемки фотографии:", response.error);
        setIsAddingImageInProcess(false);
        return;
      }

      if (response.assets) {
        const assets = response.assets;
        const newSelectedImages = []; // Создаем новый массив для добавления объектов
        let freePositionInSelectedImages = 20 - selectedImages.length;

        assets.forEach((image) => {
          const fileName = image.fileName;
          const fileSize = image.fileSize;
          const isDuplicate = selectedImages.some(
            (selectedImage) => Object.keys(selectedImage)[0] === fileName,
          );

          if (!isDuplicate && freePositionInSelectedImages > 0) {
            const newSelectedImage = {
              [fileName]: image.uri,
              fileSize: fileSize,
            };

            // Проверка на совпадение и добавление в newSelectedImages
            const isSameFileName = selectedImages.some(
              (selectedImage) => Object.keys(selectedImage)[0] === fileName,
            );

            if (!isSameFileName) {
              newSelectedImages.push(newSelectedImage); // Добавляем новый объект в newSelectedImages
            }
            freePositionInSelectedImages--;
          }
        });

        setSelectedImages([...selectedImages, ...newSelectedImages]); // Обновляем selectedImages
      }
    } catch (error) {
      console.log("Ошибка выбора изображения:", error);
    }
    setIsAddingImageInProcess(false);
  };

  const handleDeleteImageBtn = (image, uri) => {
    const updatedImages = selectedImages.filter((selectedImage) => {
      const imageUrl = Object.values(selectedImage)[0];
      return Object.keys(selectedImage)[0] !== image || imageUrl !== uri;
    });
    setSelectedImages(updatedImages);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const selectedImage = Object.keys(item)[0];
    const selectedImageUri = item[selectedImage];
    const key = Object.keys(item)[0];
    return (
      <ScaleDecorator activeScale={0.9} key={key}>
        <View style={{ width: 72, height: 72, justifyContent: "center", alignItems: "center", marginEnd: 6 }}>
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[
              { width: 72, height: 72, borderRadius: 5 },
              { backgroundColor: isActive ? `${theme.colors.grey1}3A` : item.backgroundColor },
            ]}
          >
            {selectedImage && (
              <>
                <FastImage
                  source={{ uri: selectedImageUri }}
                  style={{ width: 72, height: 72, borderRadius: 5 }}
                />
                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }}
                                  onPress={() => handleDeleteImageBtn(selectedImage, selectedImageUri)}><Icon
                  type={"ionicon"}
                  name={"close"}
                  size={24}
                  color={theme.colors.accent} /></TouchableOpacity>
              </>
            )}
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
    if (selectedSubcategory !== subcategory) {
      setSelectedSubcategory(subcategory);
      setFieldsData({});
    }
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

  const handleLocation = async () => {
    const checkEnabled: boolean = await isLocationEnabled();
    if (!checkEnabled) {
      const enableResult = await promptForEnableLocationIfNeeded();
      if (enableResult === "enabled" || enableResult === "already-enabled") {
        checkLocationPermission().then((hasPermission) => {
          if (hasPermission) {
            getCurrentUserLocation().then();
          } else {
            console.log("Location permission denied");
          }
        });
      }
    } else {
      checkLocationPermission().then((hasPermission) => {
        if (hasPermission) {
          getCurrentUserLocation().then();
        } else {
          console.log("Location permission denied");
        }
      });
    }
  };

  const checkLocationPermission = () => {
    return new Promise((resolve, reject) => {
      Geolocation.requestAuthorization(
        () => {
          // Разрешение предоставлено
          resolve(true);
        },
        (error) => {
          // Ошибка при запросе разрешения
          console.log("Error requesting location permission:", error);
          resolve(false);
        },
      );
    });
  };

  const getCurrentUserLocation = async () => {
    await Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      setUserCoordinates({
        ...userCoordinates,
        latitude: crd.latitude,
        longitude: crd.longitude,
      });
      setMarkerCoordinates({
        ...markerCoordinates, latitude: crd.latitude,
        longitude: crd.longitude,
      });
    });
  };

  const handleOpenMap = async () => {
    setUserLocationLoading(true);
    try {
      await handleLocation().then();
    } catch (error) {
      console.log(error);
    }
    setUserLocationLoading(false);
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setSelectedCoordinates({});
    setIsMapOpen(false);
  };

  const handleMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([userCoordinates], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoordinates({
      ...markerCoordinates,
      latitude: latitude,
      longitude: longitude,
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    const apiKey = "6641df921a9da299602964nvkdd5cad";
    const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return (data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveLocation = async () => {
    const selectedLocationData = await reverseGeocode(markerCoordinates.latitude, markerCoordinates.longitude);
    setSelectedCoordinates(selectedLocationData);
    setIsMapOpen(false);
  };

  // const resizeImages = async () => {
  //   try {
  //     let newSelectedImages = [];
  //     selectedImages.map(async (selectedImage) => {
  //       const fileSize = selectedImage.fileSize;
  //       let compressionQuality;
  //       if (fileSize > 10 * 1024 && fileSize < 5 * 1024 * 1024) {
  //         compressionQuality = 100;
  //       } else if (fileSize >= 5 * 1024 * 1024) {
  //         compressionQuality = Math.floor((5 * 1024 * 1024 / fileSize) * 100);
  //         compressionQuality = Math.max(10, Math.min(100, compressionQuality));
  //       }
  //
  //       if (!compressionQuality) {
  //         ToastAndroid.show("Размер изображений должен быть от 100 кБ до 5 МБ", 5000);
  //         return;
  //       }
  //
  //       if (compressionQuality) {
  //         // Resize the image
  //         const resizedImage = await ImageResizer.createResizedImage(
  //           Object.values(selectedImage)[0],
  //           "JPEG",
  //           compressionQuality // compression quality
  //         );
  //         newSelectedImages.push(resizedImage);
  //       }
  //     });
  //     setSelectedImages(newSelectedImages);
  //   } catch (error) {
  //     console.log("Error resizing image:", error);
  //   }
  // };

  const handleCreateListing = async () => {
    setListingUploading(true);
    const listingId = uuid.v4();
    // await resizeImages();
    const mainImage = Object.values(selectedImages[0])[0];
    const otherImages = [];
    const mainImageRef = storage().ref(`listings/${listingId}/mainImage/`);
    const otherImagesRef = storage().ref(`listings/${listingId}/otherImages`);
    await mainImageRef.putFile(mainImage);
    selectedImages.slice(1,).forEach((selectedImage) => {
      otherImages.push(selectedImage);
    })
    for (const image of otherImages) {
      try {
        await otherImagesRef.child(Object.keys(image)[0]).putFile(Object.values(image)[0]);
        console.log(`Изображение ${Object.keys(image)[0]} успешно загружено`);
      } catch (error) {
        console.log(`Ошибка загрузки изображения ${image.fileName}:`, error);
      }
    }
    const mainImageUrl = await mainImageRef.getDownloadURL();
    const listingData = {
      ...fieldsData,
      selectedCoordinates,
      mainImageUrl: mainImageUrl,
      ownerId: auth().currentUser.uid,
    };
    await firestore().collection("listingCategories").doc(selectedCategory).collection(selectedSubcategory).doc(listingId).set(listingData);

    const doc = await firestore().collection('users').doc(auth().currentUser.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData.hasOwnProperty("listings")) {
          await firestore().collection('users').doc(auth().currentUser.uid).update({listings: firestore.FieldValue.arrayUnion(listingId)})
        } else {
          await firestore().collection('users').doc(auth().currentUser.uid).update({listings: [listingId]})
        }
      } else {
        console.log("Пользователь не найден");
      }
    handleCleanBtn();
    setListingUploading(false);
    navigation.navigate('Main');
  };

  useEffect(() => {
    verifyNewListingDataBeforeCreating({
      theme: theme,
      selectedImages: selectedImages,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      fieldsData: fieldsData,
      selectedCoordinates: selectedCoordinates,
      setIsSubmitBtnEnabled,
    });

  }, [selectedImages, selectedCategory, selectedSubcategory, fieldsData, selectedCoordinates]);


  const styles = StyleSheet.create({

    defaultFieldsContainer: {},
    listingTitleContainer: {
      marginVertical: 12,
    },
    listingTitleFooterText: {
      fontFamily: "Roboto-Regular",
      fontSize: 14,
      color: theme.colors.grey2,
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
      borderColor: theme.colors.greyOutline,
      borderRadius: 5,
      backgroundColor: theme.colors.grey3,
      height: 120,
      marginBottom: 6,
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
    }, listingDatesBtn: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "47%",
      borderBottomWidth: 1,
      borderColor: theme.colors.grey3,
    },


    listingGeoContainer: {
      marginVertical: 12,
    },


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
      color: theme.colors.grey2,
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
      fontSize: 16,
      color: theme.colors.text,
    }, categoryFields: {
      marginHorizontal: 12,
    },

    /* BODY END */
  });

  if (userLocationLoading || listingUploading) {
    return (
      <LoadingScreen theme={theme} />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={{ marginBottom: 12 }}>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.headerMainText}>Новое объявление</Text>
            {auth().currentUser && !auth().currentUser.isAnonymous && userdata.passportData && auth().currentUser.emailVerified &&
              <TouchableOpacity onPress={handleCleanBtn}>
                <Text numberOfLines={1} style={styles.headerCancelText}>Очистить</Text>
              </TouchableOpacity>}
          </View>
          {auth().currentUser && auth().currentUser.isAnonymous ?
            <View>
              <Button buttonStyle={{
                width: "auto",
                marginHorizontal: 12,
                paddingHorizontal: 6,
                borderRadius: 5,
                backgroundColor: theme.colors.error,
              }} titleStyle={{ color: theme.colors.grey1 }}
                      onPress={() => navigation.navigate("ProfileStack", { screen: "LogIn" })}>
                <View style={{ marginStart: 12 }}>
                  <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    color: theme.colors.accentText,
                    alignSelf: "flex-start",
                  }}>Вход/регистрация</Text>
                  <Text style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 14,
                    color: theme.colors.accentText,
                    alignSelf: "flex-start",
                  }}>Для подачи объявлений необходимо авторизоваться и пройти верификацию в профиле</Text>
                </View>
                <Icon style={{ marginEnd: 6 }} type={"ionicon"} name={"chevron-forward"} size={18}
                      color={theme.colors.accentText} />
              </Button>
            </View> :
            <>
              <View style={styles.imagesContainer}>
                <View style={styles.imagesHeaderContainer}>
                  <Text style={styles.imagesHeaderMainText}>Добавьте фотографии</Text>
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Icon style={{ marginEnd: 6 }} type={"ionicon"} name={"image"} size={20}
                          color={theme.colors.grey1} />
                    <Text style={styles.imagesHeaderInfoText}>{selectedImages.length} из 20</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", paddingVertical: 12 }}>
                  <Button containerStyle={styles.imagesAddImageBtnContainer} buttonStyle={styles.imagesAddImageBtn}
                          onPress={handleAddImageBtn} loading={isAddingImageInProcess}
                          loadingStyle={styles.imagesAddImageBtn} disabled={selectedImages.length === 20}>
                    <Icon type={"ionicon"} name={"add-outline"} size={30} color={theme.colors.accent}></Icon>
                  </Button>
                  <DraggableFlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    animationConfig={{ clamp: 1 }}
                    data={selectedImages}
                    onDragEnd={({ data }) => setSelectedImages(data)}
                    keyExtractor={(item) => Object.keys(item)[0]}
                    renderItem={renderItem}
                    containerStyle={{ flex: 1 }}
                  />
                </View>
                <View style={styles.imagesFooterContainer}>
                  <Text style={[styles.imagesHeaderInfoText, { alignSelf: "flex-start" }]}>Первое изображение будет
                    помещено
                    на обложку</Text>
                </View>
              </View>
              <View style={styles.categoriesModal}>
                <View style={styles.categoriesModalBtnContainer}>
                  <TouchableOpacity onPress={() => handleCategoryModal(true)} style={styles.categoriesModalBtn}>
                    {selectedSubcategory ? (
                      <Text style={styles.categoriesModalBtnText}>{selectedSubcategory}</Text>) : (
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
                               placeholderTextColor={theme.colors.text}
                               maxLength={50}
                               value={fieldsData.title}
                               onChangeText={value => handleFieldsChange("title", value)}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                          <Text numberOfLines={1}
                                style={styles.listingTitleFooterText}>{fieldsData && fieldsData.title ? fieldsData.title.length : 0}/50</Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: 12 }}>
                        <View style={styles.listingDescriptionContainer}>
                          <TextInput placeholder="Описание" placeholderTextColor={theme.colors.text}
                                     style={styles.listingDescriptionText} maxLength={1000} multiline
                                     value={fieldsData.description}
                                     onChangeText={value => handleFieldsChange("description", value)} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                          <Text numberOfLines={1}
                                style={styles.listingTitleFooterText}>{fieldsData && fieldsData.description ? fieldsData.description.length : 0}/1000</Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={styles.listingPriceContainer}>
                        <Text style={styles.listingTitleFooterText}>"Укажите цену с отделением копеек запятой"</Text>
                        <Input containerStyle={styles.listingTitleInputContainer}
                               inputContainerStyle={styles.listingTitleInputInputContainer}
                               inputStyle={styles.listingTitleInput}
                               placeholder={"Цена (Например 9,99)"}
                               placeholderTextColor={theme.colors.text}
                               inputMode={"numeric"}
                               maxLength={7}
                               value={fieldsData.price}
                               rightIcon={<Text style={styles.listingTitleInput}>р./сут.</Text>}
                               onChangeText={value => handleFieldsChange("price", value)}
                        />
                        <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                      </View>
                      <View style={styles.listingDatesContainer}>
                        <View>
                          <Text style={[styles.imagesHeaderInfoText, { alignSelf: "flex-start", marginBottom: 6 }]}>Укажите
                            промежуток дат доступных для аренды</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                          <TouchableOpacity style={styles.listingDatesBtn} onPress={handleStartsDayModalOpen}>
                            <Text style={styles.listingTitleInput}>С</Text>
                            {(fieldsData.dates && fieldsData.dates.startsDay) &&
                              <Text style={styles.listingTitleInput}>{fieldsData.dates.startsDay.getDate()}-
                                {fieldsData.dates.startsDay.getMonth() + 1}-
                                {fieldsData.dates.startsDay.getFullYear()}</Text>}
                            {(fieldsData.dates && fieldsData.dates.startsDay) &&
                              <TouchableOpacity><Icon type={"ionicon"} name={"close"} size={18}
                                                      color={theme.colors.text} /></TouchableOpacity>}
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.listingDatesBtn} onPress={handleEndsDayModalOpen}>
                            <Text style={styles.listingTitleInput}>По</Text>
                            {(fieldsData.dates && fieldsData.dates.endsDay) &&
                              <Text style={styles.listingTitleInput}>{fieldsData.dates.endsDay.getDate()}-
                                {fieldsData.dates.endsDay.getMonth() + 1}-
                                {fieldsData.dates.endsDay.getFullYear()}</Text>}
                            {(fieldsData.dates && fieldsData.dates.endsDay) &&
                              <TouchableOpacity><Icon type={"ionicon"} name={"close"} size={18}
                                                      color={theme.colors.text} /></TouchableOpacity>}
                          </TouchableOpacity>
                        </View>
                        <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                      </View>
                      <View style={styles.listingGeoContainer}>
                        <View>
                          <View style={{ flexDirection: "row" }}>
                            <Input containerStyle={[styles.listingTitleInputContainer, { flex: 1 }]}
                                   inputContainerStyle={styles.listingTitleInputInputContainer}
                                   inputStyle={styles.listingTitleInput}
                                   placeholder={"Укажите место на карте"}
                                   placeholderTextColor={theme.colors.text}
                                   maxLength={50}
                                   value={
                                     selectedCoordinates &&
                                     selectedCoordinates.display_name &&
                                     translateAddressName(getAddressName(selectedCoordinates.display_name))
                                   }
                                   editable={false}
                                   onFocus={handleOpenMap}
                            />
                            <FAB size="small"
                                 style={{ flex: 0.2 }}
                                 icon={{
                                   name: "place",
                                   color: "white",
                                 }} color={theme.colors.accent} onPress={handleOpenMap} />
                          </View>
                          <Modal visible={isMapOpen}>
                            <View style={{
                              height: 60,
                              backgroundColor: theme.colors.accent,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingHorizontal: 12,
                            }}>
                              <Text numberOfLines={1} style={styles.headerMainText}>Выбор местоположения</Text>
                              <TouchableOpacity onPress={handleCloseMap}>
                                <Text numberOfLines={1} style={styles.headerCancelText}>Отмена</Text>
                              </TouchableOpacity>
                            </View>
                            <MapView
                              ref={mapRef}
                              onMapReady={handleMapReady}
                              onPress={handleMapPress}
                              initialRegion={{
                                latitude: userCoordinates.latitude,
                                longitude: userCoordinates.longitude,
                                latitudeDelta: 0,
                                longitudeDelta: 0,
                              }}
                              region={markerCoordinates}
                              showsUserLocation={true}
                              showsMyLocationButton={true}
                              followsUserLocation={true}
                              showsIndoors={false}
                              showsTraffic={false}
                              provider={PROVIDER_GOOGLE}
                              style={{ width: widthPercentageToDP(100), height: heightPercentageToDP(100) }}
                            >
                              <Marker title={"Выбранное место"} titleVisibility={true}
                                      draggable coordinate={markerCoordinates} />
                            </MapView>
                            <FAB size="small" title="Сохранить" color={theme.colors.accent} upperCase style={{
                              position: "absolute",
                              bottom: heightPercentageToDP(5),
                              right: widthPercentageToDP(10),
                            }} onPress={handleSaveLocation}><Text style={{
                              fontFamily: "Roboto-Medium",
                              fontSize: 16,
                              color: theme.colors.accentText,
                            }}>Сохранить</Text></FAB>
                          </Modal>
                        </View>
                        <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
                      </View>
                    </View>
                    <View style={styles.submitBtnViewContainer}>
                      <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}
                              onPress={handleCreateListing} disabled={!isSubmitBtnEnabled}>
                        <Text style={styles.submitBtnText}>Подать объявление</Text>
                      </Button>
                    </View>
                  </View>
                  {selectedSubcategory === "Мотоциклы и скутеры" && <View></View>}
                </>
              }
            </>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAd;
