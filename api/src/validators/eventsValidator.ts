import { z } from "zod";

export const validateEvent = (data: any): string | null => {
    const schema = z.object({
        creators: z.array(z.string()).nonempty("At least one creator is required!"),
        title: z.string().min(3, "Title must be at least 3 characters long!"),
        description: z.string().min(10, "Description must be at least 10 characters long!"),
        date: z.string().datetime("Invalid date format!"),
    });

    const result = schema.safeParse(data);

    if (!result.success) {
        return result.error.errors[0].message;
    }

    return null;
};