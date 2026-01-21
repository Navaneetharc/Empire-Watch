interface userData {
    name: string;
    email: string;
    password?: string; 
}

export const validateUserForm = (data: userData, isEditing: boolean): string | null => {
    const {name, email, password} = data;

    if(!name.trim()) return "Name is required.";
    if(name.trim().length < 3) return "Name must be at least 3 characters.";
    if (/\d/.test(name)) return "Name cannot contain numbers.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if(!email.trim()) return "Email is required.";
    if(!emailRegex.test(email)) return "Please enter a valid email address (e.g., user@example.com).";

    if(!isEditing || (password && password.length > 0)){
        const pwd = password || "";

        if(!pwd && !isEditing) return "password is required for new users.";

        if (pwd) {
            if (pwd.length < 8) return "Password must be at least 8 characters.";
            if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
            if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
            if (!/[0-9]/.test(pwd)) return "Password must contain at least one number.";
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Password must contain at least one special character.";
        }
    }

    return null;
}