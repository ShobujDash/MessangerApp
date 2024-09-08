import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { FaImage, FaVideo } from "react-icons/fa6";
import { FiArrowUpLeft } from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { logout } from "../redux/userSlice";
import Avatar from "./Avatar";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";

function Sidebar() {
  const user = useSelector((state) => state.user);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket(); 


  useEffect(() => {
    if (socket) {
   
      socket.emit("sidebar", user?._id);

      socket.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.reciver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.reciver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.reciver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
        console.log("condata",conversationUserData)
      });
  
    }
  }, [socket, user]);

  const handleLogout = () => {
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
  }

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600  flex flex-col justify-between">
        <div className="">
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 ${
                isActive && "bg-slate-200"
              }`
            }
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>
          <div
            onClick={() => setOpenSearchUser(true)}
            title="add friend"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200"
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={() => setEditUserOpen(true)}
            title={user?.name}
            className="mx-auto"
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile}
              userId={user?._id}
            />
            <div></div>
          </button>
          <button
            onClick={handleLogout}
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200"
          >
            <span className="-ml-1">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full  ">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-700 h-16 b">
            Message
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-scroll scrollbar flex flex-col gap-y-1">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore Users to start a conversation with.
              </p>
            </div>
          )}
          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={`/${conv?.userDetails?._id}`}
                key={conv?._id}
                className="flex items-center gap-2 py-2 px-2 border border-transparent hover:border-primary hover:rounded-md cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={50}
                    height={50}
                    userId={conv?.userDetails?._id}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-sm">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-2">
                    {conv?.lastMsg?.imageUrl && (
                      <div className="flex items-center justify-center">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </div>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <div className="flex items-center justify-center">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </div>
                    )}
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-sm ml-auto p-1 bg-primary text-white rounded-full font-semibold w-6 h-6 flex justify-center items-center">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* **  edit user details**** */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search User */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
}

export default Sidebar;
