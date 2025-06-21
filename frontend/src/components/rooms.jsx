import React, { useEffect, useState } from "react";
import './rooms.css';
import roomStore from './activeroomstore';

function Allrooms() {
  const [rooms, setRooms] = useState([]);
  const setactiveroom = roomStore((state) => state.setactiveroom);
  const activeroom = roomStore((state) => state.activeroom);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/auth/my-rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div id="rooms"
      style={{
        width: '330px',
        height: "100vh",
        borderRight: "2px solid #10192A",
        padding: "20px",
        color: "#fff",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span
        style={{
          fontFamily: 'ISOCPEUR',
          fontSize: "40px",
          color: "#fff",
          letterSpacing: "1px",
          fontWeight: "bold",
        }}
      >
        Messages
      </span>

      <input type="text" id="searchbox"
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          height: '40px',
          background: "#0F1B2B",
          border: 'none',
          borderRadius: "5px",
          fontFamily: 'ISOCPEUR',
          fontSize: '20px',
          paddingLeft: '20px',
          color: 'white',
        }}
        placeholder="Search"
      />

      <div style={{ marginTop: "20px" }}>
        {rooms.map(room => (
          <div
    key={room._id}
    style={{
      marginBottom: "12px",
      marginTop: "12px",
      border: '2px solid #10192A',
      display: 'flex',
      alignContent: 'center',
      flexDirection: 'center',
      fontFamily: 'ISOCPEUR',
      fontSize: '30px',
      padding: '10px',
      borderRadius: '10px',
    }}
    className="roomthumbnail"
    onClick={() => setactiveroom(room)}
  >
    {room.name}
  </div>
        ))}
      </div>
    </div>
  );
}

export default Allrooms;