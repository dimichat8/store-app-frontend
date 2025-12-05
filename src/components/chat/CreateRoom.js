import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import ApiService from "../ApiService";
import "./CreateRoom.css";
import { useAuth } from '../AuthProvider';

const CreateRoom = ({ visible, onHide, onRoomCreated }) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const { userId } = useAuth();
  const currentUserId = userId;


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await ApiService.getAllUsers();
        if (res.status === 200 && res.data) {
          const usersArray = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];

          const filteredUsers = usersArray.filter(
            (u) => u.id !== currentUserId
          );

          setUsers(filteredUsers);
        }
      } catch (err) {
        console.error("Σφάλμα κατά το fetch χρηστών:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || selectedMembers.length === 0) return;

    const type = selectedMembers.length > 1 ? "GROUP" : "PRIVATE";

    const payload = {
      name: newRoomName,
      type,
      memberIds: selectedMembers.map((u) => u.id),
    };

    try {
      const res = await ApiService.createRoom(payload);
      if (res.status === 200 && res.data) {
        console.log("Room created:", res.data);

        const newRoom = {
          id: res.data.id,
          name: res.data.name || newRoomName,
          avatar: res.data.avatar || "https://i.pravatar.cc/150?img=12",
          lastMessage: "",
          time: "",
          messages: [],
        };

        onRoomCreated(newRoom);
        setNewRoomName("");
        setSelectedMembers([]);
        onHide();
        window.location.reload();
      } else {
        console.error("Αποτυχία δημιουργίας room");
      }
    } catch (err) {
      console.error("Σφάλμα κατά τη δημιουργία room:", err);
    }
  };

  return (
    <Dialog
      header="Νέα Συνομιλία"
      visible={visible}
      style={{ width: "400px" }}
      onHide={onHide}
      draggable
      resizable
    >
      <div className="create-room-form">
        <input
          type="text"
          placeholder="Όνομα συνομιλίας"
          value={newRoomName || ""}
          onChange={(e) => setNewRoomName(e.target.value)}
        />

        <MultiSelect
          value={selectedMembers || []}
          options={users || []}
          optionLabel="username"
          placeholder="Επίλεξε μέλη"
          onChange={(e) => setSelectedMembers(e.value)}
        />

        <button onClick={handleCreateRoom}>Δημιουργία</button>
      </div>
    </Dialog>
  );
};

export default CreateRoom;