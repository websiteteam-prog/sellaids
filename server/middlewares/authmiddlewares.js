export const isUserLoginIn = (req, res, next) =>{
    if(req.session.userId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as User" });
}

export const isVendorLoginIn = (req, res, next) =>{
    if(req.session.vendorId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as Vendor" });
}

export const isAdminLoginIn = (req, res, next) =>{
    if(req.session.adminId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as Admin" });
}