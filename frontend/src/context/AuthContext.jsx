import React, {
    createContext,
    useContext,
    useEffect,
    useState
}
from "react";

import {
    loginUser,
    doctorLoginUser,
    registerUser,
    getCurrentUser
}
from "../services/authService";


const AuthContext =
    createContext(null);


export const AuthProvider =
({
    children
}) =>
{
    const [
        user,
        setUser
    ] =
        useState(null);


    const [
        token,
        setToken
    ] =
        useState(null);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    useEffect(
        () =>
        {
            const storedToken =
                localStorage.getItem(
                    "token"
                );

            const storedUser =
                localStorage.getItem(
                    "user"
                );


            if (
                storedToken &&
                storedUser
            )
            {
                try
                {
                    const parsedUser =
                        JSON.parse(
                            storedUser
                        );

                    const normalizedUser =
                        normalizeUser(
                            parsedUser
                        );


                    setToken(
                        storedToken
                    );

                    setUser(
                        normalizedUser
                    );
                }
                catch (error)
                {
                    console.error(
                        "Failed to restore authentication:",
                        error
                    );


                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    setToken(null);

                    setUser(null);
                }
            }


            setLoading(false);
        },
        []
    );


    const normalizeUser =
    (
        receivedUser
    ) =>
    {
        if (!receivedUser)
        {
            return null;
        }


        const normalizedRole =
        (
            receivedUser.role ||
            receivedUser.user?.role ||
            receivedUser.userRole
        )
        ?.toString()
        .trim()
        .toUpperCase();


        return {
            ...receivedUser,

            role:
                normalizedRole
        };
    };


    const saveAuthentication =
    (
        authenticationData
    ) =>
    {
        const receivedToken =
            authenticationData?.token ||
            authenticationData?.accessToken ||
            authenticationData?.data?.token ||
            authenticationData?.data?.accessToken;


        const rawUser =
            authenticationData?.user ||
            authenticationData?.data?.user;


        const receivedUser =
            normalizeUser(
                rawUser
            );


        if (receivedToken)
        {
            localStorage.setItem(
                "token",
                receivedToken
            );


            setToken(
                receivedToken
            );
        }


        if (receivedUser)
        {
            localStorage.setItem(
                "user",
                JSON.stringify(
                    receivedUser
                )
            );


            setUser(
                receivedUser
            );
        }


        return {
            token:
                receivedToken,

            user:
                receivedUser
        };
    };


    const login =
    async (
        email,
        password
    ) =>
    {
        const response =
            await loginUser(
                email,
                password
            );


        return saveAuthentication(
            response
        );
    };


    const doctorLogin =
    async (
        email,
        password
    ) =>
    {
        const response =
            await doctorLoginUser(
                email,
                password
            );


        return saveAuthentication(
            response
        );
    };


    const register =
    async (
        userData
    ) =>
    {
        const response =
            await registerUser(
                userData
            );


        return response;
    };


    const refreshUser =
    async () =>
    {
        try
        {
            const response =
                await getCurrentUser();


            const rawUser =
                response?.user ||
                response?.data?.user ||
                response?.data;


            const refreshedUser =
                normalizeUser(
                    rawUser
                );


            if (refreshedUser)
            {
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        refreshedUser
                    )
                );


                setUser(
                    refreshedUser
                );
            }


            return refreshedUser;
        }
        catch (error)
        {
            console.error(
                "Failed to refresh user:",
                error
            );


            return null;
        }
    };


    const logout =
    () =>
    {
        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "user"
        );


        setToken(null);


        setUser(null);
    };


    const isAuthenticated =
        Boolean(
            token &&
            user
        );


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                doctorLogin,
                register,
                refreshUser,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth =
() =>
{
    return useContext(
        AuthContext
    );
};


export {
    AuthContext
};