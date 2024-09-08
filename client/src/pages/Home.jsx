import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import logo from "../assets/logo.png";
import Sidebar from "../components/Sidebar";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import { useSocket } from "../context/SocketContext";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket(); 

  const basepath = location.pathname === "/";

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response?.data?.data));

      if (response?.data?.data?.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // socket connection
  useEffect(() => {
    if (socket) {
      socket.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      });

      return () => {
        socket.off("onlineUser");
      };
    }
  }, [socket]);

  return (
    <div className="grid md:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={` bg-white ${!basepath && "hidden"} md:block`}>
        <Sidebar />
      </section>

      {/* message component */}
      <section className={`${basepath && "hidden"} `}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basepath ? "hidden" : "md:flex"
        }`}
      >
        <div>
          <img src={logo} width={200} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
}

export default Home;
