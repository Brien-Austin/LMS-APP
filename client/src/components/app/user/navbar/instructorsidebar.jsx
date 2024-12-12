import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import SideBarItems from './sidebaritems.jsx';
import useInstructorRoutes from '@/hooks/useInstructorRoutes';
import { useAppDispatch } from '@/store/store';
import { setIsSideBarOpened } from '@/store/slice/layouts/layout';

const InstructorSideBar = ({ toggle }) => {
    const routes = useInstructorRoutes();
    const dispatch = useAppDispatch();

    return (
        <motion.div
            initial={false}
            animate={{ width: toggle ? 200 : 60 }}
            transition={{ duration: 0.3 }}
            className="h-full fixed border-r shadow-sm flex flex-col"
        >
            {/* Toggle Button */}
            <div className="absolute top-5 right-[-12px]">
                <div onClick={() => dispatch(setIsSideBarOpened())} className="cursor-pointer">
                    <div className="rounded-full border p-1 z-40 bg-white">
                        {toggle ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </div>
                </div>
            </div>

            {/* Sidebar Items */}
            <div className="flex flex-col items-center mt-16">
                {routes.map((route) => (
                    <SideBarItems
                        key={route.label}
                        route={route.route}
                        icon={route.icon}
                        isActive={route.isActive}
                        label={route.label}
                        open={toggle}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default InstructorSideBar;
