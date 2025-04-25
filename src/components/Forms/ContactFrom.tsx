import React, { 
    ChangeEvent, 
    FormEvent, 
    useRef,
    useEffect,
    useState 
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
    Box, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Chip,
    InputAdornment,
    TextField,
} from '@mui/material';
import { IoIosMail } from 'react-icons/io';
import { BsPersonCircle } from 'react-icons/bs';
import { FaBuilding, FaPaperPlane } from 'react-icons/fa';
import { FcInfo } from 'react-icons/fc';
import { sendConfirmationEmail } from '../../api/firebaseApi';
import dayjs from 'dayjs';
import '../../styles/forms.scss';
import { capitalizeWords, isOnlySpace } from '../Utils/stringUtils';

// Define screen sizes
const screens = {
    small: window.matchMedia('all and (max-device-width: 640px)').matches,
    tabletPort: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)').matches,
    tabletLand: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)').matches,
    medium: window.matchMedia('all and (min-device-width: 1025px) and (max-device-width: 1919px)').matches,
    large: window.matchMedia('all and (min-device-width: 1920px) and (max-device-width: 2559px)').matches,
    xlarge: window.matchMedia('all and (min-device-width: 2560px)').matches,
};

export function ContactForm(props: { alert: Function; }) {

    // Initialize form state
    const initialFormState = {
        SubmissionUuid: uuidv4(),
        email: '',
        name: '',
        company: '',
        message: '',
        date: '',
    };

    // Form types
    type FormState = {
        SubmissionUuid: string;
        email: string;
        name: string;
        company: string;
        message: string;
        date: string;
    };

    type ErrorMessage = {
        id: string;
        type: string;
        message: string;
    };

    type ErrorArray = Array<ErrorMessage>;

    // Get the component props and initialize useStates
    const { alert } = props;
    const [screenSize, setScreenSize] = useState(screens);
    const [fieldWidth, setFieldWidth] = useState<number>(400);
    const [maxAlerts, setMaxAlerts] = useState<number>(0);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [recaptchaToken, setReCaptchaToken] = useState<string>();
    const [limitReached, setLimitReached] = useState<boolean>(false);
    const [isSelected1, setIsSelected1] = useState<boolean>(false);
    const [isSelected2, setIsSelected2] = useState<boolean>(false);
    const [isSelected3, setIsSelected3] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [nameError, setNameError] = useState<boolean>(false);
    const charLimit = 300;

    // Function to show a message from form
    const showAlert = (alertPayload: object) => {
        alert(alertPayload);
    }

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

        const prev = {...screenSize}
        const prevKeys = Object.keys(prev);
        for (let i = 0; i < prevKeys.length; i++) {
            if (screenSizes[keys[i]] !== prev[prevKeys[i]]) {
                prev[prevKeys[i]] = screenSizes[keys[i]];
            }
        }
        setScreenSize(prev);
    }, [screenSize]);

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
            setFieldWidth(400);
        }
    }, [screenSize]);
  
    // Form spark API
    const formId = "YJwCXBmr";
    const formSparkUrl = `https://submit-form.com/${formId}`;
  
    // ReCaptcha API
    const recaptchaKey = '6LeoZU8jAAAAAIelBJOpTfi3g0MPcdVLvVBkLIPz';
    const recaptchaRef = useRef<any>();

    // Set ReCaptcha token
    const updateRecaptchaToken = (token: string | null) => {
        setReCaptchaToken(token as string);
    };
  
    // Function to submit form
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setEmailError(false);
        setNameError(false);
        const errors:ErrorArray = [];
        if (isOnlySpace(formState.name) || !formState.name) {
            console.error('Submission failed! Name cannot be blank.');
            // Show floating error alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: 'Name cannot be blank.',
            };
            errors.push(message);
            setNameError(true);
        }
        
        if (isOnlySpace(formState.email) || !formState.email) {
            console.error('Submission failed! Email cannot be blank.');
            // Show floating error alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: 'Email cannot be blank.',
            };
            errors.push(message);
            setEmailError(true);
        }

        if (limitReached) {
            console.error('Submission failed! Message over character limit.');
            // Show floating error alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: 'Message over character limit. Form submission failed!',
            };
            errors.push(message);
        }

        if (errors.length > 0) {
            showAlert(errors);
        } else {
            await postSubmission();
        }
        setSubmitting(false);
    };
  
    // Submit API
    const postSubmission = async () => {
        const formEntries = {
            email: formState.email,
            name: capitalizeWords(formState.name),
            message: formState.message,
            date: formState.date,
        };

        const payload = {
            ...formEntries,
            'g-recaptcha-response': recaptchaToken,
        };
    
        try {
            await axios.post(formSparkUrl, payload);
            setFormState(initialFormState);
    
            // Confirmation Email
            const split = formState.name.split(' ');
            const confEm = await sendConfirmationEmail(formState, split);
            if (!confEm[0]) {
                console.error(confEm[1]);
                // Show floating error alert message
                const message = {
                    id: uuidv4(),
                    type: 'error',
                    message: `${confEm[1]}`,
                };
                showAlert(message);
            } else {
                // Show floating success alert message
                const message = {
                    id: uuidv4(),
                    type: 'success',
                    message: `Success! Confirmation email sent to: ${formState.email}`,
                };
                showAlert(message);
            }

            setFormState(initialFormState);
            recaptchaRef.current.reset();
        } catch (error) {
            console.error(error);

            // Show floating error alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: error,
            };
            showAlert(message);
        };
    };
  
    // Update form text field
    const updateFormControl = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        const key = id as keyof FormState;
        if (key === 'message') {
            if (value.length > charLimit) {
                setLimitReached(true);
                const message = {
                    id: uuidv4(),
                    type: 'warn',
                    message: `Character limit reached!`,
                };
                setMaxAlerts(maxAlerts + 1);
                if (maxAlerts < 1) {
                    showAlert(message);
                }
            } else {
                setLimitReached(false);
                setMaxAlerts(0)
            }
        }
        const updatedFormState = { ...formState };
        updatedFormState[key] = value;
        updatedFormState['date'] = getDate();
        setFormState(updatedFormState);
    };
  
    // Function to get and format current date & time
    const getDate = () => {
        return dayjs().format('MM/DD/YYYY hh:mm A');;
    };
    
    // Form title
    const title = <><FaPaperPlane /> Contact Me</> ;

    // Email adornment
    const emailAdornment = isSelected1
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <IoIosMail style={{fontSize: '110%'}} />
            </InputAdornment>
        )
    }
    : {};

    // Name adornment
    const nameAdornment = isSelected2
    ? {
        startAdornment: (
          <InputAdornment position="start">
            <BsPersonCircle />
          </InputAdornment>
        )
    }
    : {};
    
    // Company adornment
    const compAdornment = isSelected3
    ? {
        startAdornment: (
          <InputAdornment position="start">
            <FaBuilding />
          </InputAdornment>
        )
    }
    : {};

    return (
        <>
            <div id="form">
                <Box sx={{display: 'inline-block'}}>
                    <Card className="MuiCard-root form-card">
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
                        
                        {/* Form */}
                        <form onSubmit={submitForm}>
                            <CardContent> 
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
                                        sx={{width: fieldWidth}}
                                        InputProps={emailAdornment}
                                        onFocus={e => setIsSelected1(true)}
                                        onBlur={formState.email ? undefined : e => setIsSelected1(false)}
                                        onInput={e => setIsSelected1(true)}
                                        error={emailError}
                                    />
                                </div>

                                {/* Name */}
                                <div className="padded">
                                    <TextField 
                                        required
                                        error={nameError}
                                        id="name" 
                                        label="Name" 
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formState?.name} 
                                        sx={{width: fieldWidth}}
                                        InputProps={nameAdornment}
                                        onFocus={e => setIsSelected2(true)}
                                        onBlur={formState.name ? undefined : e => setIsSelected2(false)}
                                        onInput={e => setIsSelected2(true)}
                                    />
                                </div> 

                                {/* Company */}
                                <div className="padded">
                                    <TextField 
                                        id="company" 
                                        label="Company" 
                                        variant="outlined"
                                        onChange={updateFormControl}
                                        value={formState?.company} 
                                        sx={{width: fieldWidth}}
                                        InputProps={compAdornment}
                                        onFocus={e => setIsSelected3(true)}
                                        onBlur={formState.company ? undefined : e => setIsSelected3(false)}
                                        onInput={e => setIsSelected3(true)}
                                    />
                                </div> 

                                {/* Message */}
                                <div className="padded">
                                    <TextField 
                                        multiline
                                        required
                                        id="message" 
                                        label="Message" 
                                        type='text'
                                        variant="outlined"
                                        error={limitReached}
                                        helperText={
                                            <span className={limitReached ? 'form-error' : ''}>
                                                {`${formState.message.length} / ${charLimit} Characters`}
                                            </span>
                                        }
                                        onChange={updateFormControl}
                                        value={formState?.message.replace(/↵/g, '\n')} 
                                        rows={4}
                                        sx={{width: fieldWidth}}
                                    />
                                </div>

                                {/* ReCAPTCHA */}
                                <div className="padded" style={{width: fieldWidth}}>
                                    <ReCAPTCHA
                                        style={{
                                            transform: 'scale(0.77)', 
                                            WebkitTransform: 'scale(0.77)', 
                                            transformOrigin: '0 0', 
                                            WebkitTransformOrigin: '0 0'
                                        }}
                                        ref={recaptchaRef}
                                        sitekey={recaptchaKey}
                                        onChange={updateRecaptchaToken}
                                    />
                                </div>
                            </CardContent>

                            {/* Date/Time */}
                            <input type='hidden' id="date" value={formState?.date} />

                            <CardActions className="card-actions">
                                <button className="main-button" disabled={submitting} style={{marginTop: '-30px'}}>
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </CardActions>
                        </form>    
                    </Card>
                </Box>
            </div>
        </>
    );
};
