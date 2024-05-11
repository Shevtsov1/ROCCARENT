import React from "react";
import { Text } from "react-native";
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

const CategoryFields = ({ theme, category, subcategory }) => {


  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      return (
        <CarsAndTrucksFields theme={theme}/>
      )
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (
        <MotorcyclesFields theme={theme}/>
      )
    }
    if (subcategory === "Велосипеды") {
      return (
        <BicyclesFields theme={theme}/>
      )
    }
    if (subcategory === "Яхты и лодки") {
      return (
        <YachtsFields theme={theme}/>
      )
    }
    if (subcategory === "Автодома и прицепы") {
      return (
        <MotorhomesFields theme={theme}/>
      )
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (
        <ApartmentsFields theme={theme}/>
      )
    }
    if (subcategory === "Дома и коттеджи") {
      return (
        <HousesFields theme={theme}/>
      )
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (
        <CommercialPropertiesFields theme={theme}/>
      )
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (
        <VacationHomesFields theme={theme}/>
      )
    }
    if (subcategory === "Земельные участки") {
      return (
        <LandPlotsFields theme={theme}/>
      )
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (
        <PhonesFields theme={theme}/>
      )
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (
        <ComputersFields theme={theme}/>
      )
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (
        <TvsFields theme={theme}/>
      )
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (
        <CamerasFields theme={theme}/>
      )
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (
        <GamingConsolesFields theme={theme}/>
      )
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (
        <SportsEquipmentFields theme={theme}/>
      )
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (
        <BicyclesFields theme={theme}/>
      )
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (
        <CampingGearFields theme={theme}/>
      )
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (
        <SkiingAndSnowboardingGearFields theme={theme}/>
      )
    }
    if (subcategory === "Рыболовные снасти") {
      return (
        <FishingGearFields theme={theme}/>
      )
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (
        <ClothingFields theme={theme}/>
      )
    }
    if (subcategory === "Сумки и аксессуары") {
      return (
        <BagsFields theme={theme}/>
      )
    }
    if (subcategory === "Украшения и часы") {
      return (
        <JewelryFields theme={theme}/>
      )
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (
        <CostumesFields theme={theme}/>
      )
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (
        <CosmeticsFields theme={theme}/>
      )
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (
        <FurnitureFields theme={theme}/>
      )
    }
    if (subcategory === "Бытовая техника") {
      return (
        <AppliancesFields theme={theme}/>
      )
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (
        <GardenToolsFields theme={theme}/>
      )
    }
    if (subcategory === "Декор и освещение") {
      return (
        <DecorFields theme={theme}/>
      )
    }
    if (subcategory === "Газоны и садовые участки") {
      return (
        <LawnsFields theme={theme}/>
      )
    }
  }

};

export default CategoryFields;
