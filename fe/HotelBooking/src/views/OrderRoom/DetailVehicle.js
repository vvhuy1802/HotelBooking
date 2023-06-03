import React from 'react'
import { View,ScrollView, Text,TouchableOpacity,Image,Dimensions } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"
import IconMark from "react-native-vector-icons/FontAwesome"
import { useTheme } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { saveInfoVehicle } from '../../../redux/VehicleReducer'

const width = Dimensions.get("window").width
const DetailVehicle = ({navigation,route}) => {
  const colors=useTheme().colors;
  const {item}=route.params;
  const dispatch=useDispatch();
  const iconDetail=[
    {
      id:1,
      name:"Max Power",
      source:require("../../assets/ChargingBattery.png"),
    },
    {
      id:2,
      name:"Fuel",
      source:require("../../assets/Petrol.png"),
    },
    {
      id:3,
      name:"0-60km/h",
      source:require("../../assets/Speed.png"),
    },
    {
      id:4,
      name:"Max Speed",
      source:require("../../assets/WindSpeed.png"),
    }
  ]

  const Format = number => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };
  return (
    <View style={{
      flex:1,
      backgroundColor:"white"
    }}>
      <TouchableOpacity style={{
        width:35,
        height:35,
        marginLeft:10,
        marginTop:10
      }}
      onPress={()=>navigation.goBack()}
      >
        <Icon
        name='chevron-back'
        color={"black"}
        size={35}
        />
      </TouchableOpacity>
      <ScrollView style={{
        marginTop:30,
        marginHorizontal:20
      }}>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <View>
        <Text style={{
          color:"black",
          fontSize:24,
          fontWeight:"500"
        }}>{item.name}</Text>
        <Text
        style={{
          color:"#596474",
          fontWeight:"500",
          marginVertical:5,
        }}
        >{item.brand}</Text>
        </View>
        <IconMark
        name='bookmark-o'
        size={25}
        color={"black"}
        />
        </View>
        <Image
                source={{
                      uri:item.image
                }}
                style={{
                        width: 200,
                        height: 150,
                        marginTop:20,
                        alignSelf:"center"
                }}
                />
        <Text style={{
          color:"black",
          fontWeight:"700",
          fontSize:18,
          marginTop:30,
        }}>
          Specifications
        </Text>
        <View style={{flexDirection:"row",width:width-40,justifyContent:"space-between"}}>
        {iconDetail.map((item,index)=>(
            <View style={{
          height:76,
          width:76,
          paddingVertical:7,
          marginTop:20,
          borderWidth:2,
          borderColor:"#94A1B2",
          borderRadius:10,
          justifyContent:"space-between",
        }}>
          <Image
          source={item.source}
          style={{
            width:16,
            height:16,
            marginLeft:7,
          }}
          />
          <View style={{
            marginLeft:7
          }}>
            <Text style={{
              fontSize:10,
              color:"#596474",
              fontWeight:"700"
            }}>
              {item.name}
            </Text>
            <Text style={{
              fontSize:10,
              fontWeight:"500",
              color:"black"
            }}>
              69 hp
            </Text>
          </View>
        </View>
        ))}
          </View>
          <Text style={{
          color:"black",
          fontWeight:"700",
          fontSize:18,
          marginTop:30,
        }}>
          Descriptions
        </Text>
        <Text style={{
          color:"black"
        }}>
        {item.description}
        </Text>
      </ScrollView>
      <View style={{
        borderWidth:1,
        borderColor:"#94A1B2",
        height:100,
        bottom:0,
        width:width,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingHorizontal:30,
        justifyContent:"space-between",
        paddingTop:25,
        flexDirection:"row",
      }}>
        <View>
          <Text style={{
            color:"#596474",
            fontSize:14,
            fontWeight:"500"
          }}>
            Price
          </Text>
          <Text style={{
            color:"black",
            fontSize:18,
            fontWeight:"700"
          }}>
            {Format(item.price)} VNĐ
          </Text>
        </View>
        <TouchableOpacity style={{
          height:50,
          width:150,
          backgroundColor:colors.primary,
          justifyContent:"center",
          alignItems:"center",
          borderRadius:10,
        }}
        onPress={()=>{
          navigation.pop(2);
          dispatch(saveInfoVehicle(item));
        }}
        >
          <Text style={{
            color:"white",
            fontSize:15,
            fontWeight:"500"
          }}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DetailVehicle