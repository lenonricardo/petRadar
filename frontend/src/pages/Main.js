import React, { useState, useEffect, Fragment } from 'react'
import { StyleSheet, Image, Modal, View, Text, TouchableOpacity, Dimensions} from 'react-native'
import MapView, { Marker} from 'react-native-maps'
import { FAB, Portal, Provider } from 'react-native-paper';

import Directions from "./directions";
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import Header from './header'
import dog from '../resources/dog.png'
import cat from '../resources/cat.png'
import user from '../resources/user.jpg'
import io from 'socket.io-client'

import api from '../services/api'

function Main({ navigation }) {

    const [posts, setPosts] = useState([])
    const [image, setImage] = useState([])
    const [title, setTitle] = useState([])
    const [desc, setDesc] = useState([])
    const [animal, setAnimal] = useState([])
    const [situacao, setSituacao] = useState([])
    const [coord, setCoord] = useState([])
    const [coordAux, setCoordAux] = useState([null])
    const [currentRegion, setCurrentRegion] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [state, setState] = useState({ open: false })
    const [status, setStatus] = useState([0])

    const onStateChange = ({ open }) => setState({ open })
    const { open } = state;

    useEffect(() => {
        async function loadInitialPosion() {
            const { granted } = await requestPermissionsAsync()

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

                const { latitude, longitude } = coords
                latitudeInicial = latitude;
                longitudeInicial = longitude;

                setCoord({ 
                    latitude: latitudeInicial,
                    longitude: longitudeInicial
                })

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                })
            }
        }

        loadInitialPosion()
    }, [])

    async function loadPosts() {
        const { latitude, longitude } = currentRegion

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude
            }
        })

        setPosts(response.data.posts)
        //console.log(response.data.posts)
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region)
        loadPosts()
       }


    if (!currentRegion) {
        return null
    }

    function handleGetGoogleMapDirections() {

        console.log('chegou aqui')
        setModalVisible(!modalVisible)

        setCoord(coordAux)
        
      };

    function handleGetGoogleMapDirections() {

        console.log('chegou aqui')
        setModalVisible(!modalVisible)

        setCoord(coordAux)
        
      };
    

    return (
        <>        
            <MapView provider = "google"  onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>

                {posts.map(post => (                  
                    <Marker
                        key={post._id}
                        coordinate={{
                            latitude: post.location.coordinates[1],
                            longitude: post.location.coordinates[0]
                        }} onPress={() => {
                            setModalVisible(true);
                            setImage(post.image)
                            setTitle(post.title)
                            setDesc(post.description)
                            setSituacao(post.situacao)
                            setCoordAux({ 
                                latitude: post.location.coordinates[1],
                                longitude: post.location.coordinates[0]})
                            console.log(post.image)
                        }}>
                        {/* <View style={styles.raio}></View> */}
                        <Image style={styles.marcador} source={post.animal == 'dog' ? dog : cat} />
                        
                        
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible)
                            }}                     
                                                                           
                        >
                            <View style={styles.modalNew}>
                                                    
                                <Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.22:3333/files/${image}` }} />
                                
                                <Text style={styles.dogName}>{title}</Text>
                                <Text style={styles.dogName}>{desc}</Text>
                                <Text style={styles.dogDesc}>{situacao}</Text>
                                {/* <TouchableOpacity style={styles.location} onPress={handleGetGoogleMapDirections} >
                                        <MaterialIcons name="my-location" color={'#71C7A6'} size={40} />                                         
                                </TouchableOpacity>        
                                
                                */}

                                <View style={styles.thumb}>
                                    <TouchableOpacity >
                                        <MaterialIcons style={styles.thumbUp}  name="thumb-up" size={30} color="#000" />                                         
                                    </TouchableOpacity>
                                    <TouchableOpacity >
                                        <MaterialIcons style={styles.thumbDown}  name="thumb-down" size={30} color="#000" />   
                                    </TouchableOpacity>
                                </View>
    
                                <Text style={styles.userName}>lenonricardo</Text>
                                <Text style={styles.userLocation}>Irati, PR</Text>                           
                                <Image style={styles.profileImage} resizeMode="cover" source={user} />
                                <Provider>
                                    <Portal>
                                        <FAB.Group style={styles.opcoes}
                                        open={open}
                                        icon={open ? 'chevron-down' : 'plus'}
                                        fabStyle={{backgroundColor: '#71C7A6'}}
                                        color={'#fff'}                           
                                        actions={[                                            
                                            {
                                            icon: 'checkbox-marked-circle',
                                            label: 'Marcar como Encontrado',
                                            color:'#7FBF7F',
                                            onPress: () => console.log('Pressed star'),
                                            },
                                            {
                                            icon: 'crosshairs-gps',
                                            label: 'Realizar Rota',
                                            color:'#22a7f0',
                                            onPress: handleGetGoogleMapDirections,
                                            },
                                            {
                                            icon: 'chat-processing',
                                            label: 'Conversar',
                                            color:'#e26a6a',
                                            onPress: () => console.log('Pressed notifications'),
                                            },
                                        ]}
                                        onStateChange={onStateChange}
                                        onPress={() => {
                                            if (open) {
                                            // do something if the speed dial is open
                                            }
                                        }}
                                        />
                                    </Portal>
                                </Provider>
                                {/* <TouchableOpacity style={styles.chatButton}>
                                    <MaterialIcons onPress={() => console.log(post.image)} name="chat" size={20} color="#FFF" />   
                                </TouchableOpacity> */}

                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.loadButton}>
                                    <Text style={{color:"#fff", fontWeight: "bold", fontSize: 20}}>Fechar</Text>   
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </Marker>
                ))}

                <Marker coordinate={{latitude: latitudeInicial, longitude: longitudeInicial }}>
                    <MaterialIcons   name="person-pin-circle" size={50} color="#71C7A6" />
                </Marker>

                {/* <MapViewDirections
                    origin={{latitude: latitudeInicial, longitude: longitudeInicial}}
                    destination={{latitude: 37.3317876, longitude:  -122.0054812}}
                    apikey={GOOGLE_MAPS_APIKEY}
                />                      */}         

                {coord &&(
                    <Directions                    
                    destination={coord}
                    origin={{latitude: latitudeInicial, longitude: longitudeInicial}}/>

                )}


            </MapView>
            

            <Header navigation={navigation} />


            <TouchableOpacity onPress={() => {
                //navegação
                navigation.navigate('Postar', { currentRegion })
            }} style={styles.addButton}>
                <MaterialIcons name="pets" size={20} color="#FFF" />
            </TouchableOpacity>

        </>

    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    marcador: {
        width: 37,
        height: 37,
        //borderRadius: 4,
        //borderWidth: 4,
        //borderColor: '#fff' 
    },
    callout: {
        width: 190,
        height: 200
    },
    calloutText: {
        height: 100
    },
    dogName: {
        fontWeight: 'bold',
        fontSize: 16,
        bottom: -50,
        top: 10
    },
    dogDesc: {
        color: '#666',
        marginTop: 5,
        bottom: -50,
        top: 10
    },
    userName: {
        fontWeight: 'bold',
        color: '#63af92',
        fontSize: 16,
        bottom: -50,
        top: 325,
        left: 90,
        position: "absolute"
    },
    userLocation: {
        color: '#63af92',
        marginTop: 5,
        bottom: -50,
        top: 60,
        top: 335,
        left: 90,
        position: "absolute"
    },
    dogImage: {
        width: 200,
        height: 200,
        borderRadius: 50,
        alignSelf: 'center',
       // transform: [{ rotate: '90deg' }]

    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
        position: "absolute",
        top: 310,
        left: 20
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2
    },

    loadButton: {
        width: 200,
        height: 50,
        backgroundColor: '#71C7A6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: 80
        // marginLeft: 15

    },
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: '#71C7A6',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        position: 'absolute',
        bottom: 40,
        //left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
     chatButton: {
        width: 50,
        height: 50,
        backgroundColor: '#71C7A6',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        position: 'absolute',
        bottom: 40,
        //left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
        top: 305,
        left: 200
    },
    modalNew: {
        flex: 1,
        marginTop: 230,
        margin: 50,
        bottom: 100,
        padding: 22,
        borderRadius: 25,
        shadowRadius: 10,
        shadowColor: '#000',
        borderColor: '#ccc',
        backgroundColor: '#fff',
        alignContent: "center",
        alignItems: "center",        
    },
    header: {
        flex: 1,
        height: 80,
        backgroundColor: '#71C7A6',
        color: '#fff',
        paddingHorizontal: 20,
        fontSize: 16,
        top: 0,
        position: 'absolute',
        flexDirection: 'row',
        width: Dimensions.get('window').width
    },
    menuIcon: {
        top: 40,
        width: 25,
        height: 25

    },

    logo: {
        left: 40,
        top: 8
    },
    thumb:{
        flexDirection: 'row',
        top: -30
    },
    thumbUp:{
        marginRight:180,
        color:'#7FBF7F'
    },
    thumbDown:{
        color:'#D26A6A'
    },
    raio:
    {
        backgroundColor: '#D26A6A',
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 80,
        opacity: 0.4,
        position: "absolute",
        top: -55,
        left: -55        
    },
    location: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        top: 140,
        left: 40
    },
    opcoes:{
        
    }
})

export default Main