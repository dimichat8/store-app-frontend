import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import ApiService from "../ApiService";
import "./CreateRoom.css";

const CreateRoom = ({ visible, onHide, onRoomCreated }) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // fetch όλων των χρηστών από backend (mock προς το παρόν)
    const fetchUsers = async () => {
      try {
        setUsers([
          { id: 1, name: "Μαρία Παπαδοπούλου" },
          { id: 2, name: "Νίκος Αντωνίου" },
          { id: 3, name: "Γιάννης Παπαδόπουλος" },
        ]);
      } catch (err) {
        console.error(err);
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
      memberIds: selectedMembers.map(u => u.id),
    };

    try {
      const res = await ApiService.createRoom(payload);
      if (res.status === 200 && res.data) {
        console.log("Room created:", res.data);

        // Χρησιμοποίησε το πραγματικό id που επιστρέφει το backend
        const newRoom = {
          id: res.data.id,   // το πραγματικό id από backend
          name: res.data.name || newRoomName,
          avatar: res.data.avatar || "https://i.pravatar.cc/150?img=12",
          lastMessage: "",
          time: "",
          messages: []
        };

        onRoomCreated(newRoom);   // ενημέρωσε το ChatScreen
        setNewRoomName("");
        setSelectedMembers([]);
        onHide();
      } else {
        console.error("Failed to create room");
      }
    } catch (err) {
      console.error(err);
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
  value={selectedMembers || []}   // Πάντα array
  options={users || []}           // Πάντα array
  optionLabel="name"
  placeholder="Επίλεξε μέλη"
  onChange={(e) => setSelectedMembers(e.value)}
/>

        <button onClick={handleCreateRoom}>Δημιουργία</button>
      </div>
    </Dialog>
  );
};

export default CreateRoom;
