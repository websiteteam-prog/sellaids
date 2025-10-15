import * as yup from "yup";

//  user Profile 
export const updateUserProfile = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(2)
        .max(100)
        .required("Vendor name is required"),

    phone: yup
        .string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Phone must be valid")
        .required("Phone number is required"),
    currentPassword: yup
        .string()
        .required("Current password is required")
        .min(8, "Current password must be at least 8 characters"),

    newPassword: yup
        .string()
        .required("New password is required")
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .min(8, "New password must be at least 8 characters"),

    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .oneOf([yup.ref('newPassword')], "Passwords must match")
})

// vendor Profile
export const personalInfoSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(2)
        .max(100)
        .required("Vendor name is required"),

    phone: yup
        .string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Phone must be valid")
        .required("Phone number is required")
});

export const businessInfoSchema = yup.object().shape({
    business_name: yup
        .string()
        .max(150)
        .required(),

    business_type: yup
        .string()
        .oneOf(["restaurant", "grocery", "fashion", "electronics", "other"])
        .default("other"),

    gst_number: yup
        .string()
        .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, "Invalid GST number")
        .nullable()
        .optional(),

    pan_number: yup
        .string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
        .nullable()
        .optional()
});


export const bankInfoSchema = yup.object().shape({
    account_number: yup
        .string()
        .matches(/^[0-9]{9,18}$/, "Invalid account number")
        .nullable()
        .optional(),

    ifsc_code: yup
        .string()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
        .nullable()
        .optional(),

    bank_name: yup.string().max(100).nullable(),
    account_type: yup.string().oneOf(["savings", "current"]).default("savings"),
});


export const passwordSchema = yup.object().shape({
    currentPassword: yup
        .string()
        .required("Current password is required")
        .min(8, "Current password must be at least 8 characters"),

    newPassword: yup
        .string()
        .required("New password is required")
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .min(8, "New password must be at least 8 characters"),

    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character")
        .oneOf([yup.ref('newPassword')], "Passwords must match")
});
