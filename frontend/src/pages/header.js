import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native'

function Header({navigation}){ 
    

    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
                source={require('../resources/menu.png')}
                style={styles.menuIcon}
            />
            <Image
                source={require('../resources/log.png')}
                style={styles.logo}
            />
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({ 
    header:{
        flex: 1,
        height: 80,
        backgroundColor: '#71C7A6',
        color: '#fff',        
        paddingHorizontal: 20,
        fontSize: 16,
        top: 0,
        position: 'absolute',
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        alignItems: "center",
    },
    menuIcon:{
        top: 32,
        width: 25,
        height: 25,
        // display: flex,
    },

    logo:{
        left: 40,
        // top: -10
    }
})

export default Header