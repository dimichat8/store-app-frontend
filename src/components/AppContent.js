import React, { useState } from 'react';
import NavBar from './navBar/NavBar';
import Home from './home/Home';
import { Routes, Route, useLocation } from "react-router-dom";
import BreadList from './priceList/breadList/BreadList';
import Breakfast from './priceList/breakfast/Βreakfast';
import CookedPizza from './priceList/pizza/cookedPizza/CookedPizza';
import UncookedPizza from './priceList/pizza/uncookedPizza/UncookedPizza';
import AddOrders from './orders/AddOrders';
import LoginPage from './login/LoginPage';
import Settings from './settings/Settings';
import Schedule from './schedule/Schedule';
import AddSchedule from './schedule/addSchedule/AddSchedule';
import AddNotes from './notes/AddNotes';
import Notes from './notes/Notes';
import SoftDrinks from './priceList/drinks/softDrinks/SoftDrinks';
import Beers from './priceList/drinks/beers/Beers';
import Wines from './priceList/drinks/wine/Wines';
import Drinks from './priceList/drinks/drink/Drinks';
import ChatWidget from './chat/ChatWidget';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './AuthProvider';
import OrdersTable from './orders/historyOfOrdres/OrdersTable';

const AppContent = () => {
  const [username, setUsername] = useState(null);
  const { accessToken } = useAuth();
  const hideNavBar = !accessToken;

  return (
    <>
      {!hideNavBar && <NavBar />}
      <div className="p-m-3">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage setUsername={setUsername} />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/breadList" element={<BreadList />} />
            <Route path="/breakfast" element={<Breakfast />} />
            <Route path="/cookedpizza" element={<CookedPizza />} />
            <Route path="/uncookedpizza" element={<UncookedPizza />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/wines" element={<Wines />} />
            <Route path="/beers" element={<Beers />} />
            <Route path="/softdrinks" element={<SoftDrinks />} />
            <Route path="/addorder" element={<AddOrders />} />
            <Route path="/show/history" element={<OrdersTable />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/addschedule" element={<AddSchedule />} />
            <Route path="/notes/add/calendar" element={<AddNotes />} />
            <Route path="/notes/show/calendar" element={<Notes />} />
          </Route>
          <Route path="*" element={<LoginPage setUsername={setUsername} />} />
        </Routes>

        {!hideNavBar && <ChatWidget username={username} />}
      </div>
    </>
  );
};

export default AppContent;