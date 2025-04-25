export const adminAuth = (account) => {
    const admin = account.Admin;
    let adminCount = 0;
    for (let key in admin) {
        if (admin.hasOwnProperty(key) && admin[key] === true) { 
            adminCount++;
        }
    }

    if (adminCount > 0) {
        return {
            hasAccess: true,
            configs: admin,
        };
    } else {
        return {
            hasAccess: false,
            configs: admin,
        };
    }
};
