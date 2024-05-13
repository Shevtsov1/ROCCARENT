import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

export const categoryFieldsVerify = ({ theme, category, subcategory, fieldsData }) => {

  const verifyDefaultFields = () => {
    console.log('verify called');
  };

  console.log(category, subcategory)

  if (category === "Автомобили и транспорт") {
    if (subcategory === "Легковые автомобили" || subcategory === "Грузовики и коммерческий транспорт") {
      verifyDefaultFields();
    }
    if (subcategory === "Мотоциклы и скутеры") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Велосипеды") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Яхты и лодки") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Автодома и прицепы") {
      return (
        <>
        </>
      );
    }
  }

  if (category === "Недвижимость") {
    if (subcategory === "Квартиры") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Дома и коттеджи") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Коммерческая недвижимость") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Отпускные дома и виллы") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Земельные участки") {
      return (
        <>
        </>
      );
    }
  }

  if (category === "Электроника") {
    if (subcategory === "Телефоны и планшеты") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Компьютеры и ноутбуки") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Телевизоры и аудио-видео техника") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Фото- и видеокамеры") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Игровые приставки и аксессуары") {
      return (
        <>
        </>
      );
    }
  }

  if (category === "Спорт и отдых") {
    if (subcategory === "Спортивные снаряды и инвентарь") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Велосипеды и аксессуары") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Палатки и снаряжение для кемпинга") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Горнолыжное и сноубордическое снаряжение") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Рыболовные снасти") {
      return (
        <>
        </>
      );
    }
  }

  if (category === "Мода и аксессуары") {
    if (subcategory === "Одежда и обувь") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Сумки и аксессуары") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Украшения и часы") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Костюмы и наряды для особых случаев") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Косметика и парфюмерия") {
      return (
        <>
        </>
      );
    }
  }

  if (category === "Дом и сад") {
    if (subcategory === "Мебель и интерьер") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Бытовая техника") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Садовый инструмент и оборудование") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Декор и освещение") {
      return (
        <>
        </>
      );
    }
    if (subcategory === "Газоны и садовые участки") {
      return (
        <>
        </>
      );
    }
  }

};
