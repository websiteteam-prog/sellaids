import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please login again.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/vendor/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProfile(response.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="page-container">
            <h1 className="page-title">My Profile</h1>
            <div className="card">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
                <p><strong>Business:</strong> {profile.business_name || "N/A"}</p>
            </div>
        </div>
    );
};

export default Profile;
