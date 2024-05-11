import React from "react";
import { Text } from "react-native";

const CategoryFields = ({ category, subcategory }) => {


  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      return (
        <Text>"Легковые автомобили"</Text>
      )
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (
        <Text>"Мотоциклы и скутеры"</Text>
      )
    }
    if (subcategory === "Велосипеды") {
      return (
        <Text>"Велосипеды"</Text>
      )
    }
    if (subcategory === "Яхты и лодки") {
      return (
        <Text>"Яхты и лодки"</Text>
      )
    }
    if (subcategory === "Автодома и прицепы") {
      return (
        <Text>"Автодома и прицепы"</Text>
      )
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (
        <Text>"Квартиры"</Text>
      )
    }
    if (subcategory === "Дома и коттеджи") {
      return (
        <Text>"Дома и коттеджи"</Text>
      )
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (
        <Text>"Коммерческая недвижимость"</Text>
      )
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (
        <Text>"Отпускные дома и виллы"</Text>
      )
    }
    if (subcategory === "Земельные участки") {
      return (
        <Text>"Земельные участки"</Text>
      )
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (
        <Text>"Телефоны и планшеты"</Text>
      )
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (
        <Text>"Компьютеры и ноутбуки"</Text>
      )
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (
        <Text>"Телевизоры и аудио-видео техника"</Text>
      )
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (
        <Text>"Фото- и видеокамеры"</Text>
      )
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (
        <Text>"Игровые приставки и аксессуары"</Text>
      )
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (
        <Text>"Спортивные снаряды и инвентарь"</Text>
      )
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (
        <Text>"Велосипеды и аксессуары"</Text>
      )
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (
        <Text>"Палатки и снаряжение для кемпинга"</Text>
      )
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (
        <Text>"Горнолыжное и сноубордическое снаряжение"</Text>
      )
    }
    if (subcategory === "Рыболовные снасти") {
      return (
        <Text>"Рыболовные снасти"</Text>
      )
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (
        <Text>"Одежда и обувь"</Text>
      )
    }
    if (subcategory === "Сумки и аксессуары") {
      return (
        <Text>"Сумки и аксессуары"</Text>
      )
    }
    if (subcategory === "Украшения и часы") {
      return (
        <Text>"Украшения и часы"</Text>
      )
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (
        <Text>"Костюмы и наряды для особых случаев"</Text>
      )
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (
        <Text>"Косметика и парфюмерия"</Text>
      )
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (
        <Text>"Мебель и интерьер"</Text>
      )
    }
    if (subcategory === "Бытовая техника") {
      return (
        <Text>"Бытовая техника"</Text>
      )
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (
        <Text>"Садовый инструмент и оборудование"</Text>
      )
    }
    if (subcategory === "Декор и освещение") {
      return (
        <Text>"Декор и освещение"</Text>
      )
    }
    if (subcategory === "Газоны и садовые участки") {
      return (
        <Text>"Газоны и садовые участки"</Text>
      )
    }
  }

};

export default CategoryFields;
