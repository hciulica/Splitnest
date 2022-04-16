import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';

import OnboardButton from '../components/OnboardButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedBackgroundColorView } from 'react-native-animated-background-color-view';

import Calculator from '../../assets/images/calculator-front-color.svg';
import Camera from '../../assets/images/camera-front-color.svg';
import Wallet from '../../assets/images/wallet-front-color.svg';

const {width, height} = Dimensions.get('window');

const COLORS = {primary: '#BAD8F3', white: '#fff'};

const slides = [
        {
            id: '1',
            image: 'Calculator',
            title: 'Split the bill with your friends correctly',
            subtitle: 'Split the bill correctly when it comes to a large amount of money. The calculator is a bad choice and as time and often it is difficult to divide the money when it comes to several products. Splitness comes with this feature that does that job for you.',
            backColor: '#BAD8F3'
        },
        {
            id: '2',
            image: 'Wallet',
            title: 'Choose to pay the debt in cash or by card',
            subtitle: 'Through the application you can choose to pay in cash or by card. if you owe money to someone you can choose the cash option and to the one to whom you owe money you will have to approve, and the card payment method offers the possibility to add a bank card and pay with it.',
            backColor: '#CDC1FF'
        },
        {
            id:'3',
            image: 'Camera',
            title: 'Scan the receipt and the products are added',
            subtitle: "Use the phone's camera, take a picture on the receipt and the products will be added automatically with the specified prices and quantity. Don't bother adding each product manually. It saves time and avoids the wrong price or quanitity of products.",
            backColor: '#EBD1BD'
        }
    ]

  const ImageRendered = ({image}) => {
    if(image === 'Calculator')
      return <Calculator width = {200} height = {200} />
       if(image === 'Camera')
      return <Camera width = {200} height = {200} />
       if(image === 'Wallet')
      return <Wallet width = {200} height = {200} />
    
    return null;
  } 



const Slide = ({item}) => {
  return (
     <View style={[styles.container]}>
     <View style={{marginBottom: 23}}>
        <ImageRendered image={item.image}/>
      </View> 
        <View style={styles.titleStyle}>
            <Text style={{fontSize: 27, textAlign: 'center', fontWeight: '800'}}>{item.title}</Text>  
        </View>  
            
        <View style={styles.subtitleStyle}>
            <Text style={{fontSize: 15, color: '#686184', textAlign: 'center', fontWeight: '400'}}>{item.subtitle}</Text>
        </View>
      </View>
  );
};


const OnboardScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();
  let opacity = new Animated.Value(0);

  const animationTransition = () => {
     Animated.timing(opacity, {
            toValue: opacity.value ? 0 : 1,
            duration: 500
        }).start();
  }

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  
  const Footer = () => {
    return (
      <View style={{ height: height * 0.25, justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          
          {/* Render indicator */}

          {slides.map((_, index) => (
            <View
              key={index}
              style={[ styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 46,
                  height: 10,
                  borderRadius: 20,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 10, direction: 'rtl'}}>
              <OnboardButton title="Start" color="white" onPress={startLogin}/>
            </View>
          ) : (
            <View style={{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 10}}>
               
                    <OnboardButton title="Skip" onPress={skip}></OnboardButton>
               
                  <OnboardButton title="Next" color="white" onPress={goToNextSlide}></OnboardButton>
               
            </View>
          )}
        </View>
      </View>
    );
  };

  const startLogin = () => {
    navigation.replace('Login');
    AsyncStorage.setItem('isAppFirstLaunched', 'false');
  }

  return (
    <AnimatedBackgroundColorView
        color={slides[currentSlideIndex].backColor}
        initialColor='#BAD8F3'
        style={{ flex: 1 }}
      >
    <SafeAreaView style={{flex: 1}}> 
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.65}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
      
    </SafeAreaView>
    </AnimatedBackgroundColorView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 10,
    width: 26,
    backgroundColor: 'grey',
    marginHorizontal: 4,
    borderRadius: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },

    titleStyle:{
        height: 90,
        width: 305,
        marginBottom: 24,
    },

    subtitleStyle:{
        height: 147,
        width: 320,
    }

});
export default OnboardScreen;