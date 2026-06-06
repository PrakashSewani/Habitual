"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    LuArrowLeft,
    LuCalendar,
    LuLock,
    LuSave,
    LuShieldAlert,
    LuTrash2,
    LuUser,
} from "react-icons/lu";

import Link
    from "next/link";

import { User } from "@/types/user";

import useAuthenticateUser
    from "@/hooks/useAuthenticateUser";

import useAxiosRequest
    from "@/hooks/useAxiosRequest";

import UserNavbar
    from "@/components/Navbar/UserNavbar";

import Footer
    from "@/components/Footer";

// ========================================
// PROFILE FORM
// ========================================

type ProfileFormProps = {
    user: User;
    logout: () => void;
};

const ProfileForm = ({ user, logout }: ProfileFormProps) => {

    const axiosRequest = useAxiosRequest();

    // ========================================
    // AVATAR STATE
    // ========================================

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarSuccess, setAvatarSuccess] = useState(false);

    useEffect(() => {
        axiosRequest.get("/user/avatar", { responseType: "blob" })
            .then(resp => {
                const url = URL.createObjectURL(resp.data);
                setAvatarUrl(url);
            })
            .catch(() => {
                // No avatar available
            });
    }, [axiosRequest]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setAvatarLoading(true);
        setAvatarSuccess(false);
        try {
            const formData = new FormData();
            formData.append("file", avatarFile);
            await axiosRequest.post("/user/avatar", formData);
            setAvatarSuccess(true);
            setAvatarFile(null);
        } catch {
            // Error handled by interceptor
        } finally {
            setAvatarLoading(false);
        }
    };

    // ========================================
    // PROFILE STATE
    // ========================================

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
    const [dateOfBirth, setDateOfBirth] = useState(
        user.dateOfBirth ? user.dateOfBirth.split("T")[0] : ""
    );
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
    const [profileSubmitting, setProfileSubmitting] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);

    // ========================================
    // PASSWORD STATE
    // ========================================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // ========================================
    // DELETE STATE
    // ========================================

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ========================================
    // PROFILE VALIDATION
    // ========================================

    const validateProfile = () => {
        const errors: Record<string, string> = {};
        if (!name.trim()) {
            errors.name = "Name is required.";
        }
        if (!email.trim()) {
            errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format.";
        }
        if (!phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required.";
        }
        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ========================================
    // PROFILE SUBMIT
    // ========================================

    const handleProfileSubmit = async () => {
        if (!validateProfile()) return;

        setProfileSubmitting(true);
        setProfileSuccess(false);

        try {
            await axiosRequest.put("/user/update", {
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
            });
            setProfileSuccess(true);
        } catch {
            setProfileErrors({ general: "Failed to update profile. Please try again." });
        } finally {
            setProfileSubmitting(false);
        }
    };

    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    const validatePassword = () => {
        const errors: Record<string, string> = {};
        if (!currentPassword) {
            errors.currentPassword = "Current password is required.";
        }
        if (!newPassword) {
            errors.newPassword = "New password is required.";
        } else if (newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/.test(newPassword)) {
            errors.newPassword = "Password must contain uppercase, lowercase, number, and special character.";
        }
        if (newPassword !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ========================================
    // PASSWORD SUBMIT
    // ========================================

    const handlePasswordSubmit = async () => {
        if (!validatePassword()) return;

        setPasswordSubmitting(true);
        setPasswordSuccess(false);

        try {
            await axiosRequest.put("/user/password", {
                currentPassword,
                newPassword,
            });
            setPasswordSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            setPasswordErrors({ general: "Failed to update password. Please check your current password." });
        } finally {
            setPasswordSubmitting(false);
        }
    };

    // ========================================
    // DELETE ACCOUNT
    // ========================================

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "delete") {
            setDeleteError("Type \u201Cdelete\u201D to confirm.");
            return;
        }

        setDeleteSubmitting(true);
        setDeleteError("");

        try {
            await axiosRequest.delete("/user/delete");
            logout();
        } catch {
            setDeleteError("Failed to delete account. Please try again.");
            setDeleteSubmitting(false);
        }
    };

    return (
        <>
            {/* CONTENT */}
            <Flex
                gap={{ base: 0, md: 8 }}
                align="start"
                direction={{ base: "column", md: "row" }}
            >
                {/* LEFT: PROFILE + PASSWORD */}
                <Box flex={1} minW={0}>
                    {/* PROFILE INFO */}
                    <Box
                        mb={8}
                        p={6}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor="rgba(148,163,184,0.14)"
                        bg="white"
                        _dark={{
                            bg: "#111827",
                            borderColor: "rgba(255,255,255,0.06)",
                        }}
                    >
                        <HStack gap={3} mb={6}>
                            <Box
                                p={2}
                                borderRadius="xl"
                                bg="rgba(99,102,241,0.10)"
                                color="#6366F1"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <LuUser size={18} />
                            </Box>
                            <Text
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                            >
                                Profile Information
                            </Text>
                        </HStack>

                        <VStack align="stretch" gap={5}>
                            {/* AVATAR */}
                            <Box display="flex" alignItems="center" gap={4}>
                                <Box
                                    w="64px"
                                    h="64px"
                                    borderRadius="full"
                                    bg="rgba(99,102,241,0.10)"
                                    overflow="hidden"
                                    border="2px solid"
                                    borderColor="rgba(99,102,241,0.20)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <LuUser size={28} color="#6366F1" />
                                    )}
                                </Box>
                                <VStack align="start" gap={2}>
                                    <Input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={handleAvatarChange}
                                        size="sm"
                                        borderRadius="xl"
                                        borderColor="rgba(148,163,184,0.22)"
                                        _dark={{ borderColor: "rgba(148,163,184,0.22)" }}
                                        p={1}
                                    />
                                    <Button
                                        size="sm"
                                        bg="#6366F1"
                                        color="white"
                                        borderRadius="xl"
                                        fontWeight="600"
                                        onClick={handleAvatarUpload}
                                        loading={avatarLoading}
                                        disabled={!avatarFile}
                                        _hover={{ bg: "#5558E3" }}
                                    >
                                        Upload Avatar
                                    </Button>
                                    {avatarSuccess && (
                                        <Text fontSize="xs" color="#10B981" fontWeight="600">
                                            Avatar updated successfully.
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                            {/* NAME */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Full Name
                                </Text>
                                <Input
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={profileErrors.name ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {profileErrors.name && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {profileErrors.name}
                                    </Text>
                                )}
                            </Box>

                            {/* EMAIL */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Email
                                </Text>
                                <Input
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={profileErrors.email ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {profileErrors.email && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {profileErrors.email}
                                    </Text>
                                )}
                            </Box>

                            {/* PHONE */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Phone Number
                                </Text>
                                <Input
                                    placeholder="+1234567890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={profileErrors.phoneNumber ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {profileErrors.phoneNumber && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {profileErrors.phoneNumber}
                                    </Text>
                                )}
                            </Box>

                            {/* DATE OF BIRTH */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Date of Birth
                                </Text>
                                <Input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor="rgba(148,163,184,0.22)"
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                            </Box>

                            {profileErrors.general && (
                                <Text fontSize="xs" color="red.400">
                                    {profileErrors.general}
                                </Text>
                            )}

                            {profileSuccess && (
                                <Text fontSize="xs" color="#10B981" fontWeight="600">
                                    Profile updated successfully.
                                </Text>
                            )}

                            <Button
                                bg="#6366F1"
                                color="white"
                                borderRadius="full"
                                px={6}
                                _hover={{ bg: "#5558E3" }}
                                loading={profileSubmitting}
                                onClick={handleProfileSubmit}
                                alignSelf="flex-start"
                            >
                                <LuSave />
                                Save Changes
                            </Button>
                        </VStack>
                    </Box>

                    {/* PASSWORD */}
                    <Box
                        mb={8}
                        p={6}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor="rgba(148,163,184,0.14)"
                        bg="white"
                        _dark={{
                            bg: "#111827",
                            borderColor: "rgba(255,255,255,0.06)",
                        }}
                    >
                        <HStack gap={3} mb={6}>
                            <Box
                                p={2}
                                borderRadius="xl"
                                bg="rgba(99,102,241,0.10)"
                                color="#6366F1"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <LuLock size={18} />
                            </Box>
                            <Text
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                            >
                                Change Password
                            </Text>
                        </HStack>

                        <VStack align="stretch" gap={5}>
                            {/* CURRENT PASSWORD */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Current Password
                                </Text>
                                <Input
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={passwordErrors.currentPassword ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {passwordErrors.currentPassword && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {passwordErrors.currentPassword}
                                    </Text>
                                )}
                            </Box>

                            {/* NEW PASSWORD */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    New Password
                                </Text>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={passwordErrors.newPassword ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {passwordErrors.newPassword && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {passwordErrors.newPassword}
                                    </Text>
                                )}
                            </Box>

                            {/* CONFIRM PASSWORD */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    mb={2}
                                    color="#0F172A"
                                    _dark={{ color: "#F8FAFC" }}
                                >
                                    Confirm New Password
                                </Text>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    borderRadius="2xl"
                                    size="lg"
                                    bg="white"
                                    _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                    border="1px solid"
                                    borderColor={passwordErrors.confirmPassword ? "red.400" : "rgba(148,163,184,0.22)"}
                                    _hover={{ borderColor: "#6366F1" }}
                                    _focusVisible={{
                                        borderColor: "#6366F1",
                                        boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
                                    }}
                                />
                                {passwordErrors.confirmPassword && (
                                    <Text fontSize="xs" color="red.400" mt={2}>
                                        {passwordErrors.confirmPassword}
                                    </Text>
                                )}
                            </Box>

                            {passwordErrors.general && (
                                <Text fontSize="xs" color="red.400">
                                    {passwordErrors.general}
                                </Text>
                            )}

                            {passwordSuccess && (
                                <Text fontSize="xs" color="#10B981" fontWeight="600">
                                    Password updated successfully.
                                </Text>
                            )}

                            <Button
                                bg="#6366F1"
                                color="white"
                                borderRadius="full"
                                px={6}
                                _hover={{ bg: "#5558E3" }}
                                loading={passwordSubmitting}
                                onClick={handlePasswordSubmit}
                                alignSelf="flex-start"
                            >
                                <LuLock />
                                Update Password
                            </Button>
                        </VStack>
                    </Box>
                </Box>

                {/* RIGHT: DANGER ZONE */}
                <Box
                    w={{ base: "full", md: "320px" }}
                    flexShrink={0}
                >
                    <Box
                        p={6}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor="rgba(239,68,68,0.20)"
                        bg="rgba(239,68,68,0.03)"
                        _dark={{
                            bg: "rgba(239,68,68,0.05)",
                            borderColor: "rgba(239,68,68,0.25)",
                        }}
                    >
                        <HStack gap={3} mb={4}>
                            <Box
                                p={2}
                                borderRadius="xl"
                                bg="rgba(239,68,68,0.10)"
                                color="#EF4444"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <LuShieldAlert size={18} />
                            </Box>
                            <Text
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                            >
                                Danger Zone
                            </Text>
                        </HStack>

                        <Text
                            fontSize="sm"
                            color="#64748B"
                            _dark={{ color: "#94A3B8" }}
                            mb={4}
                        >
                            Deleting your account will permanently remove all your data, including habits and progress. This action cannot be undone.
                        </Text>

                        <Box mb={4}>
                            <Text
                                fontSize="xs"
                                fontWeight="600"
                                color="#EF4444"
                                mb={2}
                            >
                                Type &quot;delete&quot; to confirm
                            </Text>
                            <Input
                                value={deleteConfirm}
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                borderRadius="2xl"
                                size="lg"
                                bg="white"
                                _dark={{ bg: "#111827", color: "#F8FAFC" }}
                                border="1px solid"
                                borderColor={deleteError ? "red.400" : "rgba(239,68,68,0.30)"}
                                _hover={{ borderColor: "#EF4444" }}
                                _focusVisible={{
                                    borderColor: "#EF4444",
                                    boxShadow: "0 0 0 4px rgba(239,68,68,0.12)",
                                }}
                            />
                            {deleteError && (
                                <Text fontSize="xs" color="red.400" mt={2}>
                                    {deleteError}
                                </Text>
                            )}
                        </Box>

                        <Button
                            w="full"
                            bg="#EF4444"
                            color="white"
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: "#DC2626" }}
                            loading={deleteSubmitting}
                            onClick={handleDeleteAccount}
                        >
                            <LuTrash2 />
                            Delete Account
                        </Button>
                    </Box>

                    {/* MEMBER SINCE */}
                    {user?.createdAt && (
                        <Box
                            mt={6}
                            p={4}
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor="rgba(148,163,184,0.14)"
                            bg="white"
                            _dark={{
                                bg: "#111827",
                                borderColor: "rgba(255,255,255,0.06)",
                            }}
                        >
                            <HStack gap={2} mb={2}>
                                <LuCalendar size={14} color="#64748B" />
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color="#64748B"
                                    _dark={{ color: "#94A3B8" }}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                >
                                    Member since
                                </Text>
                            </HStack>
                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color="#0F172A"
                                _dark={{ color: "#F8FAFC" }}
                            >
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </Text>
                        </Box>
                    )}
                </Box>
            </Flex>
        </>
    );
};

// ========================================
// PAGE
// ========================================

const ProfilePage = () => {

    const {
        user,
        loading: userLoading,
        logout,
    } = useAuthenticateUser();

    // ========================================
    // LOADING
    // ========================================

    if (userLoading) {
        return (
            <Flex
                minH="100dvh"
                bg="#0B0F1A"
                align="center"
                justify="center"
            >
                <VStack gap={6}>
                    <Spinner size="xl" color="#6366F1" />
                    <Text
                        color="#F8FAFC"
                        fontSize="sm"
                        textTransform="uppercase"
                        letterSpacing="0.18em"
                    >
                        Authenticating...
                    </Text>
                </VStack>
            </Flex>
        );
    }

    // ========================================
    // RENDER
    // ========================================

    return (
        <Box
            minH="100dvh"
            display="flex"
            flexDirection="column"
            bg="#FAFAFF"
            _dark={{ bg: "#0B0F1A" }}
        >
            <UserNavbar
                userName={user?.name}
                currentTime={new Date()}
                logout={logout}
            />

            <Box
                maxW="1200px"
                mx="auto"
                w="full"
                px={{ base: 4, md: 8, lg: 10 }}
                pt={{ base: 6, md: 8 }}
                pb={20}
            >
                {/* HEADER */}
                <Box pb={4} mb={6}>
                    <HStack gap={4} mb={4}>
                        <Link href="/dashboard">
                            <Button
                                size="sm"
                                variant="ghost"
                                borderRadius="full"
                                color="#64748B"
                                _dark={{ color: "#94A3B8" }}
                                _hover={{
                                    bg: "rgba(99,102,241,0.08)",
                                    color: "#6366F1",
                                }}
                            >
                                <LuArrowLeft />
                                Dashboard
                            </Button>
                        </Link>
                    </HStack>

                    <Heading
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="800"
                        letterSpacing="-0.03em"
                        color="#0F172A"
                        _dark={{ color: "#F8FAFC" }}
                        lineHeight="1.1"
                        mb={2}
                    >
                        Profile
                    </Heading>
                    <Text
                        fontSize="sm"
                        color="#64748B"
                        _dark={{ color: "#94A3B8" }}
                    >
                        Manage your personal information and account security.
                    </Text>
                </Box>

                {user && (
                    <ProfileForm
                        key={user.id}
                        user={user}
                        logout={logout}
                    />
                )}
            </Box>

            <Footer />
        </Box>
    );
};

export default ProfilePage;
