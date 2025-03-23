import { IUser } from "@/models/users";

export const validateUser = (data: Partial<IUser>): string | null => {
    if (!data.username || data.username.length < 3 || data.username.length > 50) {
        return "Username must be between 3-50 characters!";
    };

    if (!data.email || !/^[A-Za-z0-9]+@fmi.uni-sofia.bg$/.test(data.email)) {
        return "Invalid email format!";
    };

    if (data.password && data.password.length < 8) {
        return "Password must be at least 8 characters long!";
    }

    return null;
};