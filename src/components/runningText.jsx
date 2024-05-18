import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';

const RunningText = ({ text }) => {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  const measureTextWidth = (event) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  useEffect(() => {
    const animationDuration = 5000; // Длительность анимации
    const pauseDuration = 2000; // Длительность паузы в начале


    const startAnimation = () => {
      Animated.sequence([
        // Пауза в начале
        Animated.delay(pauseDuration),

        // Анимация прокрутки содержимого влево
        Animated.timing(translateXAnim, {
          toValue: -textWidth,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Размонтирование компонента сбрасывает анимацию
        // Здесь вы можете добавить логику для повторной анимации, если нужно
      });
    };

    // Запуск анимации после измерения ширины текста
    if (textWidth === 0) {
      startAnimation();
    }

    // Запуск анимации повторно при изменении текста
    return () => {
      translateXAnim.setValue(0);
      setTextWidth(0);
    };
  }, [text]);

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX: translateXAnim }],
        }}
      >
        <Text numberOfLines={1} onLayout={measureTextWidth}>{text}</Text>
      </Animated.View>
    </View>
  );
};

export default RunningText;
