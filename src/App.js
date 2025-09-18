import React, { useState } from 'react';
import NavBar from './components/navBar/NavBar';
import Home from './components/home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BreadList from './components/priceList/breadList/BreadList';
import Breakfast from './components/priceList/breakfast/Βreakfast';
import CookedPizza from './components/priceList/pizza/cookedPizza/CookedPizza';
import UncookedPizza from './components/priceList/pizza/uncookedPizza/UncookedPizza';
import AddOrders from './components/orders/AddOrders';
import HistoryOfOrders from './components/orders/HistoryOfOrders';
import LoginPage from './components/login/LoginPage';
import Settings from './components/settings/Settings';
import Schedule from './components/schedule/Schedule';
import AddSchedule from './components/schedule/addSchedule/AddSchedule';
import AddNotes from './components/notes/AddNotes';
import Notes from './components/notes/Notes';
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
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home imageUrl={imageUrl} />} />
                    <Route path="/home" element={<Home />} />
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
                    <Route path="/show/history" element={<HistoryOfOrders />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/addschedule" element={<AddSchedule />} />
                    <Route path="/notes/add/calendar" element={<AddNotes />} />
                    <Route path="/notes/show/calendar" element={<Notes />} />
                  </Routes>
              </div>
          </>
      </Router>
  );
};


export default App;