import React, { useState } from 'react';
import axios from 'axios';
// import '../App.css';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Passwords do not match.');
            return;
        }
        try {
            const res = await axios.post(
                'http://localhost:5000/api/vendor/register',
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage('✅ Registration successful!');
            console.log('Server Response:', res.data);
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
        } catch (error) {
            setMessage('❌ Registration failed. Please try again.');
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2>Step 1: Basic Information</h2>
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                    </>
                );
            case 2:
                return (
                    <>
                        <h2>Step 2: Business Details</h2>
                        <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
                        <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} />
                        <input type="text" name="businessType" placeholder="Business Type" value={formData.businessType} onChange={handleChange} />
                        <input type="text" name="gstNumber" placeholder="GST Number" value={formData.gstNumber} onChange={handleChange} />
                        <input type="text" name="panNumber" placeholder="PAN Number" value={formData.panNumber} onChange={handleChange} />
                    </>
                );
            case 3:
                return (
                    <>
                        <h2>Step 3: Address</h2>
                        <input type="text" name="houseNo" placeholder="House No" value={formData.houseNo} onChange={handleChange} />
                        <input type="text" name="streetName" placeholder="Street Name" value={formData.streetName} onChange={handleChange} />
                        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
                    </>
                );
            case 4:
                return (
                    <>
                        <h2>Step 4: Alternate Contact Person</h2>
                        <input type="text" name="contactPersonName" placeholder="Contact Person Name" value={formData.contactPersonName} onChange={handleChange} />
                        <input type="text" name="contactPersonPhone" placeholder="Contact Person Phone" value={formData.contactPersonPhone} onChange={handleChange} />
                    </>
                );
            case 5:
                return (
                    <>
                        <h2>Step 5: Bank Details</h2>
                        <input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} />
                        <input type="text" name="ifscCode" placeholder="IFSC Code" value={formData.ifscCode} onChange={handleChange} />
                        <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} />
                        <select name="accountType" value={formData.accountType} onChange={handleChange}>
                            <option value="">Select Account Type</option>
                            <option value="Saving">Saving</option>
                            <option value="Current">Current</option>
                        </select>
                    </>
                );
            case 6:
                return (
                    <>
                        <h2>Step 6: Review Your Details</h2>
                        <div className="review-details">
                            <table>
                                <tbody>
                                    <tr><td><strong>Name:</strong></td><td>{formData.name}</td></tr>
                                    <tr><td><strong>Phone:</strong></td><td>{formData.phone}</td></tr>
                                    <tr><td><strong>Email:</strong></td><td>{formData.email}</td></tr>
                                    <tr><td><strong>Designation:</strong></td><td>{formData.designation}</td></tr>
                                    <tr><td><strong>Business Name:</strong></td><td>{formData.businessName}</td></tr>
                                    <tr><td><strong>Business Type:</strong></td><td>{formData.businessType}</td></tr>
                                    <tr><td><strong>GST Number:</strong></td><td>{formData.gstNumber}</td></tr>
                                    <tr><td><strong>PAN Number:</strong></td><td>{formData.panNumber}</td></tr>
                                    <tr><td><strong>Address:</strong></td>
                                        <td>{formData.houseNo}, {formData.streetName}, {formData.city}, {formData.state} - {formData.pincode}</td>
                                    </tr>
                                    <tr><td><strong>Contact Person:</strong></td><td>{formData.contactPersonName} ({formData.contactPersonPhone})</td></tr>
                                    <tr><td><strong>Bank:</strong></td>
                                        <td>{formData.bankName}, {formData.accountType}, A/C: {formData.accountNumber}, IFSC: {formData.ifscCode}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <label>
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                            />{' '}
                            I accept the Terms & Conditions
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="form-navigation">
                    {step > 1 && <button type="button" onClick={prevStep}>Back</button>}
                    {step < 6 ? (
                        <button type="button" onClick={nextStep}>Next</button>
                    ) : (
                        <button type="submit" disabled={!acceptTerms}>Submit</button>
                    )}
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MultiStepRegister;
