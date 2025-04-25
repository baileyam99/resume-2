import React, { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Box, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Checkbox, 
    Chip, 
    FormControl,
    FormControlLabel, 
    FormHelperText,
    IconButton,
    InputAdornment, 
    InputLabel, 
    MenuItem,
    Select, 
    SelectChangeEvent,
    TextField,
    Tooltip,
} from '@mui/material';
import { FaKey } from 'react-icons/fa';
import { HiAcademicCap, HiSearch } from 'react-icons/hi';
import { CgScreen } from 'react-icons/cg';
import { RiArrowDropDownLine, RiSmartphoneFill } from 'react-icons/ri';
import { IoCreateOutline } from 'react-icons/io5';
import { BiShow, BiHide } from 'react-icons/bi';
import { IoIosMail } from 'react-icons/io';
import { BsPersonCircle, BsXSquareFill } from 'react-icons/bs';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FcInfo } from 'react-icons/fc';
import { Oval } from 'react-loading-icons';
// import { 
//     createUser, 
//     getExistingEmails, 
//     getExistingUsernames, 
//     postUserData, 
//     sendVerificationEmail, 
//     updateEmailsAndUsernames,
//     recaptchaVerification,
// } from '../../api/firebaseApi';
import '../../styles/forms.scss';
import dayjs from 'dayjs';

// Define screen sizes
const screens = {
    small: window.matchMedia('all and (max-device-width: 640px)').matches,
    tabletPort: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)').matches,
    tabletLand: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)').matches,
    medium: window.matchMedia('all and (min-device-width: 1025px) and (max-device-width: 1919px)').matches,
    large: window.matchMedia('all and (min-device-width: 1920px) and (max-device-width: 2559px)').matches,
    xlarge: window.matchMedia('all and (min-device-width: 2560px)').matches,
};

// Define types for input data (strings)
type FormStateStr = {
    first: string;
    last: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    year: string;
    otherYear: string;
    gradSem: string;
    conf: string;
    instrumentSearch: string;
    date: string;
};

// Define types for input data (other)
type FormStateOth = {
    month: number;
    day: number;
    student: boolean | string;
    staff: boolean;
    gradyr: number | undefined;
    rookie: string | boolean;
};

// Instrument list type
type FormStateInstrument = {
    instrument: string[];
};

// ReCaptcha response error payload type
// type ErrorPayload = {
//     message: string,
//     status: number,
// };

// ReCaptcha response type
// type ReCaptchaResponse = [
//     boolean,
//     boolean | ErrorPayload,
// ];

// Define instrument list
const instrumentOptionsList = [
    'Flute',
    'Piccolo',
    'Oboe',
    'Clarinet',
    'Alto Saxophone',
    'Tenor Saxophone',
    'Bari Saxophone',
    'Trumpet',
    'Mellophone',
    'Baritone',
    'Trombone',
    'Tuba',
    'Bass Guitar',
    'Guitar',
    'Drum Set',
    'Snare Drum',
    'Tenor Drums',
    'Bass Drum',
    'Cymbals',
    'Keyboard',
];

// Initial form state for strings
const initialFormStateStr = {
    first: '',
    last: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    conf: '',
    date: '',
    year: '',
    otherYear: '',
    gradSem: '',
    instrumentSearch: ''
};

// Initial form state for other types
const initialFormStateOth = {
    month: 0,
    day: 0,
    student: true,
    staff: false,
    gradyr: undefined,
    rookie: false,
};

// Initial instrument array
const instrumentList: string[] = [];
const initialInstrumentFormState = {
    instrument: []
};

// Initialize valid domain extensions for emails
const validEndings = [
    '.com',
    '.org',
    '.net',
    '.edu',
    '.gov',
    '.mil',
    '.info',
    '.biz',
    '.io',
    '.co',
    '.us',
    '.uk',
    '.ca',
    '.au',
    '.de',
    '.tech',
    '.store',
    '.blog',
    '.app',
    '.design',
    '.law',
    '.photography',
    '.travel',
    '.academy',
    '.dev',
    '.guru',
];

// Create account form
export function CreateAccountForm(props: {alert: Function}) {
    
    // Get component props
    const { alert } = props;

    // Initilize form set states
    const [screenSize, setScreenSize] = useState(screens);
    const [formStateStr, setFormStateStr] = useState<FormStateStr>(initialFormStateStr);
    const [formStateOth, setFormStateOth] = useState<FormStateOth>(initialFormStateOth);
    const [formStateInst, setFormStateInst] = useState<FormStateInstrument>(initialInstrumentFormState);
    const [instruments, setInstruments] = useState(instrumentList);
    const [instrumentOptions, setInstrumentsOptions] = useState(instrumentOptionsList);
    // eslint-disable-next-line
    const [usernamesList, setUsernamesList] = useState<Array<string> | null | boolean>();
    // eslint-disable-next-line
    const [emailsList, setEmailsList] = useState<Array<string> | null | boolean>();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [userExists, setUserExists] = useState<boolean>(false);
    const [emailExists, setEmailExists] = useState<boolean>(false);
    const [emailFormatFlag, setEmailFormatFlag] = useState<boolean>(false);
    const [passwordFlag, setPasswordFlag] = useState<boolean>(false);
    const [gradYearFlag, setGradYearFlag] = useState<boolean>(false);
    const [instrumentFlag, setInstrumentFlag] = useState<boolean>(false);
    const [termsFlag, setTermsFlag] = useState<boolean>(false);
    const [bDayFlag, setBdayFlag] = useState<boolean>(false);
    const [usernameFormatFlag, setUsernameFormatFlag] = useState<boolean>(false);
    const [terms, setTerms] = useState<boolean>(false);
    const [reCAPTCHAVerified, setReCAPTCHAVerified] = useState<boolean>(false);
    const [fieldWidth, setFieldWidth] = useState(400);
    const [searchWidth, setSearchWidth] = useState(400/1.07);
    const [isOther, setIsOther] = useState<boolean>(false);
    const [isStudent, setIsStudent] = useState<boolean>(true);
    const [isStaff, setIsStaff] = useState<boolean>(false);
    const [isAlum, setIsAlum] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const [isSelected1, setIsSelected1] = useState<boolean>(false);
    const [isSelected2, setIsSelected2] = useState<boolean>(false);
    const [isSelected3, setIsSelected3] = useState<boolean>(false);
    const [isSelected4, setIsSelected4] = useState<boolean>(false);
    const [isSelected5, setIsSelected5] = useState<boolean>(false);
    const [isSelected6, setIsSelected6] = useState<boolean>(false);
    const [isSelected7, setIsSelected7] = useState<boolean>(false);
    const [isSelected8, setIsSelected8] = useState<boolean>(false);
    const [isSelected9, setIsSelected9] = useState<boolean>(false);
    const [isSelected10, setIsSelected10] = useState<boolean>(false);
    const [isSelected11, setIsSelected11] = useState<boolean>(false);
    const [isSelected12, setIsSelected12] = useState<boolean>(false);

    // Calculate graduation year parameters
    const thisYear = dayjs().year();
    const lastYr = thisYear - 1;
    const hundredYr = thisYear - 101;
    const nextYear = thisYear + 1;
    const quartCentFuture = thisYear + 26;
    const days31 = Array(32).fill(0).map((n, i) => n + i);
    const days30 = Array(31).fill(0).map((n, i) => n + i);
    const days29 = Array(30).fill(0).map((n, i) => n + i);
    const [days, setDays] = useState<Array<number>>(days31);

    // Define regex for phone number format
    const regex = new RegExp('^[0-9]{4}$');

    // Terms and Conditions link
    const pdfLink = 'https://drive.google.com/file/d/1_T8lxXQeR80_ESPP9hBslaw7Rcwxt1LY/view?usp=sharing';

    // ReCaptcha sitekey
    const sitekey = '6LcM7vIkAAAAAF6D39WAE2KbiqLUVcClDXFNUZlO';

    // useEffect for screen size changes
    useEffect(() => {
        const screenSizes = {
            small: window.matchMedia('all and (max-device-width: 640px)').matches,
            tabletPort: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)').matches,
            tabletLand: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)').matches,
            medium: window.matchMedia('all and (min-device-width: 1025px) and (max-device-width: 1919px)').matches,
            large: window.matchMedia('all and (min-device-width: 1920px) and (max-device-width: 2559px)').matches,
            xlarge: window.matchMedia('all and (min-device-width: 2560px)').matches,
        };
        const keys = Object.keys(screenSizes);

        const prev = {...screenSizes}
        const prevKeys = Object.keys(prev);
        for (let i = 0; i < prevKeys.length; i++) {
            if (screenSizes[keys[i]] !== prev[prevKeys[i]]) {
                prev[prevKeys[i]] = screenSizes[keys[i]];
            }
        }
        setScreenSize(prev);
    }, []);

    // useEffect for changing state variables based on screen size
    useEffect(() => {
        if (screenSize.small) {
            setFieldWidth(240);
            setSearchWidth(250/1.18);
        } else if (screenSize.tabletPort) {
            setFieldWidth(350);
            setSearchWidth(350/1.07);
        } else if (screenSize.tabletLand) {
            setFieldWidth(400);
            setSearchWidth(400/1.07);
        } else if (screenSize.large) {
            setFieldWidth(500);
            setSearchWidth(500/1.07);
        } else if (screenSize.xlarge) {
            setFieldWidth(500);
            setSearchWidth(500/1.07);
        } else {
            setFieldWidth(370);
            setSearchWidth(400/1.2);
        }
    }, [screenSize]);

    // useEffect for type and other selections
    useEffect(() => {
        if (typeof formStateOth.student === 'boolean' && !!formStateOth.student) {
            setIsStudent(true);
            setIsStaff(false);
            setIsAlum(false);
        } else if (formStateOth.student === 'Staff') {
            setIsStudent(false);
            setIsStaff(true);
            setIsAlum(false);
        } else if (formStateOth.student === 'Alumni') {
            setIsStudent(false);
            setIsStaff(false);
            setIsAlum(true);
        }
        
        if (formStateStr.year === 'Other') {
            setIsOther(true);
            if (!formStateOth.student) {
                formStateStr.year = 'None';
            }
        } else {
            setIsOther(false);
        }
    }, [formStateStr, formStateOth]);

    // Function to determine how many days are in that month
    const getDays = useCallback((month:number) => {
        if (month === 2) {
            setDays(days29);
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            setDays(days30);
        } else {
            setDays(days31);
        }
    }, [days29, days30, days31]);

    // useEffect to change number of days for birthday
    useEffect(() => {
        getDays(formStateOth.month);
    }, [formStateOth.month, getDays]);

    // Alert Message Handler
    const alertHandler = (message: string, type: string) => {
        const payload = {
            id: uuidv4(),
            type,
            message,
        }
        alert(payload);
    };

    // Multi-alert Message Handler
    const alertHandlerMulti = (message: Array<string>, type: string) => {
        const payloadArr:Array<Object> = [{
            id: uuidv4(),
            type,
            message: 'Pre-submission checks failed. Please check fields and try again.',
        }];
        for (let i = 0; i < message.length; i++) {
            const payload = {
                id: uuidv4(),
                type,
                message: message[i],
            }
            payloadArr.push(payload);
        }
        alert(payloadArr);
    };

    // Alert Message Handler Callback
    // const alertHandlerCall = useCallback((message: string, type: string) => {
    //     const payload = {
    //         id: uuidv4(),
    //         type,
    //         message,
    //     }
    //     alert(payload);
    // }, [alert]);

    const getExistingUsernamesAndEmails = useCallback( async () => {
        // const existingUsernamesData = await getExistingUsernames();
        // const existingEmailsData = await getExistingEmails();

        // if (!!existingUsernamesData && existingUsernamesData[0]) {
        //     setUsernamesList(existingUsernamesData[1])
        // } else {
        //     if (!!existingUsernamesData && typeof existingUsernamesData[1] === 'string') {
        //         alertHandlerCall(existingUsernamesData[1], 'error')
        //     }
        // }

        // if (!!existingEmailsData && existingEmailsData[0]) {
        //     setEmailsList(existingEmailsData[1]);
        // } else {
        //     if (typeof existingEmailsData[1] === 'string') {
        //         alertHandlerCall(existingEmailsData[1], 'error');
        //     }
        // }
    // }, [alertHandlerCall]);
    }, []);

    // useEffect for getting the existing emails and usernames
    useEffect(() => {
        getExistingUsernamesAndEmails();
    }, [getExistingUsernamesAndEmails])

    // Gets current date & time
    const getDate = () => {
        const now = new Date();
        let hours = now.getHours();
        let mins = now.getMinutes().toString();
        let meridiem = ' AM';
        if (hours > 12) { 
            meridiem = ' PM'; 
            hours = hours - 12; 
        }
        if (parseInt(mins) < 10) { 
            mins = '0' + mins; 
        }
        return (now.getMonth()+1) + '/'
        + now.getDate() + '/' 
        + now.getFullYear() + ' '  
        + hours + ':'  
        + mins
        + meridiem;
    };

    // Show password click handler
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    // Handler for Terms and Conditions PDF
    const handlePdfLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        window.open(pdfLink, '_blank');
    };

    // ReCAPTCHA verification
    const verifyRecaptcha = async (token: string | null) => {
        // const response:any | ReCaptchaResponse = await recaptchaVerification(token);
        // if (response[0]) {
        //     return response[1];
        // } else if (!response[0] && typeof response[1] !== 'boolean') {
        //     let alertMessage = response[1].message;
        //     if (response[1].status === 400) {
        //         alertMessage = 'ReCaptcha expired.'
        //     }
        //     alertHandler(alertMessage, 'error');
        //     return false;
        // }
        console.log(token);
        return true;
    };

    // Handle change for terms agreement
    const termsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setTermsFlag(false);
        if (!checked) {
            setTermsFlag(true);
            alertHandler('You must agree to the terms and conditions', 'error');
        }
        setTerms(checked);
    };

    // ReCaptcha change handler
    const handleRecaptchaChange = (value: string | null) => {
        verifyRecaptcha(value).then((res) => {
            setReCAPTCHAVerified(res);
        });
    };

    const checkTerms = (value: boolean) => {
        if (!value) {
            setTermsFlag(true);
            alertHandler('You must agree to the terms and conditions', 'error');
            return [false, 'You must agree to the terms and conditions'];
        }
        return [true, ''];
    };

    // Check Birthday
    const checkBday = (month: number, day: number) => {
        if ((month === 0 && day === 0) || (month === undefined && day === undefined) || (month > 0 && day > 0)) {
            return [true, ''];
        }
        setBdayFlag(true);
        return [false, 'Incorrect birthday format.'];
    };

    // Check password requirements
    const passwordRequirements = (password: string) => {
        const pattern = /^(?!.*password)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*\d.*\d).{12,}$/gm;
        const match = pattern.test(password);
        if (match && (password === '' 
        || formStateStr.password === '' 
        || formStateStr.password === null 
        || formStateStr.password === undefined)) { 
            // alertHandler('Password cannot be blank.', 'error');
            setPasswordFlag(true);
            return [false, 'Password cannot be blank.'];
        } else if (!match) {
            // alertHandler('Password requirements not met.', 'error');
            setPasswordFlag(true);
            return [false, 'Password requirements not met.']
        }
        return [true, ''];
    };

    // Check for username
    const checkUsername = (username: string) => {
        setUserExists(false);
        if (!!usernamesList && typeof usernamesList == 'object') {
            usernamesList.forEach((item: string) => {
                if (item === username.toLowerCase()) { 
                    setUserExists(true); 
                    alertHandler(`Account with: ${username} already exists.`, 'error');
                    return [true, `Account with: ${username} already exists.`];
                }
            });
            return [false, ''];
        }
        return [true, 'Error retrieving existing emails.'];
    };

    // Check username formatting
    const usernameFormat = (username: string) => {
        const pattern = /^[a-zA-Z0-9]{3,}$/;
        let match = pattern.test(username);
        if (match && (username === '' 
        || formStateStr.username === '' 
        || formStateStr.username === null 
        || formStateStr.username === undefined)) { 
            // alertHandler('Username cannot be blank.', 'error');
            setUsernameFormatFlag(true);
            return [false, 'Username cannot be blank.'];
        } else if (!match) { 
            // alertHandler('Username requirements not met.', 'error');
            setUsernameFormatFlag(true);
            return [false, 'Username requirements not met.'];
        }
        return [true, ''];
    };

    // Check email formatting
    const emailFormat = (email: string) => {
        setEmailFormatFlag(false);
        const atIndex = email.indexOf('@');
        
        if (atIndex !== -1 && atIndex < email.length - 1) {
            const domain = email.slice(atIndex + 1);
            const dotIndex = domain.lastIndexOf('.');
    
            if (dotIndex !== -1 && dotIndex < domain.length - 1) {
                const ending = domain.slice(dotIndex);
                const isValidEnding = validEndings.includes(ending);
    
                if (isValidEnding) {
                    return [true, ''];
                } else {
                    setEmailFormatFlag(true);
                    return [false, 'Invalid ending'];
                }
            } else {
                setEmailFormatFlag(true);
                return [false, 'Missing domain ending'];
            }
        } else {
            setEmailFormatFlag(true);
            return [false, 'Invalid email format'];
        }
    };

    // Check for email existance
    const checkEmail = (email: string) => {
        setEmailExists(false);
        if (!!emailsList && typeof emailsList == 'object') {
            emailsList.forEach((item: string) => {
                if (item === email.toLowerCase()) {
                    setEmailExists(true); 
                    alertHandler(`Account with: ${email} already exists.`, 'error');
                    return [true, `Account with: ${email} already exists.`];
                }
            });
            return [false, ''];
        }
        return [true, 'Error retrieving existing emails.'];
        
    };

    const isValidYear = (year: number | undefined, status: string | boolean) => {
        setGradYearFlag(false);
        if ((typeof status === 'boolean' && !!status) && (year === undefined || year <= lastYr || year >= quartCentFuture)) { 
            setGradYearFlag(true);
            return [false, 'Graduation year is invalid.'];
        } else if ((status === 'Alumni') && (year === undefined || year < hundredYr || year >= nextYear)) {
            setGradYearFlag(true);
            return [false, 'Graduation year is invalid.'];
        }
        return [true, ''];
    }

    // Check for Instrument input
    const checkInstrument = (length: number) => {
        if (length > 0) { 
            return [true, ''];
        }
        setInstrumentFlag(true);
        alertHandler('Please add at least one instrument.', 'error');
        return [false, 'Please add at least one instrument.'];
    };

    // Function to delete an instrument chip
    const handleDeleteChip = (instrumentToDelete: string) => {
        const updatedInstruments = instruments.filter((instrument) => instrument !== instrumentToDelete);
        if (updatedInstruments.length === 0) {
            alertHandler('Please add at least one instrument.', 'warn');
        }
        setInstruments(updatedInstruments);
    };

    // Function to add instrument chip
    const addInstrument = (instrument: string) => {
        let exists = false;
        const addArray: string[] = [];
        for (var item of instruments) {
            addArray.push(item);
            if (item === instrument) { 
                exists = true; 
            }
        }

        if (!exists) { 
            const letter = instrument.charAt(0).toUpperCase();
            const cut = instrument.substring(1).toLowerCase();
            const capInstrument = `${letter}${cut}`;
            addArray.push(capInstrument); 
        }
        setInstruments(addArray);
    };

    // Function to filter instrument options
    const filterInstrumentList = (filterOn: string) => {
        if (filterOn === '') {
            setInstrumentsOptions(instrumentOptionsList)
        } else { 
            const filteredInstruments: string[] = instrumentOptions.filter((instrument) =>
                instrument.toLowerCase().includes(filterOn.toLowerCase())
            );
            setInstrumentsOptions(filteredInstruments)
        }
    };

    // Form submission function
    const submitForm = async (event: FormEvent) => {
        setSubmitting(true);
        event.preventDefault();

        const email = formStateStr.email;
        const emailFormatCheck = emailFormat(email);
        const emailExistsCheck = checkEmail(email);
        const emailCheck = !emailExistsCheck[0] && emailFormatCheck[0];

        const userFormatCheck = usernameFormat(formStateStr.username);
        const usernameExistsCheck = checkUsername(formStateStr.username);
        const userCheck = !usernameExistsCheck[0] && userFormatCheck[0];

        const passwordReqs = passwordRequirements(formStateStr.conf);
        const passwordSame = compare(formStateStr.conf);
        const passCheck = (passwordReqs[0] && passwordSame[0]);

        const instCheck = checkInstrument(formStateInst.instrument.length);
        const bDayCheck = checkBday(formStateOth.month, formStateOth.day);
        const checkGradYear = isValidYear(formStateOth.gradyr, formStateOth.student);
        const checkTermsAndConditions = checkTerms(terms);

        const alertMessages: Array<string> = [];
        let pass = true;
        if (!passCheck) {
            pass = false;
            if (!passwordReqs[0]) {
                alertMessages.push(passwordReqs[1].toString());
            }
            if (!passwordSame[0]) {
                alertMessages.push(passwordSame[1].toString());
            }
        }
        if (!emailCheck) {
            pass = false;
            if (!emailExistsCheck) {
                alertMessages.push(emailExistsCheck[1]);
            }
            if (!emailFormatCheck[0]) {
                alertMessages.push(emailFormatCheck[1].toString());
            }
        }
        if (!userCheck) {
            pass = false;
            if (!usernameExistsCheck[0]) {
                alertMessages.push(usernameExistsCheck[1].toString());
            }
            if (!userFormatCheck[0]) {
                alertMessages.push(userFormatCheck[1].toString());
            }
        }
        if (!reCAPTCHAVerified) {
            pass = false;
            alertMessages.push('ReCAPTCHA not verified.');
        }
        if (!instCheck[0]) {
            pass = false;
            alertMessages.push(instCheck[1].toString());
        }
        if (!bDayCheck[0]) {
            pass = false;
            alertMessages.push(bDayCheck[1].toString());
        }
        if (!checkGradYear[0]) {
            pass = false;
            alertMessages.push(checkGradYear[1].toString());
        }
        if (!checkTermsAndConditions[0]) {
            pass = false;
            alertMessages.push(checkTermsAndConditions[1].toString());
        }

        if (pass) {
            await register().then(() => {
                setSubmitting(false);
                setAccountCreated(true);
                alertHandler(`Welcome, ${formStateStr.first}!`, 'success');
            });
        } else {
            alertHandlerMulti(alertMessages, 'error');
            setSubmitting(false);
        }
    };

    // User info registration function
    const register = async () => {
        let alum = false;
        if (isAlum) { 
            alum = true; 
            formStateOth.student = false; 
        }
        if (isStaff) { 
            formStateOth.staff = true; 
            formStateOth.student = false; 
        }
        if (formStateOth.gradyr === undefined) { 
            formStateOth.gradyr = 0; 
        }
        if (formStateStr.phone === '') {
            formStateStr.phone = 'None';
        }
        if (formStateStr.year === '') { 
            formStateStr.year = 'None'; 
        }
        if (formStateStr.gradSem === '') { 
            formStateStr.gradSem = 'None'; 
        }
        if (initialFormStateOth.gradyr === undefined) { 
            initialFormStateOth.gradyr = 0 as any; 
        }
        const regEmail = formStateStr.email.toLowerCase();
        const regPassword = formStateStr.password;
        const payload = {
            Active: true,
            Admin: {
                AdminRequests: false,
                Announcements: false,
                AttendanceForms: false,
                Awards: false,
                FoodOrders: false,
                Members: false,
                Photos: false,
                PhysicalInventory: false,
                Users: false,
            },
            Alum: alum,
            BirthDay: formStateOth.day,
            BirthMonth: formStateOth.month,
            CreatedOn: formStateStr.date,
            FirstName: formStateStr.first.charAt(0).toUpperCase() + formStateStr.first.slice(1).toLowerCase(),
            GradSemester: formStateStr.gradSem,
            GradYear: formStateOth.gradyr,
            Instrument: formStateInst.instrument,
            LastName: formStateStr.last.charAt(0).toUpperCase() + formStateStr.last.slice(1).toLowerCase(),
            Phone: formStateStr.phone,
            Rookie: formStateOth.rookie,
            Staff: formStateOth.staff,
            Student: formStateOth.student,
            Username: formStateStr.username.toLowerCase(),
            Verified: false,
            Year: formStateStr.year,
            OtherYear: formStateStr.otherYear,
            Email: regEmail,
        };
        // send payload
        const usrCreated = await createUser(regEmail, regPassword);
        if (usrCreated[0]) {
            // create user
            const registerUser = await postUserData(regEmail, payload);

            if (!!registerUser && registerUser[0]) {
                // update username and email
                // sendVerificationEmail();
                // const updates = await updateEmailsAndUsernames(regEmail, payload.Username);
                // if (typeof updates[1] === 'string') {
                //     alertHandler(updates[1], 'error');
                // }

                // Reset form
                setFormStateStr(initialFormStateStr);
                setFormStateOth(initialFormStateOth);
                setFormStateInst(initialInstrumentFormState);
                setInstruments(instrumentList);
            } else if (typeof registerUser[1] === 'string') {
                alertHandler(registerUser[1], 'error');
            }
        } else if (typeof usrCreated[1] === 'string') {
            alertHandler(usrCreated[1], 'error');
        }
    };

    // Username form controller
    const updateFormControlUsername = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { value } = event.target;
        const updatedFormState = { ...formStateStr };
        updatedFormState['username'] = value;
        setUsernameFormatFlag(false);
        checkUsername(value);
        if (value === '') { 
            alertHandler('Username cannot be blank.', 'warn');
        }
        setFormStateStr(updatedFormState);
    };

    // Email form controller
    const updateFormControlEmail = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { value } = event.target;
        const updatedFormState = { ...formStateStr };
        updatedFormState['email'] = value;
        checkEmail(value);
        if (value === '') { 
            alertHandler('Email cannot be blank.', 'warn');
        }
        setFormStateStr(updatedFormState);
    };

    // Password form controller
    const updateFormControlPassword = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement > ) => {
        const { id, value } = event.target;
        const key = id as keyof FormStateStr;
        const updatedFormState = { ...formStateStr };
        updatedFormState[key] = value;
        if (value === '') { 
            alertHandler('Password cannot be blank.', 'warn');
        }
        setFormStateStr(updatedFormState);
        setPasswordFlag(false);
    };

    // All other field form controller
    const updateFormControl = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
        const { id, value } = event.target;
        const key = id as keyof FormStateStr;
        const updatedFormState = { ...formStateStr };
        const updatedFormStateOth = { ...formStateOth }

        if (id === 'gradyr') { 
            if (!value) {
                alertHandler('Graduation year cannot be blank.', 'warn');
            }
            updatedFormStateOth['gradyr'] = parseInt(value);
        } else if (id === 'student' || id === 'rookie') {
            const val = value.toLowerCase() === 'true';
            updatedFormStateOth[key] = val;
        } else if (id === 'first') {
            if (value === '') {
                updatedFormState['first'] = value;
                alertHandler('First name cannot be blank.', 'warn');
            } else {
                let letter = value.charAt(0).toUpperCase();
                let cut = value.substring(1).toLowerCase();
                let first = `${letter}${cut}`;
                updatedFormState['first'] = first;
            }
        } else if (id === 'last') {
            if (value === '') {
                updatedFormState['last'] = value;
                alertHandler('Last name cannot be blank.', 'warn');
            } else {
                let letter = value.charAt(0).toUpperCase();
                let cut = value.substring(1).toLowerCase();
                let last = `${letter}${cut}`;
                updatedFormState['last'] = last;
            }
        } else if (id === 'instrumentSearch') {
            updatedFormState['instrumentSearch'] = value;
            filterInstrumentList(value);
        } else { 
            if (id === 'year' && value === 'None') { 
                updatedFormState['year'] = ''; 
            }
            updatedFormState[key] = value;
        }

        updatedFormState['date'] = getDate();
        setFormStateStr(updatedFormState);
        setFormStateOth(updatedFormStateOth);
    };
        
    // Class year dropdown selection form controller
    const updateFormControlSelect = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const value = event.target.value as string;
        const updatedFormState = { ...formStateStr };
        updatedFormState['year'] = value;
        updatedFormState['date'] = getDate();
        setFormStateStr(updatedFormState);
    };

    // Birthday month dropdown selection form controller
    const updateFormControlSelect2 = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const value = event.target.value as number;
        const updatedFormState = { ...formStateOth };
        const updatedFormStateStr = { ...formStateStr };
        updatedFormState['month'] = value;
        updatedFormStateStr['date'] = getDate();
        setFormStateOth(updatedFormState);
        setFormStateStr(updatedFormStateStr);
        setBdayFlag(false);
    };

    // Birthday day dropdown selection form controller
    const updateFormControlSelect3 = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const value = event.target.value as number;
        const updatedFormState = { ...formStateOth };
        const updatedFormStateStr = { ...formStateStr };
        updatedFormState['day'] = value;
        updatedFormStateStr['date'] = getDate();
        setFormStateOth(updatedFormState);
        setFormStateStr(updatedFormStateStr);
        setBdayFlag(false);
    };

    // Student type dropdown selection form controller
    const updateFormControlSelect4 = (
        event: React.ChangeEvent<{ value: boolean }>
    ) => {
        const value = event.target.value;
        const updatedFormState = { ...formStateOth };
        const updatedFormStateStr = { ...formStateStr };
        updatedFormState['student'] = value;
        updatedFormStateStr['date'] = getDate();
        setFormStateOth(updatedFormState);
        setFormStateStr(updatedFormStateStr);
    };

    // Graduation semester dropdown selection form controller
    const updateFormControlSelect5 = (
        event: SelectChangeEvent<string>
    ) => {
        const value = event.target.value;
        const updatedFormState = { ...formStateStr };
        updatedFormState['gradSem'] = value;
        updatedFormState['date'] = getDate();
        setFormStateStr(updatedFormState);
    };

    // Member type dropdown selection form controller
    const updateFormControlSelect6 = (
        event: SelectChangeEvent<boolean>
    ) => {
        const value = event.target.value;
        const updatedFormState = { ...formStateOth };
        const updatedFormStateStr = { ...formStateStr };
        updatedFormState['rookie'] = value;
        updatedFormStateStr['date'] = getDate();
        setFormStateOth(updatedFormState);
        setFormStateStr(updatedFormStateStr);
    };

    const updateFormControlSelect7 = (value: string, event: FormEvent) => {
        event.preventDefault();
        addInstrument(value);

        let newArray: string[] = [];
        for (var item of formStateInst.instrument) {
        newArray.push(item);
        }
        newArray.push(value);
        const updatedFormState = { ...formStateInst };
        const updatedFormStateStr = { ...formStateStr };
        updatedFormState['instrument'] = newArray;
        updatedFormStateStr['date'] = getDate();
        setFormStateInst(updatedFormState);
        setFormStateStr(updatedFormStateStr);
        setInstrumentFlag(false);
    };

    // Function to check passwords
    function compare(input: string) {
        if (formStateStr.password !== input) { 
            setPasswordFlag(true);
            alertHandler('Passwords do not match.', 'error');
            return [false, 'Passwords do not match.'];
        }
        return [true, ''];
    }

    // Form title 
    const title = <><IoCreateOutline /> Create Account</> ;

    // First name adornment
    const fnameAdornment = isSelected1
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsPersonCircle />
            </InputAdornment>
        )
    } : {};
    
    // Last name adornments
    const lnameAdornment = isSelected2
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsPersonCircle />
            </InputAdornment>
        )
    } : {};

    // Username adornments
    const usrAdornment = isSelected3
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <CgScreen />
            </InputAdornment>
        )
    } : {};
    
    // Email adornments
    const emailAdornment = isSelected4
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <IoIosMail style={{fontSize: '110%'}}/>
            </InputAdornment>
        )
    } : {};
    
    // Password adornments
    const passAdornment = isSelected5
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <FaKey />
            </InputAdornment>
        ),
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showPassword ? <BiShow /> : <BiHide />}
                </IconButton>
            </InputAdornment>
        )
    } : {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showPassword ? <BiShow /> : <BiHide />}
                </IconButton>
            </InputAdornment>
        )
    };
    
    // Password confirmed adronments
    const confAdornment = isSelected6
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <FaKey />
            </InputAdornment>
        ),
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showPassword ? <BiShow /> : <BiHide />}
                </IconButton>
            </InputAdornment>
        )
    } : {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showPassword ? <BiShow /> : <BiHide />}
                </IconButton>
            </InputAdornment>
        )
    };

    // Other adornment
    const otherAdornment = isSelected7
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <AiFillQuestionCircle style={{fontSize: '110%'}}/>
            </InputAdornment>
        )
    } : {};

    // Graduation year adornment
    const gradYearAdornment = isSelected8
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <HiAcademicCap style={{fontSize: '110%'}}/>
            </InputAdornment>
        )
    } : {};

    // Email alternate 
    const emailAdornamentAlt = isSelected9
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsXSquareFill style={{fontSize: '110%', color: '#DB3131'}} />
            </InputAdornment>
        )
    } : {};

    // Email alternate
    const usrAdornamentAlt = isSelected10
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsXSquareFill style={{fontSize: '110%', color: '#DB3131'}} />
            </InputAdornment>
        )
    } : {};

    // Searchbox adornment
    const searchAdornment = isSelected11
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <HiSearch style={{fontSize: '110%'}}/>
            </InputAdornment>
        )
    } : {};

    // Phone number adornment
    const phoneAdornment = isSelected12
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <RiSmartphoneFill style={{fontSize: "110%"}}/>
            </InputAdornment>
        )
    } : {};

    return (
        <div id="create-account-form">
            <Box sx={{display: 'inline-block'}}>
                <Card id="create-box" sx={screenSize.small ? {width: 275, marginTop: '1em'} : {}}>
                    <CardHeader title={title} />
                    <form onSubmit={submitForm}>
                        <CardContent>

                            {/* First Name */}
                            <div className="padded">
                                <TextField 
                                    required
                                    id="first" 
                                    label="First Name" 
                                    variant="outlined"
                                    onChange={updateFormControl}
                                    value={formStateStr?.first} 
                                    sx={{width: fieldWidth}}
                                    InputProps={fnameAdornment}
                                    onFocus={e => setIsSelected1(true)}
                                    onBlur={formStateStr.first ? undefined : e => setIsSelected1(false)}
                                    onInput={e => setIsSelected1(true)}
                                />
                            </div> 

                            {/* Last Name */}
                            <div className="padded">
                                <TextField 
                                    required
                                    id="last" 
                                    label="Last Name" 
                                    variant="outlined"
                                    onChange={updateFormControl}
                                    value={formStateStr?.last} 
                                    sx={{width: fieldWidth}}
                                    InputProps={lnameAdornment}
                                    onFocus={e => setIsSelected2(true)}
                                    onBlur={formStateStr.last ? undefined : e => setIsSelected2(false)}
                                    onInput={e => setIsSelected2(true)}
                                />
                            </div> 

                            {/* Username Info */}
                            <div className="padded" style={{display: 'inline-block'}}>
                                <Accordion sx={{width: fieldWidth}}>
                                    <AccordionSummary expandIcon={<RiArrowDropDownLine />}>
                                        <span className="info-color"><FcInfo /> Username Requirements</span>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <span className="info-color list">
                                            <ul>
                                                <li>Must be at least 3 characters long</li>
                                                <li>Must NOT contain any special characters. EX: $, %, @</li>
                                            </ul>
                                        </span>
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            {/* Username */} 
                            <div className="padded">
                                <TextField 
                                    required
                                    error={userExists}
                                    id="username" 
                                    label="Create a Username" 
                                    variant="outlined"
                                    onChange={updateFormControlUsername}
                                    value={formStateStr?.username} 
                                    sx={{width: fieldWidth}}
                                    InputProps={(!userExists && usernameFormatFlag) ? usrAdornamentAlt : usrAdornment}
                                    onFocus={e => ((!userExists && usernameFormatFlag) ? setIsSelected10(true) : setIsSelected3(true))}
                                    onBlur={formStateStr.username ? undefined : e => ((!userExists && usernameFormatFlag) ? setIsSelected10(true) : setIsSelected3(true))}
                                    onInput={e => ((!userExists && usernameFormatFlag) ? setIsSelected10(true) : setIsSelected3(true))}
                                />
                            </div> 

                            {/* Email */}
                            <div className="padded">
                                <TextField 
                                    required
                                    error={(emailExists || emailFormatFlag)}
                                    id="email" 
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    onChange={updateFormControlEmail}
                                    value={formStateStr?.email} 
                                    sx={{width: fieldWidth}}
                                    InputProps={(!emailExists && emailFormatFlag) ? emailAdornamentAlt : emailAdornment}
                                    onFocus={e => ((!emailExists && emailFormatFlag) ? setIsSelected9(true) : setIsSelected4(true))}
                                    onBlur={formStateStr.email ? undefined : e => ((!emailExists && emailFormatFlag) ? setIsSelected9(true) : setIsSelected4(true))}
                                    onInput={e => ((!emailExists && emailFormatFlag) ? setIsSelected9(true) : setIsSelected4(true))}
                                />
                            </div>

                            {/* Phone */}
                            <div className="padded" style={{marginBottom: -15}}>
                                <TextField 
                                    id="phone" 
                                    label="Phone Number"
                                    placeholder="XXX-XXX-XXXX"
                                    inputProps={{pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}"}}
                                    variant="outlined"
                                    type="text"
                                    helperText={
                                        <span className="helper-2">
                                            (Optional)&nbsp;
                                            <Tooltip title="Your phone number will be used for professional uses ONLY and will not be shared outside of CTS staff.">
                                                <span><AiFillQuestionCircle className="icon-black" /></span>
                                            </Tooltip>
                                        </span>
                                    }
                                    onChange={updateFormControl}
                                    value={formStateStr?.phone} 
                                    sx={{width: fieldWidth}}
                                    InputProps={phoneAdornment}
                                    onFocus={e => setIsSelected12(true)}
                                    onBlur={formStateStr.phone ? undefined : e => setIsSelected12(false)}
                                    onInput={e => setIsSelected12(true)}
                                />
                            </div>

                            {/* Password Info */}
                            <div className="padded" style={{display: 'inline-block'}}>
                                <Accordion sx={{width: fieldWidth}}>
                                    <AccordionSummary expandIcon={<RiArrowDropDownLine />}>
                                        <span className="info-color"><FcInfo /> Password Requirements</span>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <span className="info-color list">
                                            <ul>
                                                <li>Must be at least 12 characters long</li>
                                                <li>Must contain at least one uppercase character</li>
                                                <li>Must contain at least one lowercase character</li>
                                                <li>Must contain at least one of the following characters: !@#$%^&*{'()[]{}<>'}_-=+/\|*`~;:’”
                                                </li>
                                                <li>Must contain at least two numbers</li>
                                                <li>Must NOT be any form of the word 'password'</li>
                                            </ul>
                                        </span>
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            {/* Password */}
                            <div className="padded">
                                <TextField 
                                    required
                                    error={passwordFlag}
                                    id="password" 
                                    label="Password" 
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={updateFormControlPassword}
                                    InputProps={passAdornment}                
                                    value={formStateStr?.password} 
                                    sx={{width: fieldWidth}}
                                    onFocus={e => setIsSelected5(true)}
                                    onBlur={formStateStr.password ? undefined : e => setIsSelected5(false)}
                                    onInput={e => setIsSelected5(true)}
                                />
                            </div> 

                            {/* Confirm */}
                            <div className="padded">
                                <TextField 
                                    required
                                    error={passwordFlag}
                                    id="conf" 
                                    label="Confirm Password" 
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={updateFormControlPassword}
                                    value={formStateStr?.conf} 
                                    sx={{width: fieldWidth}}
                                    InputProps={confAdornment}
                                    onFocus={e => setIsSelected6(true)}
                                    onBlur={formStateStr.conf ? undefined : e => setIsSelected6(false)}
                                    onInput={e => setIsSelected6(true)}
                                />
                            </div>

                            {/* Birthday */}
                            <div className="padded">
                                <InputLabel className="birthday">Birthday</InputLabel>
                            </div>
                            <div className="padded" style={{display: 'inline-block'}}>
                                <FormControl>
                                    <InputLabel>Month</InputLabel>
                                    <Select
                                        labelId="year-label"
                                        error={bDayFlag}
                                        id="month"
                                        variant="outlined"
                                        value={formStateOth?.month}
                                        label="Month"
                                        onChange={updateFormControlSelect2}
                                        sx={{width: fieldWidth/2}}
                                    >
                                        <MenuItem value={0}>-</MenuItem>
                                        <MenuItem value={1}>January</MenuItem>
                                        <MenuItem value={2}>February</MenuItem>
                                        <MenuItem value={3}>March</MenuItem>
                                        <MenuItem value={4}>April</MenuItem>
                                        <MenuItem value={5}>May</MenuItem>
                                        <MenuItem value={6}>June</MenuItem>
                                        <MenuItem value={7}>July</MenuItem>
                                        <MenuItem value={8}>August</MenuItem>
                                        <MenuItem value={9}>September</MenuItem>
                                        <MenuItem value={10}>October</MenuItem>
                                        <MenuItem value={11}>November</MenuItem>
                                        <MenuItem value={12}>December</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="padded" style={{display: 'inline-block'}}>
                                <FormControl>
                                    <InputLabel>Day</InputLabel>
                                    <Select
                                        labelId="year-label"
                                        error={bDayFlag}
                                        id="day"
                                        variant="outlined"
                                        value={formStateOth?.day}
                                        label="Day"
                                        onChange={updateFormControlSelect3}
                                        sx={{width: fieldWidth/2}}
                                    >
                                        {days.map((day: string | number, index: number) => {
                                            let val = day;
                                            if (day === 0) {
                                                day = '-';
                                            }
                                            return <MenuItem key={index} value={val}>{day}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Instrument */}
                            <div className={`padded${instrumentFlag ? ' error' : ''}`}>
                                <InputLabel 
                                    required 
                                    className="instrument-label second"
                                >
                                    Instrument(s)
                                </InputLabel>
                                <div className="instruments-div">
                                    {instruments.length === 0 && (
                                        <Chip 
                                            className="MuiChip-root info"
                                            icon={<FcInfo style={{transform: 'translateY(-1px)'}} />} 
                                            label="Please select the instrument(s) that you currently play." 
                                            variant="outlined"
                                            sx={{marginTop: '1em'}}
                                        />
                                    )}
                                    {instruments.map((instrument: string) => {
                                        return (
                                            <div style={{padding: '5px 0 0 5px'}} key={`${instrument}`}>
                                                <Chip 
                                                    label={instrument}
                                                    variant="outlined"
                                                    onDelete={() => handleDeleteChip(instrument)}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                                <Accordion>
                                    <AccordionSummary expandIcon={<RiArrowDropDownLine />}>
                                        <span>Instrument Options</span>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{marginTop: 15}}>
                                            <TextField 
                                                id="instrumentSearch" 
                                                helperText="Search for an instrument here. Click an instrument to add it to your profile."
                                                label="Search" 
                                                variant="outlined"
                                                value={formStateStr.instrumentSearch}
                                                onChange={updateFormControl}
                                                InputProps={searchAdornment}
                                                sx={{width: searchWidth}}
                                                onFocus={e => setIsSelected11(true)}
                                                onBlur={formStateStr.instrumentSearch ? undefined : e => setIsSelected11(false)}
                                                onInput={e => setIsSelected11(true)}
                                            />
                                        </div>

                                        {instrumentOptions.length === 0 && (
                                            <div className="instrument-button-div">
                                                <button 
                                                    className="instrument-button"
                                                    onClick={(event) => updateFormControlSelect7(formStateStr.instrumentSearch, event)}
                                                >
                                                    ADD '{formStateStr.instrumentSearch.toUpperCase()}'
                                                </button>
                                            </div>
                                        )}
                                        
                                        {instrumentOptions.map((instrument, key) => {
                                            return (
                                                <div key={`${key}-${instrument}`} className="instrument-button-div">
                                                    <button 
                                                        className="instrument-button"
                                                        onClick={(event) => updateFormControlSelect7(instrument, event)}
                                                    >
                                                        {instrument.toUpperCase()}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            {/* Student */}
                            <div className="padded">
                                <FormControl>
                                    <InputLabel required id="year-label">Account Type</InputLabel>
                                    <Select
                                        required
                                        labelId="year-label"
                                        name="student"
                                        variant="outlined"
                                        value={formStateOth?.student}
                                        label="Account Type"
                                        onChange={updateFormControlSelect4}
                                        sx={{width: fieldWidth}}
                                    >
                                        <MenuItem value={true as any}>Student</MenuItem>
                                        <MenuItem value={'Staff'}>Staff</MenuItem>
                                        <MenuItem value={'Alumni'}>Alumni</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Year */}
                            {isStudent && (
                                <div className="padded">
                                    <FormControl>
                                        <InputLabel id="year-label">Academic Year</InputLabel>
                                        <Select
                                            labelId="year-label"
                                            name="year"
                                            variant="outlined"
                                            value={formStateStr?.year}
                                            label="Academic Year"
                                            onChange={updateFormControlSelect}
                                            sx={{width: fieldWidth}}
                                        >
                                            <MenuItem value={'None'}>None</MenuItem>
                                            <MenuItem value={'Freshman'}>Freshman</MenuItem>
                                            <MenuItem value={'Sophomore'}>Sophomore</MenuItem>
                                            <MenuItem value={'Junior'}>Junior</MenuItem>
                                            <MenuItem value={'Senior'}>Senior</MenuItem>
                                            <MenuItem value={'Rising-Freshman'}>Rising Freshman</MenuItem>
                                            <MenuItem value={'Rising-Sophomore'}>Rising Sophomore</MenuItem>
                                            <MenuItem value={'Rising-Junior'}>Rising Junior</MenuItem>
                                            <MenuItem value={'Rising-Senior'}>Rising Senior</MenuItem>
                                            <MenuItem value={'Other'}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            )}

                            {/* Selected Other */}
                            {isOther && (
                                <div className="padded">
                                    <TextField 
                                        required={isOther}
                                        id="otherYear" 
                                        label="Please Specify Other" 
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formStateStr?.otherYear} 
                                        sx={{width: fieldWidth}}
                                        InputProps={otherAdornment}
                                        onFocus={e => setIsSelected7(true)}
                                        onBlur={formStateStr.otherYear ? undefined : e => setIsSelected7(false)}
                                        onInput={e => setIsSelected7(true)}
                                    />
                                </div>
                            )}

                            {/* Grad Semester */}
                            {isStudent && (
                                <div className="padded">
                                    <FormControl>
                                        <InputLabel id="year-label">Graduation Semester</InputLabel>
                                        <Select
                                            labelId="year-label"
                                            name="gradSem"
                                            variant="outlined"
                                            value={formStateStr?.gradSem}
                                            label="Academic Year"
                                            onChange={(event) => updateFormControlSelect5(event)}
                                            sx={{width: fieldWidth}}
                                        >
                                            <MenuItem value={"None"}>-</MenuItem>
                                            <MenuItem value={"Spring"}>Spring</MenuItem>
                                            <MenuItem value={"Fall"}>Fall</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            )}

                            {/* Grad Year */}
                            {isStudent && (
                                <div className="padded">
                                    <TextField 
                                        type="number"
                                        required={isStudent}
                                        inputProps={{pattern: regex}}
                                        id="gradyr" 
                                        error={gradYearFlag}
                                        label="Graduation Year"
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formStateOth?.gradyr} 
                                        sx={{width: fieldWidth}}
                                        InputProps={gradYearAdornment}
                                        onFocus={e => setIsSelected8(true)}
                                        onBlur={formStateOth.gradyr ? undefined : e => setIsSelected8(false)}
                                        onInput={e => setIsSelected8(true)}
                                    />
                                    <FormHelperText>{`The year must be > ${lastYr} and < ${quartCentFuture}`}</FormHelperText>
                                </div> 
                            )}

                            {/* Grad Year Alum*/}
                            {isAlum && (
                                <div className="padded">
                                    <TextField 
                                        required={isAlum}
                                        type="number"
                                        inputProps={{pattern: regex}}
                                        id="gradyr" 
                                        error={gradYearFlag}
                                        label="Graduation Year"
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formStateOth?.gradyr} 
                                        sx={{width: fieldWidth}}
                                        InputProps={gradYearAdornment}
                                        onFocus={e => setIsSelected8(true)}
                                        onBlur={formStateOth.gradyr ? undefined : e => setIsSelected8(false)}
                                        onInput={e => setIsSelected8(true)}
                                    />
                                    <FormHelperText>{`The year must be > ${hundredYr} and < ${nextYear}`}</FormHelperText>
                                </div> 
                            )}

                            {/* Rookie */}
                            {isStudent && (
                                <div className="padded">
                                    <FormControl>
                                    <InputLabel required id="year-label">Member Type</InputLabel>
                                    <Select
                                        required={isStudent}
                                        labelId="year-label"
                                        name="rookie"
                                        variant="outlined"
                                        value={formStateOth?.rookie}
                                        label="Rookie?"
                                        onChange={updateFormControlSelect6}
                                        sx={{width: fieldWidth}}
                                    >
                                        <MenuItem value={true as any}>Rookie</MenuItem>
                                        <MenuItem value={false as any}>Returning</MenuItem>
                                    </Select>
                                    </FormControl>
                                </div>
                            )}

                            {/* Terms & Conditions */}
                            <div className="padded">
                                <FormControlLabel
                                    className={`hidden-asterisk-control${termsFlag ? ' error' : ''}`}
                                    sx={{width: fieldWidth}}
                                    control={
                                        <Checkbox
                                            checked={terms}
                                            onChange={(event) => termsHandler(event)}
                                            name="termsandconditions" 
                                            required
                                        />
                                    }
                                    label={
                                        <InputLabel 
                                            required 
                                            id="year-label"
                                            className="terms"
                                        >
                                            I agree to to the Chucktown Sound <Link to="#" onClick={handlePdfLinkClick}>Terms & Conditions</Link>
                                        </InputLabel>
                                    }
                                />
                                <FormHelperText sx={{fontSize: '40%'}}>
                                    By checking the "I agree" box, you acknowledge that you have read, understood, and agreed to the terms and conditions linked above.
                                </FormHelperText>
                            </div>
                        
                            {/* ReCAPTCHA */}
                            <div className="padded" style={{width: fieldWidth, display: 'inline-block'}}>
                                <ReCAPTCHA 
                                    sitekey={sitekey} 
                                    onChange={handleRecaptchaChange} 
                                    style={screenSize.small ? {transform: 'scale(.80)', marginLeft: -28} : {}}
                                />
                            </div>
                        </CardContent>

                        <CardActions sx={{margin: '1em 1em', justifyContent: 'center'}}>
                            <button className="main-button" disabled={submitting}>
                                {submitting ? <Oval /> : 'Create'}
                            </button>
                        </CardActions> 

                        <CardActions>
                            <Link className="secondary" to='/login'>Log In To Existing Account</Link>
                        </CardActions>  

                    </form>    
                </Card>
            </Box>
            {accountCreated && (
                <Navigate to="/dashboard" />
            )}
        </div>
    );
};
