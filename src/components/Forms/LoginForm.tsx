import React, { 
    ChangeEvent, 
    FormEvent, 
    useEffect,
    useState 
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
    Box, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import { BiShow, BiHide, BiLogIn } from 'react-icons/bi';
import { IoIosMail } from 'react-icons/io';
import { FaKey } from 'react-icons/fa';
import { getFirstName, sendLogIn, sendPasswordReset } from '../../api/firebaseApi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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

export function LoginForm(props: { alert: Function; }) {

    // Initialize form state
    const initialFormState = {
        email: '',
        password: '',
        resetEmail: '',
    };

    // Form types
    type FormState = {
        email: string;
        password: string;
        resetEmail: string;
    };

    // Get the component props and initialize useStates
    const { alert } = props;
    const [screenSize, setScreenSize] = useState(screens);
    const [fieldWidth, setFieldWidth] = useState<number>(400);
    const [fieldWidthReset, setFieldWidthReset] = useState<number>(400);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isSelected1, setIsSelected1] = useState<boolean>(false);
    const [isSelected2, setIsSelected2] = useState<boolean>(false);
    const [isSelected3, setIsSelected3] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const history = useNavigate();
    const location = useLocation();

    // Function to show a message from form
    const showAlert = (alertPayload: object) => {
        alert(alertPayload);
    };

    // Reset Password email field show
    const openEmailReset = () => setShowEmailForm(!showEmailForm);

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
            setFieldWidthReset(200);
        } else if (screenSize.tabletPort) {
            setFieldWidth(350);
            setFieldWidthReset(250);
        } else if (screenSize.tabletLand) {
            setFieldWidth(400);
            setFieldWidthReset(300);
        } else if (screenSize.large) {
            setFieldWidth(500);
            setFieldWidthReset(400);
        } else if (screenSize.xlarge) {
            setFieldWidth(500);
            setFieldWidthReset(400);
        } else {
            setFieldWidth(400);
            setFieldWidthReset(300);
        }
    }, [screenSize]);
  
    // Function to submit form
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        const logIn:Array<boolean | string | null> = await sendLogIn(formState.email, formState.password);
        if (!logIn[0]) {
            let error = logIn[1];
            console.error('Log in failed!', error);
            if (error !== null && error.toString() === 'FirebaseError: Firebase: Error (auth/invalid-credential).') {
                error = 'Incorrect Username/Password.';
            }
            // Show floating error alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: `${error}`,
            };
            showAlert(message); 
        } else {
            // Show floating success alert message
            let message = {
                id: uuidv4(),
                type: 'success',
                message: 'Log in successful! Welcome back!',
            };

            const name = await getFirstName(formState.email);
            if (name[0]) {
                message = {
                    id: uuidv4(),
                    type: 'success',
                    message: `Welcome back, ${name[1]}!`,
                };
            }
            showAlert(message); 

            // Check if there is a redirect parameter in the URL
            const redirectUrl = new URLSearchParams(location.search).get('redirect');
            if (redirectUrl) {
                // Use the history object to navigate to the intended URL
                history(`/${redirectUrl}`);
            } else {
                history('/dashboard');
            }
        }
        setSubmitting(false);
    };
  
    // Update form text field
    const updateFormControl = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        const key = id as keyof FormState;
        const updatedFormState = { ...formState };
        updatedFormState[key] = value;
        setFormState(updatedFormState);
    };

    // Show password click handler
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    // Send verification email function
    const SendEmail = (event: FormEvent) => {
        event.preventDefault();
        setSending(true);
        const res = sendPasswordReset(formState.resetEmail);
        if (res[0]) {
            // Show floating success and info alert message
            const message = [
                {
                    id: uuidv4(),
                    type: 'success',
                    message: `Password reset email sent to: ${formState.resetEmail}`,
                }, 
                {
                    id: uuidv4(),
                    type: 'info',
                    message: 'If you do not see the email, please check your spam folder.',
                }
            ];
            showAlert(message);
        } else {
            // Show floating success alert message
            const message = {
                id: uuidv4(),
                type: 'error',
                message: `${res[1]}`,
            };
            showAlert(message); 
        }
        setSending(false);
    };
    
    // Form title
    const title = <><BiLogIn /> Log In</> ;

    // Email adornment
    const emailAdornment = isSelected1
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <IoIosMail style={{fontSize: '110%'}} />
            </InputAdornment>
        )
    } : {};

    // Password Adornments
    const passAdornment = isSelected2
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
        }
    ;

    // Reset Email Adornment
    const resetEmailAdornment = isSelected3
    ? {
        startAdornment: (
            <InputAdornment position="start">
                <IoIosMail style={{fontSize: "110%"}}/>
            </InputAdornment>
        )
    } : {};

    return (
        <>
            <div id="form">
                <Box sx={{display: 'inline-block'}}>
                    <Card className="MuiCard-root form-card">
                        <CardHeader title={title} />
                        
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
                                        slotProps={{
                                            input: emailAdornment, 
                                            inputLabel: {className: 'hidden-asterisk'},
                                        }}
                                        onFocus={e => setIsSelected1(true)}
                                        onBlur={formState.email ? undefined : e => setIsSelected1(false)}
                                        onInput={e => setIsSelected1(true)}
                                    />
                                </div>

                                {/* Password */}
                                <div className="padded">
                                    <TextField 
                                        required
                                        id="password" 
                                        label="Password" 
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"}
                                        onChange={updateFormControl}
                                        value={formState?.password} 
                                        sx={{width: fieldWidth}}
                                        slotProps={{
                                            input: passAdornment, 
                                            inputLabel: {className: 'hidden-asterisk'},
                                        }}
                                        onFocus={e => setIsSelected2(true)}
                                        onBlur={formState.password ? undefined : e => setIsSelected2(false)}
                                        onInput={e => setIsSelected2(true)}
                                    />
                                </div>
                            </CardContent>

                            {/* Reset Password / Create account */}
                            <div className="padded">
                                <CardActions className="login-extra-actions">
                                    <Link to="#" onClick={openEmailReset}>Forgot Password?</Link>
                                    <Link to="/create-account">Create an account</Link>
                                </CardActions>
                            </div>

                            {/* Submit Actions */}
                            <CardActions className="card-actions">
                                <button className="main-button" disabled={submitting} style={{marginTop: '-30px'}}>
                                    {submitting ? 'Logging In...' : 'Log In'}
                                </button>
                            </CardActions>

                            {showEmailForm && (
                                <div className="padded reset">
                                    <h3><FaKey /> Reset Password</h3>
                                    <div className="reset-div">
                                        <TextField 
                                            required
                                            id="resetEmail" 
                                            label=""
                                            variant="outlined"
                                            type="email"
                                            helperText="Enter the email associated with your account. If it exists, a reset email will be sent."
                                            onChange={updateFormControl}
                                            value={formState?.resetEmail} 
                                            sx={{width: fieldWidthReset}}
                                            slotProps={{input: resetEmailAdornment}}
                                            onFocus={e => setIsSelected3(true)}
                                            onBlur={formState.resetEmail ? undefined : e => setIsSelected3(false)}
                                            onInput={e => setIsSelected3(true)}
                                        />
                                        {!screens.small && (
                                            <button className="main-button reset" onClick={SendEmail}>
                                                {sending ? "Sending" : "Send"}
                                            </button>
                                        )}
                                    </div>
                                    {screens.small && (
                                        <button className="main-button reset" onClick={SendEmail}>
                                            {sending ? "Sending" : "Send"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </form>    
                    </Card>
                </Box>
            </div>
        </>
    );
};
