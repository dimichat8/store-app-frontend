import React from 'react';
import NavBar from './navBar/NavBar';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import LoginPage from './login/LoginPage';
import Home from './home/Home';
import Settings from './settings/Settings';
import BreadList from './priceList/breadList/BreadList';
import Breakfast from './priceList/breakfast/Βreakfast';
import CookedPizza from './priceList/pizza/cookedPizza/CookedPizza';
import UncookedPizza from './priceList/pizza/uncookedPizza/UncookedPizza';
import Drinks from './priceList/drinks/drink/Drinks';
import Wines from './priceList/drinks/wine/Wines';
import Beers from './priceList/drinks/beers/Beers';
import SoftDrinks from './priceList/drinks/softDrinks/SoftDrinks';
import AddOrders from './orders/AddOrders';
import OrdersTable from './orders/historyOfOrdres/OrdersTable';
import AddSchedule from './schedule/addSchedule/AddSchedule';
import AddNotes from './notes/AddNotes';
import Notes from './notes/Notes';
import ChatWidget from './chat/ChatWidget';
import ChatList from './chat/ChatScreen';
import ScheduleTable from './schedule/ScheduleTable';

const AppContent = () => {
  const { accessToken, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) return <div>Loading...</div>;

  const isLoggedIn = Boolean(accessToken);

  return (
    <>
      {isLoggedIn && <NavBar />}
      <div className="p-m-3">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

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
            <Route path="/schedule" element={<ScheduleTable />} />
            <Route path="/addschedule" element={<AddSchedule />} />
            <Route path="/notes/add/calendar" element={<AddNotes />} />
            <Route path="/notes/show/calendar" element={<Notes />} />
            <Route path="/chat/show/all/conversation" element={<ChatList />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {isLoggedIn && <ChatWidget />}
      </div>
    </>
  );
};

export default AppContent;