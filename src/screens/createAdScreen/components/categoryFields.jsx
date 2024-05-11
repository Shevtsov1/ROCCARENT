import React, { useState } from "react";
import { Text, View } from "react-native";
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
import { Button } from "@rneui/base";

const CategoryFields = ({ theme, category, subcategory }) => {

  const [fieldsData, setFieldsData] = useState([]);

  const DefaultFields = () => {
    return (
      <View>
        <View>

        </View>
        <View>

        </View>
        <View>

        </View>
      </View>
    );
  }

  const SubmitBtn = () => {
    return (
      <View>
        <Button>
          <Text>Создать</Text>
        </Button>
      </View>
    );
  }

  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      return (
        <>
          <DefaultFields/>
          <CarsAndTrucksFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (
        <>
          <DefaultFields/>
          <MotorcyclesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Велосипеды") {
      return (
        <>
          <DefaultFields/>
          <BicyclesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Яхты и лодки") {
      return (
        <>
          <DefaultFields/>
          <YachtsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Автодома и прицепы") {
      return (
        <>
          <DefaultFields/>
          <MotorhomesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (
        <>
          <DefaultFields/>
          <ApartmentsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Дома и коттеджи") {
      return (
        <>
          <DefaultFields/>
          <HousesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (
        <>
          <DefaultFields/>
          <CommercialPropertiesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (
        <>
          <DefaultFields/>
          <VacationHomesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Земельные участки") {
      return (
        <>
          <DefaultFields/>
          <LandPlotsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (
        <>
          <DefaultFields/>
          <PhonesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (
        <>
          <DefaultFields/>
          <ComputersFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (
        <>
          <DefaultFields/>
          <TvsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (
        <>
          <DefaultFields/>
          <CamerasFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (
        <>
          <DefaultFields/>
          <GamingConsolesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (
        <>
          <DefaultFields/>
          <SportsEquipmentFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (
        <>
          <DefaultFields/>
          <BicyclesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (
        <>
          <DefaultFields/>
          <CampingGearFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (
        <>
          <DefaultFields/>
          <SkiingAndSnowboardingGearFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Рыболовные снасти") {
      return (
        <>
          <DefaultFields/>
          <FishingGearFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (
        <>
          <DefaultFields/>
          <ClothingFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Сумки и аксессуары") {
      return (
        <>
          <DefaultFields/>
          <BagsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Украшения и часы") {
      return (
        <>
          <DefaultFields/>
          <JewelryFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (
        <>
          <DefaultFields/>
          <CostumesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (
        <>
          <DefaultFields/>
          <CosmeticsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (
        <>
          <DefaultFields/>
          <FurnitureFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Бытовая техника") {
      return (
        <>
          <DefaultFields/>
          <AppliancesFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (
        <>
          <DefaultFields/>
          <GardenToolsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Декор и освещение") {
      return (
        <>
          <DefaultFields/>
          <DecorFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
    if (subcategory === "Газоны и садовые участки") {
      return (
        <>
          <DefaultFields/>
          <LawnsFields theme={theme}/>
          <SubmitBtn/>
        </>
      )
    }
  }

};

export default CategoryFields;
