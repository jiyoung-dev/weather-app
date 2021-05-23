import React from 'react';
import {Alert} from "react-native";
import Loading from "./Loading";
import * as Location from 'expo-location';
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "f0f6390c45c893b352d575905fc41b22";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  // 날씨정보 가져오기 
  getWeather = async(latitude, longitude) => {
    const { data: {
      main: {temp}, 
      weather
    } 
  } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    // console.log(data);
    this.setState({ 
      isLoading: false, 
      condition: weather[0].main,
      temp
    });
  };
  // 위치정보 가져오기 
  getLocation = async() => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude)
      this.setState({ isLoading: false });
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    // 로딩중이라면 Loading화면 리턴, 아니면 null
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition}/>;  
  }
}
