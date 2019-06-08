import React from 'react';
import { StyleSheet, Text, View,  ScrollView } from 'react-native';
import { MapView } from 'expo';
import Slider from "react-native-slider";
import { AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

export default class WeatherDetailScreen extends React.Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: `Weather Info: ${navigation.getParam('city', 'Unknown')}`,
    //     };
    // };

    constructor(props) {
        super(props);

        this.state = {
            value: 1,
            isLoading: true,
            trigger: false,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const city = navigation.getParam('city', null);
        // const city = 'Daejeon';

        const apiKey = 'a6c5daf4722ac012289b95cebc2fb972';

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(info => {
                this.setState({
                    ...info,
                    isLoading: false,
                });
            });
        fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${city}`)
            .then(response => response.json())
            .then(info => {
                this.setState( {
                    ...info,
                });
            });
    }

    trigger_it = () => {
        this.setState({
            trigger:true,
        });
        console.log(this.state.trigger);
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Text style={{textAlign:"center"}}>데이터를 불러오는 중입니다.</Text>
                </View>
            )
        }
        let get_temp = this.state;

        let new_data = [];
        for(i = 0; i < 36; i++) {
            new_data.push(get_temp.list[i]["main"]["temp"]);
        }
        const desc = Object.keys(this.state.query.pages);
        const hello = desc[0];

        if(this.state.trigger === true) {
            summary = <ScrollView
                style={{flex:0.2}}>
                <Text
                    style={{textAlign:"center",color:'rgba(0,0,0,0.98)'}}>{this.state.query.pages[hello].extract}</Text>
            </ScrollView>;
        } else {
            summary = <ScrollView
                style={{flex:0.2, backgroundColor: '#fafafa'
                }}
            ><Text style={{textAlign:"center",fontSize:15,color:'rgb(2,7,21)',marginTop: "5%"}}>Pin을 클릭하면 지역 정보를 얻을 수 있습니다.</Text></ScrollView>;
        }

        return (
            <View style={styles.container}>
                <AreaChart
                    style={{flex:0.4,marginTop:"5%"}}
                    data={ new_data }
                    curve={ shape.curveBasis}
                    svg={{ fill: 'rgba(0, 0, 0, 0.2)'}}
                >
                </AreaChart>

                <Slider
                    style={{backgroundColor:'#fafafa',flex:0.1}}
                    value={this.state.value}
                    onValueChange={value => this.setState({ value } )}
                />
                <View
                    style = {{backgroundColor:'#fafafa', alignItems:'center', margin:"5%"}}>
                    <Text style={{
                        color:'rgb(2,7,21)',
                        fontSize:19,
                    }}>{get_temp.list[parseInt(this.state.value * 35)]["dt_txt"]}</Text>
                    <Text/>
                    <Text style={{
                        color:'rgb(2,7,21)',
                        fontSize:17,
                    }}>온도 {(get_temp.list[parseInt(this.state.value * 35)]["main"]["temp"] - 273.15).toFixed(1)}도</Text>
                    <Text style={{
                        color:'rgb(2,7,21)',
                        fontSize:17,
                    }}>습도 {get_temp.list[parseInt(this.state.value * 35)]["main"]["humidity"]}</Text>
                    <Text style={{
                        color:'rgb(2,7,21)',
                        fontSize:17,
                    }}>현재 날씨 {get_temp.list[parseInt(this.state.value * 35)].weather[0]["main"]}</Text>
                </View>
                <MapView
                    style={{flex:1}}
                    initialRegion={{
                        latitude: get_temp.city.coord.lat,
                        longitude: get_temp.city.coord.lon,
                        latitudeDelta: 0.32,
                        longitudeDelta: 0.4,
                    }}
                >
                    <MapView.Marker
                        style={{height:50}}
                        key={get_temp.list[35]["cnt"]} coordinate={{latitude:get_temp.city.coord.lat, longitude:get_temp.city.coord.lon}}
                        description={this.state.query.pages[hello].extract}
                        title={get_temp.city.name}
                        onPress={this.trigger_it}
                    />
                </MapView>
                {summary}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fafafa',
        flex: 1,
        // marginTop: Constants.statusBarHeight,
    },
});
