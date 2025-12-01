import React from 'react'
import HeroSection from '../../components/user/home/HeroSection'
import CardsSection from '../../components/user/home/CardsSection'
import ChooseSection from '../../components/user/home/ChooseSection'
import SpecialMenu from '../../components/user/home/SpecialMenu'
import RegularFood from '../../components/user/home/RegularFoods'
import SpecialChefs from '../../components/user/home/SpecialChefs'

const HomePage = () => {
  return (
    <div>
        <HeroSection/>
        <CardsSection/>
        <ChooseSection/>
        <SpecialMenu/>
        <RegularFood/>
        <SpecialChefs/>
    </div>
  )
}

export default HomePage
