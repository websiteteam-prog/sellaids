
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const MultiStepRegister = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        designation: '',
        businessName: '',
        businessType: '',
        gstNumber: '',
        panNumber: '',
        houseNo: '',
        streetName: '',
        state: '',
        city: '',
        pincode: '',
        contactPersonName: '',
        contactPersonPhone: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        accountType: '',
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateStep = (currentStep) => {
        let isValid = true;
        let fieldsToCheck = [];

        switch (currentStep) {
            case 1:
                fieldsToCheck = ['name', 'phone', 'email', 'password', 'confirmPassword'];
                break;
            case 2:
                fieldsToCheck = ['designation', 'businessName', 'businessType', 'gstNumber', 'panNumber'];
                break;
            case 3:
                fieldsToCheck = ['houseNo', 'streetName', 'state', 'city', 'pincode'];
                break;
            case 4:
                fieldsToCheck = ['contactPersonName', 'contactPersonPhone'];
                break;
            case 5:
                fieldsToCheck = ['accountNumber', 'ifscCode', 'bankName', 'accountType'];
                break;
            default:
                return true;
        }

        fieldsToCheck.forEach((field) => {
            if (!formData[field].trim()) {
                isValid = false;
            }
        });

        if (currentStep === 1 && formData.password !== formData.confirmPassword) {
            isValid = false;
            setMessage('❌ Passwords do not match.');
            return isValid;
        }

        if (!isValid) {
            setMessage('❌ Please fill all required fields.');
        } else {
            setMessage('');
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptTerms) {
            setMessage('❌ Please accept Terms & Conditions.');
            return;
        }
        try {
            const res = await axios.post(
                'http://localhost:5000/api/vendor/register',
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            toast.success('✅ Registration successful!', {
                position: 'top-right',
                duration: 2000,
            });
            setTimeout(() => navigate('/login'), 2000);
            setFormData({
                name: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: '',
                designation: '',
                businessName: '',
                businessType: '',
                gstNumber: '',
                panNumber: '',
                houseNo: '',
                streetName: '',
                state: '',
                city: '',
                pincode: '',
                contactPersonName: '',
                contactPersonPhone: '',
                accountNumber: '',
                ifscCode: '',
                bankName: '',
                accountType: '',
            });
            setStep(1);
            setAcceptTerms(false);
            setShowPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            toast.error('❌ Registration failed. Please try again.', {
                position: 'top-right',
                duration: 3000,
            });
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Information</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input 
                                type="text" 
                                name="phone" 
                                placeholder="Phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span 
                                className="absolute right-3 top-10 cursor-pointer" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-1">Confirm Password</label>
                            <input 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span 
                                className="absolute right-3 top-10 cursor-pointer" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 2: Business Details</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Designation</label>
                            <input 
                                type="text" 
                                name="designation" 
                                placeholder="Designation" 
                                value={formData.designation} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Business Name</label>
                            <input 
                                type="text" 
                                name="businessName" 
                                placeholder="Business Name" 
                                value={formData.businessName} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Business Type</label>
                            <input 
                                type="text" 
                                name="businessType" 
                                placeholder="Business Type" 
                                value={formData.businessType} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">GST Number</label>
                            <input 
                                type="text" 
                                name="gstNumber" 
                                placeholder="GST Number" 
                                value={formData.gstNumber} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">PAN Number</label>
                            <input 
                                type="text" 
                                name="panNumber" 
                                placeholder="PAN Number" 
                                value={formData.panNumber} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 3: Address</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">House No</label>
                            <input 
                                type="text" 
                                name="houseNo" 
                                placeholder="House No" 
                                value={formData.houseNo} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Street Name</label>
                            <input 
                                type="text" 
                                name="streetName" 
                                placeholder="Street Name" 
                                value={formData.streetName} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">State</label>
                            <input 
                                type="text" 
                                name="state" 
                                placeholder="State" 
                                value={formData.state} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input 
                                type="text" 
                                name="city" 
                                placeholder="City" 
                                value={formData.city} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Pincode</label>
                            <input 
                                type="text" 
                                name="pincode" 
                                placeholder="Pincode" 
                                value={formData.pincode} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 4: Alternate Contact Person</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Contact Person Name</label>
                            <input 
                                type="text" 
                                name="contactPersonName" 
                                placeholder="Contact Person Name" 
                                value={formData.contactPersonName} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Contact Person Phone</label>
                            <input 
                                type="text" 
                                name="contactPersonPhone" 
                                placeholder="Contact Person Phone" 
                                value={formData.contactPersonPhone} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 5: Bank Details</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <input 
                                type="text" 
                                name="accountNumber" 
                                placeholder="Account Number" 
                                value={formData.accountNumber} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">IFSC Code</label>
                            <input 
                                type="text" 
                                name="ifscCode" 
                                placeholder="IFSC Code" 
                                value={formData.ifscCode} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Bank Name</label>
                            <input 
                                type="text" 
                                name="bankName" 
                                placeholder="Bank Name" 
                                value={formData.bankName} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Account Type</label>
                            <select 
                                name="accountType" 
                                value={formData.accountType} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Account Type</option>
                                <option value="Saving">Saving</option>
                                <option value="Current">Current</option>
                            </select>
                        </div>
                    </>
                );
            case 6:
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Step 6: Review Your Details</h2>
                        <div className="mb-6">
                            <table className="w-full border-collapse border border-gray-300">
                                <tbody>
                                    <tr className="border-b"><td className="p-2 font-medium">Name:</td><td className="p-2">{formData.name}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Phone:</td><td className="p-2">{formData.phone}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Email:</td><td className="p-2">{formData.email}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Designation:</td><td className="p-2">{formData.designation}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Business Name:</td><td className="p-2">{formData.businessName}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">Business Type:</td><td className="p-2">{formData.businessType}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">GST Number:</td><td className="p-2">{formData.gstNumber}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-medium">PAN Number:</td><td className="p-2">{formData.panNumber}</td></tr>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">Address:</td>
                                        <td className="p-2">{formData.houseNo}, {formData.streetName}, {formData.city}, {formData.state} - {formData.pincode}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">Contact Person:</td>
                                        <td className="p-2">{formData.contactPersonName} ({formData.contactPersonPhone})</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 font-medium">Bank:</td>
                                        <td className="p-2">{formData.bankName}, {formData.accountType}, A/C: {formData.accountNumber}, IFSC: {formData.ifscCode}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mr-2"
                                />
                                I accept the Terms & Conditions
                            </label>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={prevStep} 
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Back
                        </button>
                    )}
                    {step < 6 ? (
                        <button 
                            type="button" 
                            onClick={nextStep} 
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            disabled={!acceptTerms} 
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
            {message && <p className="mt-4 text-center font-medium text-red-500">{message}</p>}
            <Toaster />
        </div>
    );
};

export default MultiStepRegister;
