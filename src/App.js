import React, { useState } from 'react';
import NavBar from './components/navBar/NavBar';
import Home from './components/home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BreadList from './components/priceList/breadList/BreadList';
import Breakfast from './components/priceList/breakfast/Βreakfast';
import CookedPizza from './components/pizza/cookedPizza/CookedPizza';
import UncookedPizza from './components/pizza/uncookedPizza/UncookedPizza';
import AddOrders from './components/orders/AddOrders';
import LoginPage from './components/login/LoginPage';
import Settings from './components/settings/Settings';
import Schedule from './components/schedule/Schedule';
import AddSchedule from './components/schedule/addSchedule/AddSchedule';
import CalendarNotes from './components/notes/CalendarNotes';
import SoftDrinks from './components/priceList/drinks/softDrinks/SoftDrinks';
import Beers from './components/priceList/drinks/beers/Beers';
import Wines from './components/priceList/drinks/wine/Wines';
import Drinks from './components/priceList/drinks/drink/Drinks';


const App = () => {

  const [imageUrl, setImageUrl] = useState(null);

  return (
      <Router>
          <>
              <NavBar setImageUrl={setImageUrl} />
              <div className="p-m-3">
                  <Routes>
                      <Route path="/" element={<Home imageUrl={imageUrl} />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/settings" element={<Settings onImageChange={setImageUrl} />} /> {/* Pass function */}
                      <Route path="/breadList" element={<BreadList />} />
                      <Route path="/breakfast" element={<Breakfast />} />
                      <Route path="/cookedpizza" element={<CookedPizza />} />
                      <Route path="/uncookedpizza" element={<UncookedPizza />} />
                      <Route path="/drinks" element={<Drinks />} />
                      <Route path="/wines" element={<Wines />} />
                      <Route path="/beers" element={<Beers />} />
                      <Route path="/softdrinks" element={<SoftDrinks />} />
                      <Route path="/addorder" element={<AddOrders />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/addschedule" element={<AddSchedule />} />
                      <Route path="/notes/calendar" element={<CalendarNotes />} />


                  </Routes>
              </div>
          </>
      </Router>
  );
};


export default App;