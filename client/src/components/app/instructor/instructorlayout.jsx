import React, { useEffect } from "react";
import clsx from "clsx";
import { getInstructorAccessToken } from "@/utils/localstorage";
import { useNavigate } from "react-router-dom";
import InstructorRegister from "./register";
import InstructorLogin from "./login";
import InstructorSideBar from "../user/navbar/instructorsidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setIsIntructorAuthenticated } from "@/store/slice/auth";

const InstructorLayout = ({ children }) => {
  const toggle = useAppSelector((state) => state.layoutSlice.isInstructorSideBarOpened);
  const [authState, setAuthState] = React.useState("Register");

  const instructorAt = getInstructorAccessToken();  // Get the instructor token
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isInstructorAuthenticated } = useAppSelector((state) => state.authentication);

  useEffect(() => {
    // If there's an instructor token, set them as authenticated
    if (instructorAt) {
      dispatch(setIsIntructorAuthenticated());
    } else {
      dispatch(setIsIntructorAuthenticated(false));  // Set as not authenticated if no token
    }
  }, [instructorAt, dispatch]);

  // If the instructor is not authenticated and there's no token
  if (!isInstructorAuthenticated && !instructorAt) {
    return (
      <div>
        {authState === "Register" ? (
          <InstructorRegister setAuthState={setAuthState} />
        ) : (
          <InstructorLogin setAuthState={setAuthState} />
        )}
      </div>
    );
  }

  // If the instructor is authenticated or there's an access token
  return (
    <div>
      <InstructorSideBar toggle={toggle} />
      <div className={clsx("ml-20 transition px-5", toggle && "ml-56")}>
        {children}
      </div>
    </div>
  );
};

export default InstructorLayout;
