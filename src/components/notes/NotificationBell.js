import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import ApiService from '../ApiService';
import './NotificationBell.css';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const op = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const fetchNotifications = async () => {
    try {
      const response = await ApiService.findNotificationsByDates();
      if (response.data && response.data.data) {
        const allNotifications = response.data.data.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          date: n.createdAt
        }));
        setNotifications(allNotifications);

        const todayNotifications = allNotifications.filter(n => n.date === today);
        setUnreadCount(todayNotifications.length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleOverlay = (e) => {
    op.current.toggle(e);
    setUnreadCount(0);
  };

  const todayNotifications = notifications.filter(n => n.date === today);

  return (
    <div className="notification-bell-wrapper">
      <Button
        icon="pi pi-bell"
        className="p-button-text p-button-rounded notification-bell"
        aria-label="Notifications"
        onClick={toggleOverlay}
      />

      {unreadCount > 0 && (
        <Badge
          value={unreadCount}
          severity="danger"
          className="notification-badge"
        />
      )}

      <OverlayPanel ref={op} style={{ width: "350px" }}>
        <h4 style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="pi pi-bell" style={{ fontSize: "1.2rem" }}></i>
          <b><span style={{ color: "rgba(204, 173, 87, 0.788)" }}>Ειδοποιήσεις</span></b>
        </h4>
        {todayNotifications.length > 0 ? (
          <div className="notification-list">
            {todayNotifications.map((n, index) => (
              <div key={n.id} className="notification-item" style={{ marginBottom: '10px' }}>
                <strong>{index + 1}. {n.title}</strong>
                <p className="notification-content">{n.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#888", textAlign: "center", margin: "10px 0" }}>
            Δεν υπάρχουν ειδοποιήσεις για σήμερα 🎉
          </p>
        )}
      </OverlayPanel>
    </div>
  );
}

export default NotificationBell;