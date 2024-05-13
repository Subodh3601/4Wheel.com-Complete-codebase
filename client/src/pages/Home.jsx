import React from 'react'
import Hero from '../components/Hero'
import Biography from "../components/Biography";
import CarType from "../components/CarType";
import MessageForm from "../components/MessageForm";


const Home = () => {
  return (
    <div>
      <Hero title="4 Wheel keep Your Life on Run" imageUrl="/hero.jpg" />
      <Biography imageUrl={'/about.jpg'} />
      <CarType />
      <MessageForm />
    </div>
  );
}

export default Home