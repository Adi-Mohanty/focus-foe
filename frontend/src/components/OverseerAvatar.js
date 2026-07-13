import React, {
  useEffect,
  useRef,
} from 'react';
import { Animated, Image, View } from 'react-native';

import { C } from '../constants/colors';
import { OVERSEERS } from '../constants/overseers';

/** Glowing overseer avatar in circular frame */
export default function OverseerAvatar({
    mood,
    size = 120,
    glowColor,
    themeColor,
    reducedMotion,
  }) {
    const pulse =
      useRef(
        new Animated.Value(1)
      ).current;
  
    useEffect(() => {
      const anim =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              pulse,
              {
                toValue: 1.04,
                duration: 2000,
                useNativeDriver: true,
              }
            ),
  
            Animated.timing(
              pulse,
              {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }
            ),
          ])
        );
  
      anim.start();
  
      return () =>
        anim.stop();
    }, []);
  
    const gc =
      glowColor ||
      `${themeColor}35`;
  
    return (
      <Animated.View
        style={{
          transform: [{scale: pulse}],
          alignItems: 'center',
        }}
      >
        {/* glow */}
        <View
          style={{
            position: 'absolute',
            width: size + 28,
            height: size + 28,
            borderRadius: (size + 28) / 2,
            backgroundColor: gc,
            top: -14,
            left: -14,
            opacity: 0.32,
          }}
        />
  
        {/* ring */}
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: glowColor ? glowColor : themeColor,
            backgroundColor: '#fff',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={
              OVERSEERS[
                mood
              ] ||
              OVERSEERS.idle
            }
            style={{
              width:
                size *
                1.34,
  
              height:
                size *
                1.34,
            }}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    );
  }