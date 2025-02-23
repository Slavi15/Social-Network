import { IUser } from "@/models/users";

export const validateUser = (data: Partial<IUser>): string | null => {
    if (!data.username || data.username.length < 3 || data.username.length > 50) {
        return "Username must be between 3-50 characters!";
    };

    if (!data.email || !/^[A-Za-z0-9]+@fmi.uni-sofia.bg$/.test(data.email)) {
        return "Invalid email format!";
    };

    return null;
};