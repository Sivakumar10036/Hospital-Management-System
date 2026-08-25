// import React, { useEffect, useState } from "react";

// import
// {
//     ArrowLeft,
//     User,
//     Mail,
//     Phone,
//     Lock,
//     Stethoscope,
//     Building2,
//     GraduationCap,
//     Briefcase,
//     IndianRupee,
//     Camera,
//     Clock,
//     Plus,
//     CheckCircle,
//     AlertCircle
// }
// from "lucide-react";

// import
// {
//     useNavigate
// }
// from "react-router-dom";

// import
// {
//     createDoctor,
//     getDepartments
// }
// from "../../services/adminService";

// import "./AddDoctor.css";


// const AddDoctor = () =>
// {
//     const navigate = useNavigate();

//     const [departments, setDepartments] =
//         useState([]);

//     const [loading, setLoading] =
//         useState(false);

//     const [loadingDepartments, setLoadingDepartments] =
//         useState(true);

//     const [error, setError] =
//         useState("");

//     const [success, setSuccess] =
//         useState("");

//     const [photoPreview, setPhotoPreview] =
//         useState("");

//     const [formData, setFormData] =
//         useState(
//         {
//             name: "",
//             email: "",
//             phone: "",
//             password: "",
//             specialization: "",
//             department: "",
//             qualification: "",
//             experience: "",
//             consultationFee: "",
//             about: "",
//             availableDays: [],
//             startTime: "",
//             endTime: "",
//             slotDuration: "30",
//             breakStart: "",
//             breakEnd: "",
//             profilePhoto: null
//         });


//     const weekDays =
//     [
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//         "Sunday"
//     ];


//     useEffect(
//         () =>
//         {
//             loadDepartments();

//             return () =>
//             {
//                 if (photoPreview)
//                 {
//                     URL.revokeObjectURL(photoPreview);
//                 }
//             };
//         },
//         []
//     );


//     const loadDepartments =
//     async () =>
//     {
//         try
//         {
//             setLoadingDepartments(true);
//             setError("");

//             const response =
//                 await getDepartments();

//             const departmentData =
//                 response?.data ||
//                 response;

//             const departmentList =
//                 departmentData?.departments ||
//                 departmentData?.data ||
//                 [];

//             setDepartments(
//                 Array.isArray(departmentList)
//                     ? departmentList
//                     : []
//             );
//         }
//         catch (requestError)
//         {
//             console.error(
//                 "Department loading error:",
//                 requestError
//             );

//             setDepartments([]);

//             setError(
//                 requestError?.response?.data?.message ||
//                 requestError?.response?.data?.error ||
//                 requestError?.message ||
//                 "Unable to load departments"
//             );
//         }
//         finally
//         {
//             setLoadingDepartments(false);
//         }
//     };


//     const handleChange =
//     (event) =>
//     {
//         const
//         {
//             name,
//             value
//         } = event.target;

//         setFormData(
//             previousData =>
//             ({
//                 ...previousData,
//                 [name]: value
//             })
//         );

//         setError("");
//         setSuccess("");
//     };


//     const handleDayChange =
//     (day) =>
//     {
//         setFormData(
//             previousData =>
//             {
//                 const selectedDays =
//                     previousData.availableDays;

//                 if (selectedDays.includes(day))
//                 {
//                     return
//                     {
//                         ...previousData,

//                         availableDays:
//                             selectedDays.filter(
//                                 selectedDay =>
//                                     selectedDay !== day
//                             )
//                     };
//                 }

//                 return
//                 {
//                     ...previousData,

//                     availableDays:
//                     [
//                         ...selectedDays,
//                         day
//                     ]
//                 };
//             }
//         );

//         setError("");
//         setSuccess("");
//     };


//     const handlePhotoChange =
//     (event) =>
//     {
//         const file =
//             event.target.files?.[0];

//         if (!file)
//         {
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024)
//         {
//             setError(
//                 "Photo size must be less than 5 MB"
//             );

//             event.target.value = "";

//             return;
//         }

//         const allowedTypes =
//         [
//             "image/jpeg",
//             "image/png",
//             "image/webp"
//         ];

//         if (!allowedTypes.includes(file.type))
//         {
//             setError(
//                 "Only JPG, PNG or WEBP images are allowed"
//             );

//             event.target.value = "";

//             return;
//         }

//         if (photoPreview)
//         {
//             URL.revokeObjectURL(photoPreview);
//         }

//         const newPhotoPreview =
//             URL.createObjectURL(file);

//         setFormData(
//             previousData =>
//             ({
//                 ...previousData,
//                 profilePhoto: file
//             })
//         );

//         setPhotoPreview(
//             newPhotoPreview
//         );

//         setError("");
//         setSuccess("");
//     };


//     const validateEmail =
//     email =>
//     {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//             email
//         );
//     };


//     const validatePhone =
//     phone =>
//     {
//         return /^[0-9+\-\s()]{10,15}$/.test(
//             phone
//         );
//     };


//     const validateForm =
//     () =>
//     {
//         if (!formData.name.trim())
//         {
//             return "Full name is required";
//         }

//         if (!formData.email.trim())
//         {
//             return "Email address is required";
//         }

//         if (!validateEmail(formData.email.trim()))
//         {
//             return "Please enter a valid email address";
//         }

//         if (!formData.phone.trim())
//         {
//             return "Phone number is required";
//         }

//         if (!validatePhone(formData.phone.trim()))
//         {
//             return "Please enter a valid phone number";
//         }

//         if (!formData.password)
//         {
//             return "Login password is required";
//         }

//         if (formData.password.length < 6)
//         {
//             return "Password must contain at least 6 characters";
//         }

//         if (!formData.specialization.trim())
//         {
//             return "Specialization is required";
//         }

//         if (!formData.department)
//         {
//             return "Please select a department";
//         }

//         if (!formData.qualification.trim())
//         {
//             return "Qualification is required";
//         }

//         if (formData.experience === "")
//         {
//             return "Experience is required";
//         }

//         if (
//             Number.isNaN(Number(formData.experience)) ||
//             Number(formData.experience) < 0
//         )
//         {
//             return "Experience must be a valid non-negative number";
//         }

//         if (formData.consultationFee === "")
//         {
//             return "Consultation fee is required";
//         }

//         if (
//             Number.isNaN(Number(formData.consultationFee)) ||
//             Number(formData.consultationFee) < 0
//         )
//         {
//             return "Consultation fee must be a valid non-negative number";
//         }

//         if (formData.availableDays.length === 0)
//         {
//             return "Please select at least one available day";
//         }

//         if (
//             formData.startTime &&
//             formData.endTime &&
//             formData.startTime >= formData.endTime
//         )
//         {
//             return "End time must be later than start time";
//         }

//         if (
//             (formData.breakStart && !formData.breakEnd) ||
//             (!formData.breakStart && formData.breakEnd)
//         )
//         {
//             return "Please provide both break start and break end times";
//         }

//         if (
//             formData.breakStart &&
//             formData.breakEnd &&
//             formData.breakStart >= formData.breakEnd
//         )
//         {
//             return "Break end time must be later than break start time";
//         }

//         if (
//             formData.startTime &&
//             formData.endTime &&
//             formData.breakStart &&
//             formData.breakEnd
//         )
//         {
//             if (
//                 formData.breakStart < formData.startTime ||
//                 formData.breakEnd > formData.endTime
//             )
//             {
//                 return "Break time must be within working hours";
//             }
//         }

//         return "";
//     };


//     const handleSubmit =
//     async (event) =>
//     {
//         event.preventDefault();

//         if (loading)
//         {
//             return;
//         }

//         setError("");
//         setSuccess("");

//         const validationError =
//             validateForm();

//         if (validationError)
//         {
//             setError(
//                 validationError
//             );

//             window.scrollTo(
//             {
//                 top: 0,
//                 behavior: "smooth"
//             });

//             return;
//         }

//         try
//         {
//             setLoading(true);

//             const doctorData =
//                 new FormData();

//             doctorData.append(
//                 "name",
//                 formData.name.trim()
//             );

//             doctorData.append(
//                 "email",
//                 formData.email.trim().toLowerCase()
//             );

//             doctorData.append(
//                 "phone",
//                 formData.phone.trim()
//             );

//             doctorData.append(
//                 "password",
//                 formData.password
//             );

//             doctorData.append(
//                 "specialization",
//                 formData.specialization.trim()
//             );

//             doctorData.append(
//                 "department",
//                 formData.department
//             );

//             doctorData.append(
//                 "qualification",
//                 formData.qualification.trim()
//             );

//             doctorData.append(
//                 "experience",
//                 String(
//                     Number(formData.experience)
//                 )
//             );

//             doctorData.append(
//                 "consultationFee",
//                 String(
//                     Number(formData.consultationFee)
//                 )
//             );

//             doctorData.append(
//                 "about",
//                 formData.about.trim()
//             );

//             doctorData.append(
//                 "availableDays",
//                 JSON.stringify(
//                     formData.availableDays
//                 )
//             );

//             doctorData.append(
//                 "startTime",
//                 formData.startTime
//             );

//             doctorData.append(
//                 "endTime",
//                 formData.endTime
//             );

//             doctorData.append(
//                 "slotDuration",
//                 formData.slotDuration
//             );

//             doctorData.append(
//                 "breakStart",
//                 formData.breakStart
//             );

//             doctorData.append(
//                 "breakEnd",
//                 formData.breakEnd
//             );

//             if (formData.profilePhoto)
//             {
//                 doctorData.append(
//                     "profilePhoto",
//                     formData.profilePhoto
//                 );
//             }

//             const response =
//                 await createDoctor(
//                     doctorData
//                 );

//             const responseData =
//                 response?.data ||
//                 response;

//             if (
//                 responseData?.success === false
//             )
//             {
//                 throw new Error(
//                     responseData?.message ||
//                     responseData?.error ||
//                     "Doctor creation failed"
//                 );
//             }

//             setSuccess(
//                 responseData?.message ||
//                 "Doctor created successfully"
//             );

//             setTimeout(
//                 () =>
//                 {
//                     navigate(
//                         "/admin/doctors"
//                     );
//                 },
//                 1200
//             );
//         }
//         catch (requestError)
//         {
//             console.error(
//                 "Doctor creation error:",
//                 requestError
//             );

//             setError(
//                 requestError?.response?.data?.message ||
//                 requestError?.response?.data?.error ||
//                 requestError?.message ||
//                 "Doctor creation failed"
//             );

//             window.scrollTo(
//             {
//                 top: 0,
//                 behavior: "smooth"
//             });
//         }
//         finally
//         {
//             setLoading(false);
//         }
//     };


//     const handleCancel =
//     () =>
//     {
//         if (!loading)
//         {
//             navigate(
//                 "/admin/doctors"
//             );
//         }
//     };


//     return (
//         <div className="add-doctor-page">

//             <div className="add-doctor-header">

//                 <div>

//                     <div className="page-label">
//                         DOCTOR MANAGEMENT
//                     </div>

//                     <h1>
//                         Add New Doctor
//                     </h1>

//                     <p>
//                         Create a doctor profile and configure their availability.
//                     </p>

//                 </div>

//                 <button
//                     type="button"
//                     className="back-button"
//                     onClick={handleCancel}
//                     disabled={loading}
//                 >
//                     <ArrowLeft size={18} />
//                     Back to Doctors
//                 </button>

//             </div>


//             {error &&
//             (
//                 <div className="doctor-alert doctor-alert-error">

//                     <AlertCircle size={20} />

//                     <span>
//                         {error}
//                     </span>

//                 </div>
//             )}


//             {success &&
//             (
//                 <div className="doctor-alert doctor-alert-success">

//                     <CheckCircle size={20} />

//                     <span>
//                         {success}
//                     </span>

//                 </div>
//             )}


//             <form
//                 className="doctor-form"
//                 onSubmit={handleSubmit}
//                 noValidate
//             >

//                 <section className="doctor-card">

//                     <div className="doctor-card-header">

//                         <div className="section-icon">
//                             <User size={22} />
//                         </div>

//                         <div>

//                             <h2>
//                                 Personal Information
//                             </h2>

//                             <p>
//                                 Basic information about the doctor.
//                             </p>

//                         </div>

//                     </div>


//                     <div className="photo-upload-area">

//                         <div className="doctor-photo-preview">

//                             {photoPreview ?
//                             (
//                                 <img
//                                     src={photoPreview}
//                                     alt="Doctor profile preview"
//                                 />
//                             )
//                             :
//                             (
//                                 <User size={48} />
//                             )}

//                         </div>

//                         <div className="photo-upload-content">

//                             <label
//                                 htmlFor="profilePhoto"
//                                 className="upload-photo-button"
//                             >
//                                 <Camera size={18} />
//                                 Upload Photo
//                             </label>

//                             <input
//                                 id="profilePhoto"
//                                 name="profilePhoto"
//                                 type="file"
//                                 accept="image/jpeg,image/png,image/webp"
//                                 onChange={handlePhotoChange}
//                                 hidden
//                                 disabled={loading}
//                             />

//                             <p>
//                                 JPG, PNG or WEBP. Maximum 5 MB.
//                             </p>

//                         </div>

//                     </div>


//                     <div className="form-grid">

//                         <div className="form-group">

//                             <label htmlFor="doctor-name">
//                                 Full Name *
//                             </label>

//                             <div className="input-wrapper">

//                                 <User size={18} />

//                                 <input
//                                     id="doctor-name"
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Enter doctor's full name"
//                                     autoComplete="name"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-email">
//                                 Email Address *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Mail size={18} />

//                                 <input
//                                     id="doctor-email"
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="doctor@example.com"
//                                     autoComplete="email"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-phone">
//                                 Phone Number *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Phone size={18} />

//                                 <input
//                                     id="doctor-phone"
//                                     type="tel"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     placeholder="Enter phone number"
//                                     autoComplete="tel"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-password">
//                                 Login Password *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Lock size={18} />

//                                 <input
//                                     id="doctor-password"
//                                     type="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Minimum 6 characters"
//                                     autoComplete="new-password"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>

//                     </div>

//                 </section>


//                 <section className="doctor-card">

//                     <div className="doctor-card-header">

//                         <div className="section-icon">
//                             <Stethoscope size={22} />
//                         </div>

//                         <div>

//                             <h2>
//                                 Professional Information
//                             </h2>

//                             <p>
//                                 Doctor specialization and professional details.
//                             </p>

//                         </div>

//                     </div>


//                     <div className="form-grid">

//                         <div className="form-group">

//                             <label htmlFor="doctor-specialization">
//                                 Specialization *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Stethoscope size={18} />

//                                 <input
//                                     id="doctor-specialization"
//                                     type="text"
//                                     name="specialization"
//                                     value={formData.specialization}
//                                     onChange={handleChange}
//                                     placeholder="e.g. Cardiology"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-department">
//                                 Department *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Building2 size={18} />

//                                 <select
//                                     id="doctor-department"
//                                     name="department"
//                                     value={formData.department}
//                                     onChange={handleChange}
//                                     disabled={
//                                         loading ||
//                                         loadingDepartments
//                                     }
//                                 >

//                                     <option value="">
//                                         {loadingDepartments
//                                             ? "Loading departments..."
//                                             : "Select department"}
//                                     </option>

//                                     {departments.map(
//                                         department =>
//                                         (
//                                             <option
//                                                 key={
//                                                     department._id ||
//                                                     department.id
//                                                 }
//                                                 value={
//                                                     department._id ||
//                                                     department.id
//                                                 }
//                                             >
//                                                 {
//                                                     department.name ||
//                                                     department.departmentName
//                                                 }
//                                             </option>
//                                         )
//                                     )}

//                                 </select>

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-qualification">
//                                 Qualification *
//                             </label>

//                             <div className="input-wrapper">

//                                 <GraduationCap size={18} />

//                                 <input
//                                     id="doctor-qualification"
//                                     type="text"
//                                     name="qualification"
//                                     value={formData.qualification}
//                                     onChange={handleChange}
//                                     placeholder="e.g. MBBS, MD"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-experience">
//                                 Experience *
//                             </label>

//                             <div className="input-wrapper">

//                                 <Briefcase size={18} />

//                                 <input
//                                     id="doctor-experience"
//                                     type="number"
//                                     name="experience"
//                                     value={formData.experience}
//                                     onChange={handleChange}
//                                     min="0"
//                                     step="0.5"
//                                     placeholder="Years of experience"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="doctor-fee">
//                                 Consultation Fee *
//                             </label>

//                             <div className="input-wrapper">

//                                 <IndianRupee size={18} />

//                                 <input
//                                     id="doctor-fee"
//                                     type="number"
//                                     name="consultationFee"
//                                     value={formData.consultationFee}
//                                     onChange={handleChange}
//                                     min="0"
//                                     step="1"
//                                     placeholder="Consultation fee"
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>

//                     </div>


//                     <div className="form-group full-width">

//                         <label htmlFor="doctor-about">
//                             About Doctor
//                         </label>

//                         <textarea
//                             id="doctor-about"
//                             name="about"
//                             value={formData.about}
//                             onChange={handleChange}
//                             rows="4"
//                             placeholder="Enter a short description about the doctor"
//                             disabled={loading}
//                         />

//                     </div>

//                 </section>


//                 <section className="doctor-card">

//                     <div className="doctor-card-header">

//                         <div className="section-icon">
//                             <Clock size={22} />
//                         </div>

//                         <div>

//                             <h2>
//                                 Availability
//                             </h2>

//                             <p>
//                                 Configure the doctor's working days and timings.
//                             </p>

//                         </div>

//                     </div>


//                     <div className="form-group full-width">

//                         <label>
//                             Available Days *
//                         </label>

//                         <div className="days-container">

//                             {weekDays.map(
//                                 day =>
//                                 (
//                                     <label
//                                         key={day}
//                                         className={
//                                             formData.availableDays.includes(day)
//                                                 ? "day-option selected"
//                                                 : "day-option"
//                                         }
//                                     >

//                                         <input
//                                             type="checkbox"
//                                             checked={
//                                                 formData.availableDays.includes(day)
//                                             }
//                                             onChange={() =>
//                                                 handleDayChange(day)
//                                             }
//                                             disabled={loading}
//                                         />

//                                         <span>
//                                             {day}
//                                         </span>

//                                     </label>
//                                 )
//                             )}

//                         </div>

//                     </div>


//                     <div className="form-grid">

//                         <div className="form-group">

//                             <label htmlFor="start-time">
//                                 Start Time
//                             </label>

//                             <div className="input-wrapper">

//                                 <Clock size={18} />

//                                 <input
//                                     id="start-time"
//                                     type="time"
//                                     name="startTime"
//                                     value={formData.startTime}
//                                     onChange={handleChange}
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="end-time">
//                                 End Time
//                             </label>

//                             <div className="input-wrapper">

//                                 <Clock size={18} />

//                                 <input
//                                     id="end-time"
//                                     type="time"
//                                     name="endTime"
//                                     value={formData.endTime}
//                                     onChange={handleChange}
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="slot-duration">
//                                 Slot Duration
//                             </label>

//                             <div className="input-wrapper">

//                                 <Clock size={18} />

//                                 <select
//                                     id="slot-duration"
//                                     name="slotDuration"
//                                     value={formData.slotDuration}
//                                     onChange={handleChange}
//                                     disabled={loading}
//                                 >

//                                     <option value="15">
//                                         15 minutes
//                                     </option>

//                                     <option value="30">
//                                         30 minutes
//                                     </option>

//                                     <option value="45">
//                                         45 minutes
//                                     </option>

//                                     <option value="60">
//                                         60 minutes
//                                     </option>

//                                 </select>

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="break-start">
//                                 Break Start
//                             </label>

//                             <div className="input-wrapper">

//                                 <Clock size={18} />

//                                 <input
//                                     id="break-start"
//                                     type="time"
//                                     name="breakStart"
//                                     value={formData.breakStart}
//                                     onChange={handleChange}
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>


//                         <div className="form-group">

//                             <label htmlFor="break-end">
//                                 Break End
//                             </label>

//                             <div className="input-wrapper">

//                                 <Clock size={18} />

//                                 <input
//                                     id="break-end"
//                                     type="time"
//                                     name="breakEnd"
//                                     value={formData.breakEnd}
//                                     onChange={handleChange}
//                                     disabled={loading}
//                                 />

//                             </div>

//                         </div>

//                     </div>

//                 </section>


//                 <div className="form-actions">

//                     <button
//                         type="button"
//                         className="cancel-button"
//                         onClick={handleCancel}
//                         disabled={loading}
//                     >
//                         Cancel
//                     </button>


//                     <button
//                         type="submit"
//                         className="create-doctor-button"
//                         disabled={
//                             loading ||
//                             loadingDepartments
//                         }
//                     >

//                         {loading ?
//                         (
//                             <>
//                                 <span className="button-spinner"></span>
//                                 Creating Doctor...
//                             </>
//                         )
//                         :
//                         (
//                             <>
//                                 <Plus size={19} />
//                                 Create Doctor
//                             </>
//                         )}

//                     </button>

//                 </div>

//             </form>

//         </div>
//     );
// };


// export default AddDoctor;