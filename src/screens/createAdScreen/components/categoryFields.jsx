import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import CarsAndTrucksFields from "./fields/Vehicles/carsAndTrucksFields";
import MotorcyclesFields from "./fields/Vehicles/motorcyclesFields";
import BicyclesFields from "./fields/Vehicles/bicyclesFields";
import YachtsFields from "./fields/Vehicles/yachtsFields";
import MotorhomesFields from "./fields/Vehicles/motorhomesFields";
import ApartmentsFields from "./fields/Real Estate/apartmentsFields";
import HousesFields from "./fields/Real Estate/housesFields";
import CommercialPropertiesFields from "./fields/Real Estate/commercialPropertiesFields";
import VacationHomesFields from "./fields/Real Estate/vacationHomesFields";
import LandPlotsFields from "./fields/Real Estate/landPlotsFields";
import PhonesFields from "./fields/Electronics/phonesFields";
import ComputersFields from "./fields/Electronics/computersFields";
import TvsFields from "./fields/Electronics/tvsFields";
import CamerasFields from "./fields/Electronics/camerasFields";
import GamingConsolesFields from "./fields/Electronics/gamingConsolesFields";
import SportsEquipmentFields from "./fields/Sports and Recreation/sportsEquipmentFields";
import CampingGearFields from "./fields/Sports and Recreation/campingGearFields";
import SkiingAndSnowboardingGearFields from "./fields/Sports and Recreation/skiingAndSnowboardingGearFields";
import FishingGearFields from "./fields/Sports and Recreation/fishingGearFields";
import ClothingFields from "./fields/Fashion and Accessories/clothingFields";
import BagsFields from "./fields/Fashion and Accessories/bagsFields";
import JewelryFields from "./fields/Fashion and Accessories/jewelryFields";
import CostumesFields from "./fields/Fashion and Accessories/costumesFields";
import CosmeticsFields from "./fields/Fashion and Accessories/cosmeticsFields";
import FurnitureFields from "./fields/Home and Garden/furnitureFields";
import AppliancesFields from "./fields/Home and Garden/appliancesFields";
import GardenToolsFields from "./fields/Home and Garden/gardenToolsFields";
import DecorFields from "./fields/Home and Garden/decorFields";
import LawnsFields from "./fields/Home and Garden/lawnsFields";
import { Button, Input } from "@rneui/base";

const CategoryFields = ({ theme, category, subcategory }) => {

  const [fieldsData, setFieldsData] = useState([]);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);

  const styles = StyleSheet.create({
    defaultFieldsContainer: {},
    listingTitleContainer: {
      marginVertical: 12,
      paddingHorizontal: 12,
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


    listingDatesContainer: {},


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
  });

  const TitleAndDescriptionFields = () => {
    return (
      <View style={styles.defaultFieldsContainer}>
        <View style={styles.listingTitleContainer}>
          <Input containerStyle={styles.listingTitleInputContainer}
                 inputContainerStyle={styles.listingTitleInputInputContainer} inputStyle={styles.listingTitleInput}
                 placeholder={"Название товара"}
                 placeholderTextColor={theme.colors.grey3}
                 maxLength={50} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
            <Text numberOfLines={1} style={styles.listingTitleFooterText}>0/50</Text>
          </View>
        </View>
        <View style={{marginHorizontal: 12,  marginBottom: 12,}}>
          <View style={styles.listingDescriptionContainer}>
            <TextInput placeholder="Описание" placeholderTextColor={theme.colors.grey3}
                       style={styles.listingDescriptionText} maxLength={1000} multiline/>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={styles.listingTitleFooterText}>Обязательное поле</Text>
            <Text numberOfLines={1} style={styles.listingTitleFooterText}>0/1000</Text>
          </View>
        </View>
      </View>
    );
  };

  const PriceDatesAndGeoFields = () => {
    return (
      <View>
        <View style={styles.listingPriceContainer}>
          <Input label={"Цена"} />
        </View>
        <View style={styles.listingDatesContainer}>
          <Text>Dates</Text>
        </View>
        <View style={styles.listingGeoContainer}>
          <Text>geo</Text>
        </View>
      </View>
    );
  };

  const SubmitBtn = () => {
    return (
      <View style={styles.submitBtnViewContainer}>
        <Button containerStyle={styles.submitBtnContainer} buttonStyle={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Подать объявление</Text>
        </Button>
      </View>
    );
  };

  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CarsAndTrucksFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (
        <>
          <TitleAndDescriptionFields />
          <MotorcyclesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Велосипеды") {
      return (
        <>
          <TitleAndDescriptionFields />
          <BicyclesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Яхты и лодки") {
      return (
        <>
          <TitleAndDescriptionFields />
          <YachtsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Автодома и прицепы") {
      return (
        <>
          <TitleAndDescriptionFields />
          <MotorhomesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (
        <>
          <TitleAndDescriptionFields />
          <ApartmentsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Дома и коттеджи") {
      return (
        <>
          <TitleAndDescriptionFields />
          <HousesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CommercialPropertiesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (
        <>
          <TitleAndDescriptionFields />
          <VacationHomesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Земельные участки") {
      return (
        <>
          <TitleAndDescriptionFields />
          <LandPlotsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (
        <>
          <TitleAndDescriptionFields />
          <PhonesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (
        <>
          <TitleAndDescriptionFields />
          <ComputersFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (
        <>
          <TitleAndDescriptionFields />
          <TvsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CamerasFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (
        <>
          <TitleAndDescriptionFields />
          <GamingConsolesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (
        <>
          <TitleAndDescriptionFields />
          <SportsEquipmentFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (
        <>
          <TitleAndDescriptionFields />
          <BicyclesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CampingGearFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (
        <>
          <TitleAndDescriptionFields />
          <SkiingAndSnowboardingGearFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Рыболовные снасти") {
      return (
        <>
          <TitleAndDescriptionFields />
          <FishingGearFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (
        <>
          <TitleAndDescriptionFields />
          <ClothingFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Сумки и аксессуары") {
      return (
        <>
          <TitleAndDescriptionFields />
          <BagsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Украшения и часы") {
      return (
        <>
          <TitleAndDescriptionFields />
          <JewelryFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CostumesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (
        <>
          <TitleAndDescriptionFields />
          <CosmeticsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (
        <>
          <TitleAndDescriptionFields />
          <FurnitureFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Бытовая техника") {
      return (
        <>
          <TitleAndDescriptionFields />
          <AppliancesFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (
        <>
          <TitleAndDescriptionFields />
          <GardenToolsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Декор и освещение") {
      return (
        <>
          <TitleAndDescriptionFields />
          <DecorFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
    if (subcategory === "Газоны и садовые участки") {
      return (
        <>
          <TitleAndDescriptionFields />
          <LawnsFields theme={theme} />
          <PriceDatesAndGeoFields />
          <SubmitBtn />
        </>
      );
    }
  }

};

export default CategoryFields;
