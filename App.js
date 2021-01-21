import * as React from 'react';
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { bgs, DATA } from './data';
const { width, height } = Dimensions.get('screen');

// https://www.flaticon.com/packs/retro-wave
// inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
// https://twitter.com/mironcatalin/status/1321180191935373312

const Indicator = ({ scrollX }) => {
   return (
      <View style={{ position: 'absolute', bottom: 100, flexDirection: 'row' }}>
         {DATA.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
            const scale = scrollX.interpolate({
               inputRange,
               outputRange: [0.8, 1.4, 0.8],
               extrapolate: 'clamp'
            });
            const opacity = scrollX.interpolate({
               inputRange,
               outputRange: [0.4, 0.9, 0.4],
               extrapolate: 'clamp'
            });
            return (
               <Animated.View key={`indicator-${i}`} style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: 'white', margin: 10, opacity, transform: [{ scale }] }} />
            );
         })}
      </View>
   );
};

const Backdrop = ({ scrollX }) => {
   const backgroundColor = scrollX.interpolate({
      inputRange: bgs.map((_, i) => i * width),
      outputRange: bgs.map((bg) => bg)
   });
   return (
      <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} />
   );
};

const Square = ({ scrollX }) => {
   const YOLO = Animated.modulo(Animated.divide(
      Animated.modulo(scrollX, width),
      new Animated.Value(width)
   ), 1);

   const rotate = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['35deg', '0deg', '35deg']
   });
   const translateX = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -height, 0]
   });
   return (
      <Animated.View style={{
         width: height, height, backgroundColor: 'white', borderRadius: 86, position: 'absolute',
         top: -height * 0.6, left: -height * 0.3, transform: [{ rotate }, { translateX }]
      }} />
   );
};

export default function App() {
   const scrollX = React.useRef(new Animated.Value(0)).current;

   return (
      <View style={styles.container}>
         <StatusBar hidden />
         <Backdrop scrollX={scrollX} />
         <Square scrollX={scrollX} />
         <Animated.FlatList data={DATA} keyExtractor={item => item.key} horizontal scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 100 }} showsHorizontalScrollIndicator={false} pagingEnabled
            // animar colores no es soportado por el nativeDriver por eso userNativeDriver: false
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            renderItem={({ item }) => {
               return (
                  <View style={{ width, alignItems: 'center' }}>
                     <View style={{ flex: 0.7, justifyContent: 'center' }}>
                        <Image source={{ uri: item.image }} style={{ width: width / 2, height: width / 2, resizeMode: 'contain' }} />
                     </View>
                     <View style={{ flex: 0.3, paddingHorizontal: 10 }}>
                        <Text style={{ fontWeight: '800', fontSize: 28, marginBottom: 10, color: 'white' }}>{item.title}</Text>
                        <Text style={{ fontWeight: '300', color: 'white' }}>{item.description}</Text>
                     </View>
                  </View>
               );
            }} />
         <Indicator scrollX={scrollX} />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});