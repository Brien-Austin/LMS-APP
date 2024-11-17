import React, { useEffect } from "react";

import clsx from "clsx";

import { getInstructorAccessToken } from "@/utils/localstorage";
import { useNavigate } from "react-router-dom";

import { AuthState } from "@/types/auth/userauth";
import InstructorRegister from "./register";
import InstructorLogin from "./login";
import InstructorSideBar from "../user/navbar/instructorsidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setIsIntructorAuthenticated } from "@/store/slice/auth";


const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const toggle = useAppSelector((state)=>state.layoutSlice.isInstructorSideBarOpened)
  
  
  const [authState, setAuthState] = React.useState<AuthState>("Register");

 
  const instructorAt = getInstructorAccessToken();
  console.log(instructorAt);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const {isInstructorAuthenticated} = useAppSelector((state)=>state.authentication)

  useEffect(() => {
    if (instructorAt) {
      dispatch(setIsIntructorAuthenticated())
      
    }
    if( instructorAt === null){
      dispatch(setIsIntructorAuthenticated())
    }
  }, [instructorAt, navigate,dispatch]);
  return (
    <>

        {!isInstructorAuthenticated && !instructorAt ? (
          <div>
            {authState === "Register" ? (
              <InstructorRegister setAuthState={setAuthState} />
            ) : (
              <InstructorLogin setAuthState={setAuthState} />
            )}
          </div>
        ) : (
          <div>
            <InstructorSideBar toggle={toggle}  />

            <div className={clsx("ml-20 transition px-5", toggle && "ml-56 ")}>
              {children}
            </div>
          </div>
        )}
  
    </>
  );
};

export default InstructorLayout;
