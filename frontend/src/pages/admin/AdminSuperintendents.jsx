import React, {
    useEffect,
    useState
} from "react";

import {
    Search,
    Plus,
    RefreshCw,
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    ShieldOff,
    Badge
} from "lucide-react";

import {
    createSuperintendent,
    getAllSuperintendents,
    updateSuperintendentStatus
} from "../../services/superintendentService";

import "../../styles/AdminSuperintendents.css";


const AdminSuperintendents = () =>
{
    const [
        superintendents,
        setSuperintendents
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    const [
        creating,
        setCreating
    ] = useState(false);


    const [
        searchTerm,
        setSearchTerm
    ] = useState("");


    const [
        showForm,
        setShowForm
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const [
        formData,
        setFormData
    ] = useState(
        {
            name: "",
            email: "",
            phone: "",
            employeeId: "",
            password: ""
        }
    );


    /*
    ============================================================
    EXTRACT SUPERINTENDENTS
    ============================================================
    */

    const extractSuperintendents =
    (
        response
    ) =>
    {
        if (
            Array.isArray(response)
        )
        {
            return response;
        }


        if (
            Array.isArray(
                response?.superintendents
            )
        )
        {
            return response.superintendents;
        }


        if (
            Array.isArray(
                response?.data
            )
        )
        {
            return response.data;
        }


        if (
            Array.isArray(
                response?.data?.superintendents
            )
        )
        {
            return response.data.superintendents;
        }


        if (
            Array.isArray(
                response?.data?.data
            )
        )
        {
            return response.data.data;
        }


        if (
            Array.isArray(
                response?.results
            )
        )
        {
            return response.results;
        }


        if (
            Array.isArray(
                response?.data?.results
            )
        )
        {
            return response.data.results;
        }


        return [];
    };


    /*
    ============================================================
    LOAD SUPERINTENDENTS
    ============================================================
    */

    const loadSuperintendents =
    async (
        refresh = false
    ) =>
    {
        try
        {
            if (
                refresh
            )
            {
                setRefreshing(true);
            }
            else
            {
                setLoading(true);
            }


            setError("");
            setSuccess("");


            const response =
                await getAllSuperintendents();


            console.log(
                "SUPERINTENDENTS API RESPONSE:",
                response
            );


            const superintendentList =
                extractSuperintendents(
                    response
                );


            setSuperintendents(
                superintendentList
            );
        }
        catch (
            requestError
        )
        {
            console.error(
                "SUPERINTENDENT LOAD ERROR:",
                requestError
            );


            setSuperintendents(
                []
            );


            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to load superintendents."
            );
        }
        finally
        {
            setLoading(false);
            setRefreshing(false);
        }
    };


    /*
    ============================================================
    INITIAL LOAD
    ============================================================
    */

    useEffect(
        () =>
        {
            loadSuperintendents();
        },
        []
    );


    /*
    ============================================================
    HANDLE INPUT
    ============================================================
    */

    const handleChange =
    (
        event
    ) =>
    {
        const {
            name,
            value
        } = event.target;


        setFormData(
            previous =>
            ({
                ...previous,
                [name]: value
            })
        );
    };


    /*
    ============================================================
    RESET FORM
    ============================================================
    */

    const resetForm =
    () =>
    {
        setFormData(
            {
                name: "",
                email: "",
                phone: "",
                employeeId: "",
                password: ""
            }
        );
    };


    /*
    ============================================================
    CREATE SUPERINTENDENT
    ============================================================
    */

    const handleCreate =
    async (
        event
    ) =>
    {
        event.preventDefault();


        setError("");
        setSuccess("");


        const name =
            formData.name.trim();

        const email =
            formData.email.trim();

        const phone =
            formData.phone.trim();

        const employeeId =
            formData.employeeId.trim();

        const password =
            formData.password.trim();


        /*
        FRONTEND VALIDATION
        */

        if (
            !name ||
            !email ||
            !phone ||
            !employeeId ||
            !password
        )
        {
            setError(
                "Name, email, password, phone and employee ID are required."
            );

            return;
        }


        if (
            password.length < 6
        )
        {
            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (
            phone.length < 10
        )
        {
            setError(
                "Please enter a valid phone number."
            );

            return;
        }


        try
        {
            setCreating(true);


            const payload =
            {
                name,
                email,
                phone,
                employeeId,
                password
            };


            console.log(
                "CREATE SUPERINTENDENT PAYLOAD:",
                payload
            );


            const response =
                await createSuperintendent(
                    payload
                );


            console.log(
                "CREATE SUPERINTENDENT RESPONSE:",
                response
            );


            if (
                response?.success === false
            )
            {
                setError(
                    response.message ||
                    "Unable to create superintendent."
                );

                return;
            }


            setSuccess(
                "Superintendent created successfully."
            );


            resetForm();


            setShowForm(false);


            await loadSuperintendents(
                true
            );
        }
        catch (
            requestError
        )
        {
            console.error(
                "CREATE SUPERINTENDENT ERROR:",
                requestError
            );


            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to create superintendent."
            );
        }
        finally
        {
            setCreating(false);
        }
    };


    /*
    ============================================================
    UPDATE STATUS
    ============================================================
    */

    const handleStatus =
    async (
        superintendent
    ) =>
    {
        try
        {
            setError("");
            setSuccess("");


            const id =
                superintendent._id ||
                superintendent.id ||
                superintendent.user?._id ||
                superintendent.user?.id;


            if (
                !id
            )
            {
                setError(
                    "Superintendent ID is missing."
                );

                return;
            }


            const currentStatus =
                superintendent.isActive ??
                superintendent.active ??
                superintendent.user?.isActive ??
                superintendent.user?.active ??
                true;


            const response =
                await updateSuperintendentStatus(
                    id,
                    {
                        isActive:
                            !currentStatus
                    }
                );


            console.log(
                "STATUS UPDATE RESPONSE:",
                response
            );


            if (
                response?.success === false
            )
            {
                setError(
                    response.message ||
                    "Unable to update status."
                );

                return;
            }


            setSuccess(
                currentStatus
                    ?
                    "Superintendent deactivated successfully."
                    :
                    "Superintendent activated successfully."
            );


            await loadSuperintendents(
                true
            );
        }
        catch (
            requestError
        )
        {
            console.error(
                "STATUS UPDATE ERROR:",
                requestError
            );


            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to update superintendent status."
            );
        }
    };


    /*
    ============================================================
    GET NAME
    ============================================================
    */

    const getSuperintendentName =
    (
        superintendent
    ) =>
    {
        return (
            superintendent.name ||
            superintendent.fullName ||
            superintendent.user?.name ||
            superintendent.user?.fullName ||
            superintendent.profile?.name ||
            "Hospital Superintendent"
        );
    };


    /*
    ============================================================
    GET EMAIL
    ============================================================
    */

    const getSuperintendentEmail =
    (
        superintendent
    ) =>
    {
        return (
            superintendent.email ||
            superintendent.user?.email ||
            superintendent.profile?.email ||
            "Not provided"
        );
    };


    /*
    ============================================================
    GET PHONE
    ============================================================
    */

    const getSuperintendentPhone =
    (
        superintendent
    ) =>
    {
        return (
            superintendent.phone ||
            superintendent.mobile ||
            superintendent.user?.phone ||
            superintendent.user?.mobile ||
            superintendent.profile?.phone ||
            "Not provided"
        );
    };


    /*
    ============================================================
    GET EMPLOYEE ID
    ============================================================
    */

    const getSuperintendentEmployeeId =
    (
        superintendent
    ) =>
    {
        return (
            superintendent.employeeId ||
            superintendent.employeeID ||
            superintendent.employee_id ||
            superintendent.user?.employeeId ||
            superintendent.user?.employeeID ||
            superintendent.profile?.employeeId ||
            "Not provided"
        );
    };


    /*
    ============================================================
    GET ID
    ============================================================
    */

    const getSuperintendentId =
    (
        superintendent
    ) =>
    {
        return (
            superintendent._id ||
            superintendent.id ||
            superintendent.user?._id ||
            superintendent.user?.id
        );
    };


    /*
    ============================================================
    GET STATUS
    ============================================================
    */

    const getSuperintendentStatus =
    (
        superintendent
    ) =>
    {
        return (
            superintendent.isActive ??
            superintendent.active ??
            superintendent.user?.isActive ??
            superintendent.user?.active ??
            true
        );
    };


    /*
    ============================================================
    SEARCH
    ============================================================
    */

    const filteredSuperintendents =
        superintendents.filter(
            superintendent =>
            {
                const name =
                    getSuperintendentName(
                        superintendent
                    );

                const email =
                    getSuperintendentEmail(
                        superintendent
                    );

                const phone =
                    getSuperintendentPhone(
                        superintendent
                    );

                const employeeId =
                    getSuperintendentEmployeeId(
                        superintendent
                    );


                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();


                return (
                    name
                        .toLowerCase()
                        .includes(search)
                    ||
                    email
                        .toLowerCase()
                        .includes(search)
                    ||
                    phone
                        .toLowerCase()
                        .includes(search)
                    ||
                    employeeId
                        .toLowerCase()
                        .includes(search)
                );
            }
        );


    /*
    ============================================================
    JSX
    ============================================================
    */

    return (
        <div
            className="admin-superintendents-page"
        >

            <div
                className="admin-superintendents-container"
            >

                {/* HEADER */}

                <div
                    className="admin-superintendents-header"
                >

                    <div>

                        <span
                            className="admin-superintendents-eyebrow"
                        >
                            HOSPITAL ADMINISTRATION
                        </span>


                        <h1>
                            Superintendents
                        </h1>


                        <p>
                            Create and manage
                            hospital superintendent
                            accounts.
                        </p>

                    </div>


                    <div
                        className="admin-superintendents-actions"
                    >

                        <button
                            type="button"
                            className="admin-superintendents-refresh"
                            onClick={() =>
                                loadSuperintendents(
                                    true
                                )
                            }
                            disabled={
                                refreshing
                            }
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ?
                                        "admin-superintendents-spin"
                                        :
                                        ""
                                }
                            />

                            {
                                refreshing
                                    ?
                                    "Refreshing..."
                                    :
                                    "Refresh"
                            }

                        </button>


                        <button
                            type="button"
                            className="admin-superintendents-add"
                            onClick={() =>
                            {
                                setShowForm(
                                    previous =>
                                        !previous
                                );

                                setError("");
                                setSuccess("");
                            }}
                        >

                            <Plus
                                size={18}
                            />

                            Add Superintendent

                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {
                    error &&
                    (
                        <div
                            className="admin-superintendents-message error"
                        >
                            {error}
                        </div>
                    )
                }


                {/* SUCCESS */}

                {
                    success &&
                    (
                        <div
                            className="admin-superintendents-message success"
                        >
                            {success}
                        </div>
                    )
                }


                {/* CREATE FORM */}

                {
                    showForm &&
                    (
                        <div
                            className="admin-superintendent-form-card"
                        >

                            <div
                                className="admin-superintendent-form-title"
                            >

                                <h2>
                                    Create Superintendent
                                </h2>

                                <p>
                                    Create a new hospital
                                    superintendent account.
                                </p>

                            </div>


                            <form
                                onSubmit={
                                    handleCreate
                                }
                            >

                                <div
                                    className="admin-superintendent-form-grid"
                                >

                                    {/* NAME */}

                                    <div
                                        className="admin-superintendent-field"
                                    >

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter full name"
                                            required
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div
                                        className="admin-superintendent-field"
                                    >

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter email"
                                            required
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div
                                        className="admin-superintendent-field"
                                    >

                                        <label>
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter phone number"
                                            required
                                        />

                                    </div>


                                    {/* EMPLOYEE ID */}

                                    <div
                                        className="admin-superintendent-field"
                                    >

                                        <label>
                                            Employee ID
                                        </label>

                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={
                                                formData.employeeId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter employee ID"
                                            required
                                        />

                                    </div>


                                    {/* PASSWORD */}

                                    <div
                                        className="admin-superintendent-field"
                                    >

                                        <label>
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter password"
                                            minLength={6}
                                            required
                                        />

                                        <small>
                                            Password must contain
                                            at least 6 characters.
                                        </small>

                                    </div>

                                </div>


                                {/* FORM ACTIONS */}

                                <div
                                    className="admin-superintendent-form-actions"
                                >

                                    <button
                                        type="button"
                                        className="admin-superintendent-cancel"
                                        onClick={() =>
                                        {
                                            resetForm();
                                            setShowForm(false);
                                            setError("");
                                        }}
                                        disabled={
                                            creating
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="admin-superintendent-submit"
                                        disabled={
                                            creating
                                        }
                                    >

                                        {
                                            creating
                                                ?
                                                <>
                                                    <RefreshCw
                                                        size={17}
                                                        className="admin-superintendents-spin"
                                                    />

                                                    Creating...
                                                </>
                                                :
                                                <>
                                                    <Plus
                                                        size={17}
                                                    />

                                                    Create Superintendent
                                                </>
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>
                    )
                }


                {/* SEARCH */}

                <div
                    className="admin-superintendents-toolbar"
                >

                    <div
                        className="admin-superintendents-search"
                    >

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search by name, email, phone or employee ID..."
                            value={
                                searchTerm
                            }
                            onChange={
                                event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div
                        className="admin-superintendents-count"
                    >

                        <UserRound
                            size={18}
                        />

                        <span>

                            {
                                filteredSuperintendents.length
                            }

                            {
                                filteredSuperintendents.length === 1
                                    ?
                                    " Superintendent"
                                    :
                                    " Superintendents"
                            }

                        </span>

                    </div>

                </div>


                {/* TABLE */}

                <div
                    className="admin-superintendents-card"
                >

                    {
                        loading
                            ?
                            (
                                <div
                                    className="admin-superintendents-loading"
                                >

                                    <RefreshCw
                                        size={30}
                                        className="admin-superintendents-spin"
                                    />

                                    <p>
                                        Loading superintendents...
                                    </p>

                                </div>
                            )
                            :
                            filteredSuperintendents.length === 0
                                ?
                                (
                                    <div
                                        className="admin-superintendents-empty"
                                    >

                                        <UserRound
                                            size={46}
                                        />

                                        <h3>
                                            No Superintendents Found
                                        </h3>

                                        <p>
                                            No superintendent
                                            accounts were found.
                                        </p>

                                        <button
                                            type="button"
                                            className="admin-superintendents-refresh"
                                            onClick={() =>
                                                loadSuperintendents(
                                                    true
                                                )
                                            }
                                        >

                                            <RefreshCw
                                                size={17}
                                            />

                                            Try Again

                                        </button>

                                    </div>
                                )
                                :
                                (
                                    <div
                                        className="admin-superintendents-table-wrapper"
                                    >

                                        <table
                                            className="admin-superintendents-table"
                                        >

                                            <thead>

                                                <tr>

                                                    <th>
                                                        SUPERINTENDENT
                                                    </th>

                                                    <th>
                                                        EMPLOYEE ID
                                                    </th>

                                                    <th>
                                                        EMAIL
                                                    </th>

                                                    <th>
                                                        PHONE
                                                    </th>

                                                    <th>
                                                        ROLE
                                                    </th>

                                                    <th>
                                                        STATUS
                                                    </th>

                                                    <th>
                                                        ACTION
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {
                                                    filteredSuperintendents.map(
                                                        superintendent =>
                                                        {
                                                            const name =
                                                                getSuperintendentName(
                                                                    superintendent
                                                                );


                                                            const email =
                                                                getSuperintendentEmail(
                                                                    superintendent
                                                                );


                                                            const phone =
                                                                getSuperintendentPhone(
                                                                    superintendent
                                                                );


                                                            const employeeId =
                                                                getSuperintendentEmployeeId(
                                                                    superintendent
                                                                );


                                                            const isActive =
                                                                getSuperintendentStatus(
                                                                    superintendent
                                                                );


                                                            const id =
                                                                getSuperintendentId(
                                                                    superintendent
                                                                );


                                                            return (
                                                                <tr
                                                                    key={
                                                                        id ||
                                                                        `${email}-${employeeId}`
                                                                    }
                                                                >

                                                                    {/* NAME */}

                                                                    <td>

                                                                        <div
                                                                            className="admin-superintendent-person"
                                                                        >

                                                                            <div
                                                                                className="admin-superintendent-avatar"
                                                                            >

                                                                                <UserRound
                                                                                    size={20}
                                                                                />

                                                                            </div>


                                                                            <div>

                                                                                <strong>
                                                                                    {
                                                                                        name
                                                                                    }
                                                                                </strong>

                                                                                <span>
                                                                                    Hospital Superintendent
                                                                                </span>

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    {/* EMPLOYEE ID */}

                                                                    <td>

                                                                        <div
                                                                            className="admin-superintendent-contact"
                                                                        >

                                                                            <Badge
                                                                                size={15}
                                                                            />

                                                                            {
                                                                                employeeId
                                                                            }

                                                                        </div>

                                                                    </td>


                                                                    {/* EMAIL */}

                                                                    <td>

                                                                        <div
                                                                            className="admin-superintendent-contact"
                                                                        >

                                                                            <Mail
                                                                                size={15}
                                                                            />

                                                                            {
                                                                                email
                                                                            }

                                                                        </div>

                                                                    </td>


                                                                    {/* PHONE */}

                                                                    <td>

                                                                        <div
                                                                            className="admin-superintendent-contact"
                                                                        >

                                                                            <Phone
                                                                                size={15}
                                                                            />

                                                                            {
                                                                                phone
                                                                            }

                                                                        </div>

                                                                    </td>


                                                                    {/* ROLE */}

                                                                    <td>

                                                                        <span
                                                                            className="admin-superintendent-role"
                                                                        >
                                                                            SUPERINTENDENT
                                                                        </span>

                                                                    </td>


                                                                    {/* STATUS */}

                                                                    <td>

                                                                        <span
                                                                            className={
                                                                                isActive
                                                                                    ?
                                                                                    "admin-superintendent-status active"
                                                                                    :
                                                                                    "admin-superintendent-status inactive"
                                                                            }
                                                                        >

                                                                            {
                                                                                isActive
                                                                                    ?
                                                                                    "Active"
                                                                                    :
                                                                                    "Inactive"
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* ACTION */}

                                                                    <td>

                                                                        <button
                                                                            type="button"
                                                                            className={
                                                                                isActive
                                                                                    ?
                                                                                    "admin-superintendent-status-button deactivate"
                                                                                    :
                                                                                    "admin-superintendent-status-button activate"
                                                                            }
                                                                            onClick={() =>
                                                                                handleStatus(
                                                                                    superintendent
                                                                                )
                                                                            }
                                                                        >

                                                                            {
                                                                                isActive
                                                                                    ?
                                                                                    <ShieldOff
                                                                                        size={16}
                                                                                    />
                                                                                    :
                                                                                    <ShieldCheck
                                                                                        size={16}
                                                                                    />
                                                                            }


                                                                            {
                                                                                isActive
                                                                                    ?
                                                                                    "Deactivate"
                                                                                    :
                                                                                    "Activate"
                                                                            }

                                                                        </button>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                }

                                            </tbody>

                                        </table>

                                    </div>
                                )
                    }

                </div>

            </div>

        </div>
    );
};


export default AdminSuperintendents;