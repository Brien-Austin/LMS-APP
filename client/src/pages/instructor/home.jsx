import InstructorHeader from "@/components/app/instructor/header";
import InstructorLayout from "@/components/app/instructor/instructorlayout";
import { useAuth } from "@/hooks/useAuth";
import { getUserName } from "@/utils/get-username";
import { getInstructorAccessToken } from "../../utils/localstorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Instructor = () => {
  const at = getInstructorAccessToken()
  const router = useNavigate()
  const [logged,setLogged] = useState('false')

  useEffect(()=>{
    if(at){
      setLogged(true)
    }
    

  })
  const { instructor, isInstructorLoading } = useAuth();
  console.log(instructor);
  return (
    <InstructorLayout>
      {isInstructorLoading ? (
        <div className="pt-5 w-72 h-8 bg-slate-50 animate-pulse" />
      ) : (
        <InstructorHeader name={getUserName(instructor?.email || '')} />
      )}
    </InstructorLayout>
  );
};

export default Instructor;
