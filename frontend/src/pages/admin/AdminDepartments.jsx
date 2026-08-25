import React, {
    useEffect,
    useState
} from "react";

import {
    Search,
    Plus,
    RefreshCw,
    Building2,
    Users,
    Pencil,
    Power,
    X
} from "lucide-react";

import api from "../../api/axios";


const AdminDepartments =
() =>
{
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
        error,
        setError
    ] =
        useState("");

    const [
        search,
        setSearch
    ] =
        useState("");

    const [
        showForm,
        setShowForm
    ] =
        useState(false);

    const [
        editingDepartment,
        setEditingDepartment
    ] =
        useState(null);

    const [
        saving,
        setSaving
    ] =
        useState(false);

    const [
        formData,
        setFormData
    ] =
        useState(
        {
            name: "",
            code: "",
            description: ""
        });


    const loadDepartments =
        async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/admin/departments"
                );

            if (
                response.data &&
                response.data.success
            )
            {
                setDepartments(
                    response.data.departments ||
                    []
                );
            }
            else
            {
                setDepartments([]);

                setError(
                    "Unable to load departments"
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Get departments error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load departments"
            );
        }
        finally
        {
            setLoading(false);
        }
    };


    useEffect(
        () =>
        {
            loadDepartments();
        },
        []
    );


    const handleInputChange =
        event =>
    {
        const
        {
            name,
            value
        } =
            event.target;

        setFormData(
            previous =>
            ({
                ...previous,

                [name]:
                    name === "code"
                        ?
                        value.toUpperCase()
                        :
                        value
            })
        );
    };


    const openAddForm =
        () =>
    {
        setEditingDepartment(
            null
        );

        setFormData(
        {
            name: "",
            code: "",
            description: ""
        });

        setShowForm(
            true
        );

        setError("");
    };


    const openEditForm =
        department =>
    {
        setEditingDepartment(
            department
        );

        setFormData(
        {
            name:
                department.name ||
                "",

            code:
                department.code ||
                "",

            description:
                department.description ||
                ""
        });

        setShowForm(
            true
        );

        setError("");
    };


    const closeForm =
        () =>
    {
        setShowForm(
            false
        );

        setEditingDepartment(
            null
        );

        setFormData(
        {
            name: "",
            code: "",
            description: ""
        });
    };


    const handleSubmit =
        async event =>
    {
        event.preventDefault();

        const name =
            formData.name.trim();

        const code =
            formData.code
                .trim()
                .toUpperCase();

        const description =
            formData.description.trim();


        if (!name)
        {
            alert(
                "Department name is required"
            );

            return;
        }

        if (!code)
        {
            alert(
                "Department code is required"
            );

            return;
        }


        try
        {
            setSaving(true);

            if (editingDepartment)
            {
                await api.put(
                    `/admin/departments/${editingDepartment._id}`,
                    {
                        name,
                        code,
                        description
                    }
                );
            }
            else
            {
                await api.post(
                    "/admin/departments",
                    {
                        name,
                        code,
                        description
                    }
                );
            }

            closeForm();

            await loadDepartments();
        }
        catch (requestError)
        {
            console.error(
                "Save department error:",
                requestError
            );

            alert(
                requestError.response?.data?.message ||
                "Unable to save department"
            );
        }
        finally
        {
            setSaving(false);
        }
    };


    const handleStatusChange =
        async department =>
    {
        const action =
            department.isActive
                ?
                "deactivate"
                :
                "activate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${department.name}?`
            );


        if (!confirmed)
        {
            return;
        }


        try
        {
            await api.patch(
                `/admin/departments/${department._id}/status`
            );

            await loadDepartments();
        }
        catch (requestError)
        {
            console.error(
                "Department status error:",
                requestError
            );

            alert(
                requestError.response?.data?.message ||
                "Unable to update department status"
            );
        }
    };


    const filteredDepartments =
        departments.filter(
            department =>
            {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim();

                const name =
                    department.name ||
                    "";

                const code =
                    department.code ||
                    "";

                const description =
                    department.description ||
                    "";

                return (
                    name
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    code
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    description
                        .toLowerCase()
                        .includes(
                            searchValue
                        )
                );
            }
        );


    const totalDepartments =
        departments.length;


    const activeDepartments =
        departments.filter(
            department =>
                department.isActive === true
        ).length;


    const inactiveDepartments =
        departments.filter(
            department =>
                department.isActive === false
        ).length;


    const totalDoctors =
        departments.reduce(
            (
                total,
                department
            ) =>
                total +
                Number(
                    department.doctorCount ||
                    0
                ),
            0
        );


    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Departments
                    </h1>

                    <p>
                        Manage hospital departments and their information.
                    </p>

                </div>


                <button
                    className="department-add-button"
                    onClick={
                        openAddForm
                    }
                >

                    <Plus
                        size={18}
                    />

                    Add Department

                </button>

            </div>


            <div className="department-stats">

                <div className="department-stat-card">

                    <div className="department-stat-icon">

                        <Building2
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Departments
                        </span>

                        <strong>
                            {
                                totalDepartments
                            }
                        </strong>

                    </div>

                </div>


                <div className="department-stat-card">

                    <div className="department-stat-icon">

                        <Power
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Active Departments
                        </span>

                        <strong>
                            {
                                activeDepartments
                            }
                        </strong>

                    </div>

                </div>


                <div className="department-stat-card">

                    <div className="department-stat-icon">

                        <Users
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Doctors
                        </span>

                        <strong>
                            {
                                totalDoctors
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="departments-container">

                <div className="departments-header">

                    <div>

                        <h2>
                            Hospital Departments
                        </h2>

                        <p>
                            View and manage all departments.
                        </p>

                    </div>


                    <button
                        className="department-refresh-button"
                        onClick={
                            loadDepartments
                        }
                        disabled={
                            loading
                        }
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>

                </div>


                <div className="departments-filters">

                    <div className="department-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Search departments..."
                        />

                    </div>

                </div>


                {
                    error &&
                    (
                        <div className="department-error">

                            {error}

                        </div>
                    )
                }


                {
                    loading
                        ?
                        (
                            <div className="department-loading">

                                Loading departments...

                            </div>
                        )
                        :
                        filteredDepartments.length === 0
                            ?
                            (
                                <div className="department-empty">

                                    <Building2
                                        size={45}
                                    />

                                    <h3>
                                        {
                                            search
                                                ?
                                                "No departments found"
                                                :
                                                "No departments available"
                                        }
                                    </h3>

                                    <p>
                                        {
                                            search
                                                ?
                                                "Try a different search term."
                                                :
                                                "Add your first hospital department."
                                        }
                                    </p>


                                    {
                                        !search &&
                                        (
                                            <button
                                                onClick={
                                                    openAddForm
                                                }
                                            >

                                                <Plus
                                                    size={17}
                                                />

                                                Add Department

                                            </button>
                                        )
                                    }

                                </div>
                            )
                            :
                            (
                                <div className="department-grid">

                                    {
                                        filteredDepartments.map(
                                            department =>
                                            (
                                                <div
                                                    className="department-card"
                                                    key={
                                                        department._id
                                                    }
                                                >

                                                    <div className="department-card-top">

                                                        <div className="department-card-icon">

                                                            <Building2
                                                                size={22}
                                                            />

                                                        </div>


                                                        <span
                                                            className={
                                                                department.isActive
                                                                    ?
                                                                    "department-status active"
                                                                    :
                                                                    "department-status inactive"
                                                            }
                                                        >

                                                            {
                                                                department.isActive
                                                                    ?
                                                                    "Active"
                                                                    :
                                                                    "Inactive"
                                                            }

                                                        </span>

                                                    </div>


                                                    <h3>
                                                        {
                                                            department.name
                                                        }
                                                    </h3>


                                                    <span className="department-code">

                                                        {
                                                            department.code
                                                        }

                                                    </span>


                                                    <p>

                                                        {
                                                            department.description ||
                                                            "No description available."
                                                        }

                                                    </p>


                                                    <div className="department-card-info">

                                                        <div>

                                                            <Users
                                                                size={16}
                                                            />

                                                            <span>

                                                                {
                                                                    department.doctorCount ||
                                                                    0
                                                                }

                                                                {" "}

                                                                {
                                                                    Number(
                                                                        department.doctorCount ||
                                                                        0
                                                                    ) === 1
                                                                        ?
                                                                        "Doctor"
                                                                        :
                                                                        "Doctors"
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="department-card-actions">

                                                        <button
                                                            className="department-edit-button"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    department
                                                                )
                                                            }
                                                        >

                                                            <Pencil
                                                                size={15}
                                                            />

                                                            Edit

                                                        </button>


                                                        <button
                                                            className="department-status-button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    department
                                                                )
                                                            }
                                                        >

                                                            <Power
                                                                size={15}
                                                            />

                                                            {
                                                                department.isActive
                                                                    ?
                                                                    "Deactivate"
                                                                    :
                                                                    "Activate"
                                                            }

                                                        </button>

                                                    </div>

                                                </div>
                                            )
                                        )
                                    }

                                </div>
                            )
                }

            </div>


            {
                showForm &&
                (
                    <div
                        className="department-modal-overlay"
                        onClick={
                            event =>
                            {
                                if (
                                    event.target ===
                                    event.currentTarget
                                )
                                {
                                    closeForm();
                                }
                            }
                        }
                    >

                        <div className="department-modal">

                            <div className="department-modal-header">

                                <div>

                                    <span className="page-eyebrow">
                                        MEDICARE
                                    </span>

                                    <h2>
                                        {
                                            editingDepartment
                                                ?
                                                "Edit Department"
                                                :
                                                "Add Department"
                                        }
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="department-modal-close"
                                    onClick={
                                        closeForm
                                    }
                                >

                                    <X
                                        size={18}
                                    />

                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="department-form-group">

                                    <label>
                                        Department Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Example: Cardiology"
                                        required
                                    />

                                </div>


                                <div className="department-form-group">

                                    <label>
                                        Department Code
                                    </label>

                                    <input
                                        type="text"
                                        name="code"
                                        value={
                                            formData.code
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Example: CARD"
                                        maxLength="10"
                                        required
                                    />

                                    <small className="department-input-help">
                                        Use a unique short code such as CARD, NEUR or ORTHO.
                                    </small>

                                </div>


                                <div className="department-form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Enter department description"
                                        rows="5"
                                        maxLength="500"
                                    />

                                </div>


                                <div className="department-form-actions">

                                    <button
                                        type="button"
                                        className="department-cancel-button"
                                        onClick={
                                            closeForm
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="department-save-button"
                                        disabled={
                                            saving
                                        }
                                    >

                                        {
                                            saving
                                                ?
                                                "Saving..."
                                                :
                                                editingDepartment
                                                    ?
                                                    "Update Department"
                                                    :
                                                    "Create Department"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )
            }

        </div>
    );
};


export default AdminDepartments;