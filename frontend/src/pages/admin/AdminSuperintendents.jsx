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

import {
    getDepartments
} from "../../services/adminService";

import "../../styles/AdminSuperintendents.css";

const AdminSuperintendents =
    () =>
{
    const [
        superintendents,
        setSuperintendents
    ] =
        useState([]);

    const [
        departments,
        setDepartments
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        refreshing,
        setRefreshing
    ] =
        useState(false);

    const [
        creating,
        setCreating
    ] =
        useState(false);

    const [
        searchTerm,
        setSearchTerm
    ] =
        useState("");

    const [
        showForm,
        setShowForm
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState("");

    const [
        success,
        setSuccess
    ] =
        useState("");

    const [
        formData,
        setFormData
    ] =
        useState(
        {
            name:
                "",

            email:
                "",

            phone:
                "",

            employeeId:
                "",

            password:
                "",

            department:
                ""
        }
        );

    const extractSuperintendents =
        (
            response
        ) =>
    {
        if (
            Array.isArray(
                response
            )
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

    const loadDepartments =
        async () =>
    {
        try
        {
            const response =
                await getDepartments();

            const departmentList =
                response?.departments ||
                response?.data?.departments ||
                response?.data ||
                [];

            const activeDepartments =
                Array.isArray(
                    departmentList
                )
                    ?
                    departmentList.filter(
                        department =>
                            department.isActive !== false
                    )
                    :
                    [];

            setDepartments(
                activeDepartments
            );
        }
        catch (
            requestError
        )
        {
            console.error(
                "DEPARTMENT LOAD ERROR:",
                requestError
            );

            setDepartments([]);

            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to load departments."
            );
        }
    };

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
                setRefreshing(
                    true
                );
            }
            else
            {
                setLoading(
                    true
                );
            }

            setError("");

            const response =
                await getAllSuperintendents();

            const list =
                extractSuperintendents(
                    response
                );

            setSuperintendents(
                list
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
            setLoading(
                false
            );

            setRefreshing(
                false
            );
        }
    };

    useEffect(
        () =>
        {
            loadSuperintendents();

            loadDepartments();
        },
        []
    );

    const handleChange =
        (
            event
        ) =>
    {
        const {
            name,
            value
        } =
            event.target;

        setFormData(
            previous =>
            ({
                ...previous,
                [name]:
                    value
            })
        );
    };

    const resetForm =
        () =>
    {
        setFormData(
        {
            name:
                "",

            email:
                "",

            phone:
                "",

            employeeId:
                "",

            password:
                "",

            department:
                ""
        }
        );
    };

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

        const department =
            formData.department;

        if (
            !name ||
            !email ||
            !phone ||
            !employeeId ||
            !password ||
            !department
        )
        {
            setError(
                "Name, email, phone, employee ID, password and department are required."
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
            setCreating(
                true
            );

            const payload =
            {
                name,
                email,
                phone,
                employeeId,
                password,
                department
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

            setShowForm(
                false
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
            setCreating(
                false
            );
        }
    };

    const getSuperintendentName =
        (
            superintendent
        ) =>
    {
        return (
            superintendent?.name ||
            superintendent?.fullName ||
            superintendent?.user?.name ||
            superintendent?.user?.fullName ||
            "Unknown"
        );
    };

    const getSuperintendentEmail =
        (
            superintendent
        ) =>
    {
        return (
            superintendent?.email ||
            superintendent?.user?.email ||
            "No email"
        );
    };

    const getSuperintendentPhone =
        (
            superintendent
        ) =>
    {
        return (
            superintendent?.phone ||
            superintendent?.user?.phone ||
            "No phone"
        );
    };

    const getSuperintendentEmployeeId =
        (
            superintendent
        ) =>
    {
        return (
            superintendent?.employeeId ||
            "N/A"
        );
    };

    const getSuperintendentId =
        (
            superintendent
        ) =>
    {
        return (
            superintendent?._id ||
            superintendent?.id ||
            ""
        );
    };

    const getSuperintendentStatus =
        (
            superintendent
        ) =>
    {
        if (
            typeof superintendent?.isActive ===
            "boolean"
        )
        {
            return superintendent.isActive;
        }

        if (
            typeof superintendent?.active ===
            "boolean"
        )
        {
            return superintendent.active;
        }

        if (
            typeof superintendent?.user?.isActive ===
            "boolean"
        )
        {
            return superintendent.user.isActive;
        }

        if (
            typeof superintendent?.user?.active ===
            "boolean"
        )
        {
            return superintendent.user.active;
        }

        return true;
    };

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
                getSuperintendentId(
                    superintendent
                );

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
                getSuperintendentStatus(
                    superintendent
                );

            const response =
                await updateSuperintendentStatus(
                    id,
                    {
                        isActive:
                            !currentStatus
                    }
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

                const department =
                    superintendent?.department?.name ||
                    "";

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();

                return (
                    name
                        .toLowerCase()
                        .includes(search) ||
                    email
                        .toLowerCase()
                        .includes(search) ||
                    phone
                        .toLowerCase()
                        .includes(search) ||
                    employeeId
                        .toLowerCase()
                        .includes(search) ||
                    department
                        .toLowerCase()
                        .includes(search)
                );
            }
        );

    return (
        <div
            className="admin-superintendents-page"
        >
            <div
                className="admin-superintendents-container"
            >
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
                            Create and manage hospital superintendent accounts.
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

                            Refresh
                        </button>

                        <button
                            type="button"
                            className="admin-superintendents-add"
                            onClick={() =>
                            {
                                setError("");

                                setSuccess("");

                                setShowForm(
                                    previous =>
                                        !previous
                                );
                            }}
                        >
                            <Plus
                                size={18}
                            />

                            Add Superintendent
                        </button>
                    </div>
                </div>

                {
                    error &&
                    (
                        <div
                            className="admin-superintendent-alert error"
                        >
                            {error}
                        </div>
                    )
                }

                {
                    success &&
                    (
                        <div
                            className="admin-superintendent-alert success"
                        >
                            {success}
                        </div>
                    )
                }

                {
                    showForm &&
                    (
                        <div
                            className="admin-superintendent-form-card"
                        >
                            <div
                                className="admin-superintendent-form-header"
                            >
                                <div>
                                    <h2>
                                        Create Superintendent
                                    </h2>

                                    <p>
                                        Assign the Superintendent to a department.
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={
                                    handleCreate
                                }
                            >
                                <div
                                    className="admin-superintendent-form-grid"
                                >
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
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>

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
                                    </div>

                                    <div
                                        className="admin-superintendent-field"
                                    >
                                        <label>
                                            Department
                                        </label>

                                        <select
                                            name="department"
                                            value={
                                                formData.department
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option
                                                value=""
                                            >
                                                Select Department
                                            </option>

                                            {
                                                departments.map(
                                                    department =>
                                                    (
                                                        <option
                                                            key={
                                                                department._id
                                                            }
                                                            value={
                                                                department._id
                                                            }
                                                        >
                                                            {
                                                                department.name
                                                            }
                                                        </option>
                                                    )
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div
                                    className="admin-superintendent-form-actions"
                                >
                                    <button
                                        type="button"
                                        className="admin-superintendent-cancel"
                                        onClick={() =>
                                        {
                                            resetForm();

                                            setShowForm(
                                                false
                                            );

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
                            placeholder="Search by name, email, phone, employee ID or department..."
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
                                filteredSuperintendents.length ===
                                1
                                    ?
                                    " Superintendent"
                                    :
                                    " Superintendents"
                            }
                        </span>
                    </div>
                </div>

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
                            filteredSuperintendents.length ===
                            0
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
                                            No superintendent accounts were found.
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
                                                        DEPARTMENT
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

                                                            const departmentName =
                                                                superintendent?.department?.name ||
                                                                "Not assigned";

                                                            return (
                                                                <tr
                                                                    key={
                                                                        id ||
                                                                        `${email}-${employeeId}`
                                                                    }
                                                                >
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

                                                                    <td>
                                                                        {
                                                                            departmentName
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        <span
                                                                            className="admin-superintendent-role"
                                                                        >
                                                                            SUPERINTENDENT
                                                                        </span>
                                                                    </td>

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