export default interface Address {
    line1: string;
    city: string;
    state: string;
    pincode: string;
}

export default interface User {
    // Core user info
    id: string;
    name: string;
    email: string;
    image: string | null | undefined;
    emailVerified: boolean;

    userCreatedAt: string;
    userUpdatedAt: string;

    // Profile details
    profileId: string | null;
    phone: string | null;
    address: Address | null;
    rating: string;

    profileCreatedAt: string | null;
    profileUpdatedAt: string | null;
}
