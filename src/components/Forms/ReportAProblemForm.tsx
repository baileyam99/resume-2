import React, { ChangeEvent, FormEvent, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
    Box, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Chip,
    FormControl, 
    InputAdornment, 
    InputLabel,
    MenuItem, 
    Select, 
    TextField,
} from '@mui/material';
import { IoIosMail } from 'react-icons/io';
import { BsPersonCircle } from 'react-icons/bs';
import { MdReportProblem } from 'react-icons/md';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FcInfo } from 'react-icons/fc';
import '../../styles/forms.scss';

// Define screen sizes
const screens = {
    small: window.matchMedia('all and (max-device-width: 640px)').matches,
    tabletPort: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)').matches,
    tabletLand: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)').matches,
    medium: window.matchMedia('all and (min-device-width: 1025px) and (max-device-width: 1919px)').matches,
    large: window.matchMedia('all and (min-device-width: 1920px) and (max-device-width: 2559px)').matches,
    xlarge: window.matchMedia('all and (min-device-width: 2560px)').matches,
};

// Define form types
type FormState = {
    first: string;
    last: string;
    email: string;
    category: string;
    otherCategory: string;
    description: string;
    date: string;
    version: string;
};

// Problem form
export function ReportAProblemForm(props: {alert: Function}) {
    
    const { alert } = props;

    // Form spark API
    const formId = 'fsopMqd2k';
    const formSparkUrl = `https://submit-form.com/${formId}`;

    // ReCaptcha API
    const recaptchaKey = '6LccO4EiAAAAABt3d61RkMnqk21ggMCg-YiQHXQR';
    const recaptchaRef = useRef<any>();

    // Initialize form state
    const initialFormState = {
        first: '',
        last: '',
        email: '',
        category: '',
        otherCategory: '',
        description: '',
        date: '',
        version: `v${process.env.REACT_APP_VERSION}`,
    };

    // Initilize form set states
    const [screenSize, setScreenSize] = useState(screens);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [recaptchaToken, setReCaptchaToken] = useState<string>();
    const [isSelected1, setIsSelected1] = useState(false);
    const [isSelected2, setIsSelected2] = useState(false);
    const [isSelected3, setIsSelected3] = useState(false);
    const [isSelected4, setIsSelected4] = useState(false);
    const [fieldWidth, setFieldWidth] = useState(400);

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
            setFieldWidth(250);
        } else if (screenSize.tabletPort) {
            setFieldWidth(350);
        } else if (screenSize.tabletLand) {
            setFieldWidth(400);
        } else if (screenSize.large) {
            setFieldWidth(500);
        } else if (screenSize.xlarge) {
            setFieldWidth(500);
        } else {
            setFieldWidth(370);
        }
    }, [screenSize]);

    // Alert Message Handler
    const alertHandler = (message: string, type: string) => {
        const payload = {
            id: uuidv4(),
            type,
            message,
        }
        alert(payload);
    };

    // Form submit
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        await postSubmission();
        setSubmitting(false);
    };

    // Form submit function
    const postSubmission = async () => {
        const payload = {
            ...formState,
            'g-recaptcha-response': recaptchaToken,
        };

        try {
            const result = await axios.post(formSparkUrl, payload);
            if (!!result) {
                alertHandler('Success! Alex will get back to you ASAP!', 'success');
                setFormState(initialFormState);
                recaptchaRef.current.reset();
            }
        } catch (error) {
            console.error(error);
            alertHandler(error, 'error');
        }
    };

    // Form text field update
    const updateFormControl = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = event.target;
        const key = id as keyof FormState;
        const updatedFormState = { ...formState };
        updatedFormState[key] = value;
        updatedFormState['date'] = getDate();
        setFormState(updatedFormState);
    };

    // Form select update
    const updateFormControlSelect = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const value = event.target.value as string;
        const updatedFormState = { ...formState };
        updatedFormState['category'] = value;
        updatedFormState['date'] = getDate();
        setFormState(updatedFormState);
    };

    // Get current date/time
    function getDate() {
        const now = new Date();
        let hours = now.getHours();
        let mins = now.getMinutes().toString();
        let sec = now.getSeconds().toString();
        let meridiem = ' AM';
        if (hours > 12) { meridiem = ' PM'; hours = hours - 12; }
        if (parseInt(mins) < 10) { mins = '0' + mins; }
        if (parseInt(sec) < 10) { sec = '0' + sec; }
        let dateTime = (now.getMonth()+1) + '/'
        + now.getDate() + '/' 
        + now.getFullYear() + ' @ '  
        + hours + ':'  
        + mins + ':'
        + sec
        + meridiem;
        
        return dateTime;
    };

    // ReCaptcha token
    const updateRecaptchaToken = (token: string | null) => {
        setReCaptchaToken(token as string);
    };

    // Form title
    const title = <><MdReportProblem /> Report a Problem</> ;

    // First name adornment
    const fnameAdornment = isSelected1
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsPersonCircle />
            </InputAdornment>
        )
    } : {};

    // Last name adornment
    const lnameAdornment = isSelected2
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <BsPersonCircle />
            </InputAdornment>
        )
    } : {};
    
    // Email adornment
    const emailAdornment = isSelected3
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <IoIosMail style={{fontSize: "110%"}}/>
            </InputAdornment>
        )
    } : {};

    // Other adornment
    const otherAdornment = isSelected4
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <AiFillQuestionCircle style={{fontSize: "110%"}}/>
            </InputAdornment>
        )
    } : {};

    // Determines if other is selected
    function isOther() {
        let other = false;
        if (formState.category === 'Other') {
            other = true;
        }
        return other;
    }

    // Other message
    const msgOt = 'Please specifiy category';

    // Problem message
    const msgDesc = 'Please provide a short summary of the issue(s) you have been having';

    return (
        <div id="form">
            <Box id="report-a-problem-form" sx={{display: 'inline-block'}}>
                <Card>
                    <CardHeader title={title} />

                    {/* Required Indicator */}
                    <Chip 
                        className="MuiChip-root info"
                        icon={<FcInfo style={{transform: 'translateY(-2px)'}} />} 
                        label={
                            <span>
                                <span style={{color: '#db3131'}}>*</span>
                                &nbsp;Required Field
                            </span>
                        } 
                        variant="outlined" 
                    />
                    
                    <form onSubmit={submitForm}>
                        <CardContent> 

                            {/* First Name */}
                            <div className="padded">
                                <TextField 
                                    required
                                    error={false}
                                    id="first" 
                                    label="First Name" 
                                    variant="outlined"
                                    onChange={updateFormControl}
                                    value={formState?.first} 
                                    slotProps={{input: fnameAdornment}}
                                    onFocus={e => setIsSelected1(true)}
                                    onBlur={formState.first ? undefined : e => setIsSelected1(false)}
                                    onInput={e => setIsSelected1(true)}
                                    sx={{width: fieldWidth}}
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
                                    value={formState?.last} 
                                    slotProps={{input: lnameAdornment}}
                                    onFocus={e => setIsSelected2(true)}
                                    onBlur={formState.last ? undefined : e => setIsSelected2(false)}
                                    onInput={e => setIsSelected2(true)}
                                    sx={{width: fieldWidth}}
                                />
                            </div> 

                            {/* Email */}
                            <div className="padded">
                                <TextField 
                                    required
                                    id="email" 
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    onChange={updateFormControl}
                                    value={formState?.email} 
                                    slotProps={{input: emailAdornment}}
                                    onFocus={e => setIsSelected3(true)}
                                    onBlur={formState.email ? undefined : e => setIsSelected3(false)}
                                    onInput={e => setIsSelected3(true)}
                                    sx={{width: fieldWidth}}
                                />
                            </div>

                            {/* Category */}
                            <div className="padded">
                                <FormControl>
                                    <InputLabel id="category-label">Problem Category</InputLabel>
                                    <Select
                                        required
                                        labelId="category-label"
                                        id="category"
                                        variant="outlined"
                                        value={formState?.category}
                                        label="Problem Category"
                                        onChange={updateFormControlSelect}
                                        sx={{width: fieldWidth}}
                                    >
                                        <MenuItem value={'Page-Function'}>Page Function</MenuItem>
                                        <MenuItem value={'Component-Function'}>Component Function</MenuItem>
                                        <MenuItem value={'Page-Layout'}>Page Layout</MenuItem>
                                        <MenuItem value={'Component-Layout'}>Component Layout</MenuItem>
                                        <MenuItem value={'Link-Missing'}>Link Missing</MenuItem>
                                        <MenuItem value={'Link-Error'}>Link Error</MenuItem>
                                        <MenuItem value={'Typo'}>Typo</MenuItem>
                                        <MenuItem value={'Other'}>Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Selected Other */}
                            {isOther() && (
                                <div className="padded">
                                    <TextField 
                                        required
                                        id="otherCategory" 
                                        label={msgOt}
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formState?.otherCategory} 
                                        slotProps={{input: otherAdornment}}
                                        onFocus={e => setIsSelected4(true)}
                                        onBlur={formState.otherCategory ? undefined : e => setIsSelected4(false)}
                                        onInput={e => setIsSelected4(true)}
                                        sx={{width: fieldWidth}}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="padded">
                                <TextField 
                                    multiline
                                    required
                                    id="description" 
                                    label="Description" 
                                    placeholder={msgDesc}
                                    variant="outlined"
                                    onChange={updateFormControl}
                                    value={formState?.description} 
                                    rows={4}
                                    sx={{width: fieldWidth}}
                                />
                            </div>

                            {/* ReCAPTCHA */}
                            <div className="padded recaptcha">
                                <ReCAPTCHA
                                    className="rc-anchor-checkbox-label"
                                    ref={recaptchaRef}
                                    sitekey={recaptchaKey}
                                    onChange={updateRecaptchaToken}
                                />
                            </div>
                        </CardContent>

                        {/* Date/time */}
                        <input type="hidden" id="date" value={formState?.date} />

                        <CardActions>
                            <button disabled={submitting} className="main-button">
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </CardActions>
                    </form>         
                </Card>
            </Box>
        </div>
    );
};
