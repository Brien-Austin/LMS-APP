import { useEffect, useState } from "react";
import clsx from "clsx";
import { getAdminAccessToken } from "@/utils/localstorage";
import { useNavigate } from "react-router-dom";
import SideBar from "../../user/navbar/sidebar";

const Adminlayout = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const adminAccessToken = getAdminAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (adminAccessToken === null) {
      navigate("/admin");
    }
  }, [adminAccessToken, navigate]);

  return (
    <>
      <SideBar toggle={toggle} setToggle={setToggle} />
      <div className={clsx('ml-20 transition px-5', toggle && 'ml-56 ')}>
        {children}
      </div>
    </>
  );
};

export default Adminlayout;
