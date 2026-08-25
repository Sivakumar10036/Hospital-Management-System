import
{
    createContext,
    useContext,
    useEffect,
    useState
}
from "react";


import
{
    loginUser,
    registerUser
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


                    const role =
                        parsedUser?.role
                            ?.toString()
                            .trim()
                            .toUpperCase();


                    if (
                        role
                    )
                    {
                        setToken(
                            storedToken
                        );


                        setUser(
                        {
                            ...parsedUser,
                            role
                        });
                    }
                    else
                    {
                        localStorage.removeItem(
                            "token"
                        );


                        localStorage.removeItem(
                            "user"
                        );
                    }
                }
                catch (error)
                {
                    console.error(
                        "Authentication restore error:",
                        error
                    );


                    localStorage.removeItem(
                        "token"
                    );


                    localStorage.removeItem(
                        "user"
                    );
                }
            }


            setLoading(false);
        },
        []
    );


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


            if (
                !response?.success
            )
            {
                throw new Error(
                    response?.message ||
                    "Login failed"
                );
            }


            if (
                !response.token
            )
            {
                throw new Error(
                    "Authentication token was not received"
                );
            }


            if (
                !response.user
            )
            {
                throw new Error(
                    "User information was not received"
                );
            }


            const role =
                response.user.role
                    ?.toString()
                    .trim()
                    .toUpperCase();


            if (
                !role
            )
            {
                throw new Error(
                    "User role was not received"
                );
            }


            const normalizedUser =
            {
                ...response.user,

                role
            };


            localStorage.setItem(
                "token",
                response.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    normalizedUser
                )
            );


            setToken(
                response.token
            );


            setUser(
                normalizedUser
            );


            return {
                token:
                    response.token,

                user:
                    normalizedUser,

                profile:
                    response.profile
            };
        };


    const register =
        async (
            userData
        ) =>
        {
            return await registerUser(
                userData
            );
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
            user &&
            user.role
        );


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
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