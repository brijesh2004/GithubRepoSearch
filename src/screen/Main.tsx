import { StyleSheet, Text, View ,TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import Repos from '../components/Repos';

const Main = ({navigation}:any) => {
  const [query , setQuery] = useState<string>('');
  const [isClicked , setIsClicked] = useState<boolean>(false);
  
  console.log(query);
  return (
    <View style={styles.bodyHead}>
      <TextInput style={styles.InputBorder} onChangeText={(val)=>{setQuery(val); setIsClicked(false)}} 
        placeholder='Repo Name'
        placeholderTextColor="black"
        />
        <Button title='Search' onPress={()=>setIsClicked(true)}/>
         <Text></Text>
        <Button title='Your Favorite Repo' onPress={()=>navigation.navigate("Fav")}/>
        {
          isClicked?<Repos query={query} navigation={navigation}/>:<Text>Enter the Repo</Text>
        }
    </View>
  )
}

export default Main

const styles = StyleSheet.create({
  InputBorder:{
    borderWidth:1,
    borderColor:'black',
    color:'black',
    margin:10,
    marginTop:10,
    marginBottom:10,
  },
  bodyHead:{
    flex:1,
    backgroundColor:'white'
  },
  favButton:{
    margin:20,
  }
})