import { useForm } from 'react-hook-form';
import { loginSchema } from "@/types/auth/userauth";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { apiClient } from "@/utils/api";
import { ADMIN_LOGIN } from "@/utils/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAdminAccessToken, setAdminRefreshToken } from "@/utils/localstorage";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "@/store/slice/auth";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const router = useNavigate();

    const form = useForm({
        resolver: zodResolver(loginSchema),
    });

    const { errors } = form.formState;

    const onSubmit = async (values) => {
        try {
            console.log(values);

            const response = await apiClient.post(ADMIN_LOGIN, {
                email: values.email,
                password: values.password,
            });
            const data = response.data;

            if (data) {
                toast.success("Login Successful");
                dispatch(setIsAuthenticated());
                setAdminAccessToken(data?.accessToken);
                setAdminRefreshToken(data?.refreshToken);
                setTimeout(() => {
                    router("/admin/courses");
                }, 1000);
            }

            console.log(values);

        } catch (error) {
            console.log('[LOGIN_ERROR]', error);
            toast.error("Invalid Email or Password");
        }
    };

    return (
        <section className="flex-1">
            <section className="mt-4 mb-3">
                <h1 className="text-center text-2xl font-semibold">
                    Acquel
                </h1>
                <p className="text-center text-muted-foreground text-lg">A Online Learning Platform</p>
            </section>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-4/5 lg:px-10 sm:px-2 mx-auto space-y-2">
                <input 
                    id="email" 
                    placeholder="Email Address" 
                    className="w-full border py-3 px-2 outline-none rounded-md border-neutral-400" 
                    type="text" 
                    {...form.register("email")} 
                />
                <label>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </label>

                <input 
                    id="password" 
                    placeholder="Password" 
                    className="border py-3 px-2 rounded-md outline-none border-neutral-400" 
                    type="password" 
                    {...form.register("password")} 
                />
                <label htmlFor="password">
                    {errors.password && <p className="text-xs text-red-500 mb-2">{errors.password.message}</p>}
                </label>

                <button 
                    type="submit" 
                    className={cn("bg-gradient-to-r from-purple-500 to-purple-600 px-2 py-3 rounded-md text-white text-lg")}
                >
                    Login
                </button>
            </form>
        </section>
    );
};

export default AdminLogin;
