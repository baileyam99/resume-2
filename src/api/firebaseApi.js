import { doc, getDoc, setDoc, collection, getDocs, query, } from 'firebase/firestore';
import { 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut,
} from 'firebase/auth';
import StartFire, { GetAuth, Storage } from './FirebaseConfig';
import { capitalizeFirstLetter } from '../components/Utils/stringUtils';
import { timer } from '../components/Utils/Timer'
import { ref, listAll, getDownloadURL } from 'firebase/storage';
// import dayjs from 'dayjs';

const db = StartFire();
let auth = GetAuth();
const storage = Storage();

// API for log in
export const sendLogIn = async (email, password) => {
    let returnPayload = [true, null];
    auth = GetAuth();
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch(error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API for log out
export const sendLogOut = async () => {
    let returnPayload = [true, null];
    auth = GetAuth();
    try {
        await signOut(auth);
    } catch(error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to send password reset email
export const sendPasswordReset = (email) => {
    let returnPayload = [true, null];
    auth = GetAuth();
    try {
        sendPasswordResetEmail(auth, email)
            .then(() => console.log(`Email Verification sent successfully to: ${email}`));
    } catch(error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get personal info
export const getPersonalInfo = async () => {
    let returnPayload = [true, null];
    try {
        const docRef = doc(db, 'person-info', 'b0a521f6-e1c8-4eb1-88ca-e7c4ba94f345');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            returnPayload = [true, docSnap.data()];
        }
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get all job experiences
export const getAllJobs = async () => {
    let returnPayload = [true, null];
    const jobsList = [];
    try {
        const collectionRef = collection(db, 'jobs');
        const q = query(collectionRef);
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            const data = doc.data();
            data.uuid = doc.id;
            jobsList.push(data);
        });
        returnPayload = [true, jobsList];
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get job experiences by uuid
export const getJobByUuid = async (uuid) => {
    let returnPayload = [true, null];
    try {
        const docRef = doc(db, 'jobs', uuid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            returnPayload = [true, docSnap.data()];
        }
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get all education
export const getAllEd = async () => {
    let returnPayload = [true, null];
    const edList = [];
    try {
        const collectionRef = collection(db, 'education');
        const q = query(collectionRef);
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            const data = doc.data();
            data.uuid = doc.id;
            edList.push(data);
        });
        returnPayload = [true, edList];
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get education by uuid
export const getEducationByUuid = async (uuid) => {
    let returnPayload = [true, null];
    try {
        const docRef = doc(db, 'education', uuid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            returnPayload = [true, docSnap.data()];
        }
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get user's first name
export const getFirstName = async (email) => {
    let returnPayload = [true, null];
    try {
        const docRef = doc(db, 'user', email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            returnPayload = [true, docSnap.data().FirstName];
        }
    } catch (error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to send email confirmation
export const sendConfirmationEmail = async (formState, split) => {
    let returnPayload = [true, null];
    const confirmationPayload = {
        to: [formState.email],
        message: {
            subject: 'ALEX BAILEY CONTACT CONFIRMATION',
            text: `
                Hello, ${capitalizeFirstLetter(split[0])}!
            
                Thank you so much for contacting me! This email is to confirm your submission to my contact form system. Your message is very important to me! If you do not hear from me within 5 business days, please reach out directly to our me at bailey.alex1999@gmail.com or reply to this email.

                Here is a copy of your message:
                Message: ${formState.message}
                Submission Date: ${formState.date}
                Submission UUID: ${formState.SubmissionUuid}

                I am looking forward to answering your message!
                
                Sincerly,
                Alex Bailey
            `,
            html: `
                <section>
                    <div><p>Hello, ${capitalizeFirstLetter(split[0])}!</p></div>
                    <div>
                        <p>
                            Thank you so much for contacting me! This email is to confirm your submission to my contact form system. Your message is very important to me! If you do not hear from me within 5 business days, please reach out directly to our me at bailey.alex1999@gmail.com or reply to this email.
                            <br><br>
                            Here is a copy of your message:
                            <br>
                            Message: ${formState.message}
                            <br>
                            Submission Date: ${formState.date}
                            <br>
                            Submission UUID: ${formState.SubmissionUuid}
                            <br><br>
                            I am looking forward to answering your message!
                            <br><br>
                            Sincerly,
                            <br>
                            Alex Bailey
                        </p>
                    </div>
                </section>
            `,
        }
    }
    const mailRef = doc(db, 'mail', formState.SubmissionUuid);
    try {
        await setDoc(mailRef, confirmationPayload).then(() => {
            console.log('Confirmation email queued.');
        });
    } catch(error) {
        console.error(error);
        returnPayload = [false, error];
    } finally {
        return returnPayload;
    }
};

// API to get images by job uuid
export const getJobImagesUuid = async (uuid) => {
    let returnPayload = [true, null];
    try {
        const albumRef = ref(storage, `job-detail-images/${uuid}/`);
        const result = await listAll(albumRef);
        const imageUrls = [];
        await Promise.all(
          result.items.map(async (imageRef) => {
            if (!imageRef.fullPath.includes('.keep')) {
                const url = await getDownloadURL(imageRef);
                imageUrls.push(url);
            }
          })
        );
        await timer(2000);
        returnPayload = [true, imageUrls];
    } catch (error) {
        returnPayload = [false, error.toString()];
    }
    return returnPayload;
};

// API to get images by education uuid
export const getEducationImagesUuid = async (uuid) => {
    let returnPayload = [true, null];
    try {
        const albumRef = ref(storage, `education-detail-images/${uuid}/`);
        const result = await listAll(albumRef);
        const imageUrls = [];
        await Promise.all(
          result.items.map(async (imageRef) => {
            if (!imageRef.fullPath.includes('.keep')) {
                const url = await getDownloadURL(imageRef);
                imageUrls.push(url);
            }
          })
        );
        await timer(2000);
        returnPayload = [true, imageUrls];
    } catch (error) {
        returnPayload = [false, error.toString()];
    }
    return returnPayload;
};

// API to get Hardware images
export const getHardwareImages = async (path) => {
    let returnPayload = [true, null];
    try {
        const albumRef = ref(storage, `hardware-images/${path}`);
        const result = await listAll(albumRef);
        const imageUrls = [];
        await Promise.all(
          result.items.map(async (imageRef) => {
            if (!imageRef.fullPath.includes('.keep')) {
                const url = await getDownloadURL(imageRef);
                imageUrls.push(url);
            }
          })
        );
        await timer(2000);
        returnPayload = [true, imageUrls];
    } catch (error) {
        returnPayload = [false, error.toString()];
    }
    return returnPayload;
};
