import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityBar from "../components/currentactivitybar";
import Allrooms from "../components/rooms";
import MessageArea from "../components/messagearea";
import MessageView from "../components/messageview";

function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    // Optionally, show nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <div style={{ display: "flex" }}>
      <ActivityBar />
      <Allrooms />
      <div>
        <MessageArea />
        <MessageView />
      </div>
    </div>
  );
}

export default Home;