import Routes from './src/routes'
import React from 'react'
import { StatusBar } from 'react-native'
import Header from './src/pages/header'

export default function App(){
  return(
    <>    
    {/* <StatusBar barStyle="light-content" backgroundColor="#7d40e7"/> */}
    <Routes/>
    </>
  )
}
