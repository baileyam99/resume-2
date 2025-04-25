// Define blank account
export const initialAccount = {
    Active: true,
    Admin: {
        AdminRequests: false,
        Announcements: false,
        AttendanceForms: false,
        Awards: false,
        FoodOrders: false,
        Members: false,
        PhysicalInventory: false,
        Users: false,
    },
    Alum: '',
    BirthDay: 0,
    BirthMonth: 0,
    CreatedOn: '',
    FirstName: '',
    GradSemester: '',
    GradYear: '',
    Instrument: [],
    LastName: '',
    Rookie: false,
    Staff: true,
    Student: false,
    Username: '',
    Verified: true,
    Year: '',
    OtherYear: '',
    Email: '',
};

export const blankAttendanceForm = {
    Title: '',
    StartDate: null,
    ExpirationDate: null,
    FormUUID: '',
    Username: '',
    EncryptedPin: '123456',
};

export const blankTimeForm = {
    StartDate: null,
    ExpirationDate: null,
    FormUUID: '',
};
