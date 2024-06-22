import React, {useState, useEffect, useMemo, Component} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormHelperText from '@mui/joy/FormHelperText';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import SwitchLanguage from '@/Components/SwitchLanguage';
import WysiwygEditor from '@/Components/WysiwygEditor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Switch from '@mui/material/Switch';

const ExperienceForm = () => {
    const {experience, action, previousUrl, localeData} = usePage().props;
    const [language, setLanguage] = useState(action === 'edit' ? experience.lang : 'fr');
    const [formData, setFormData] = useState({
        company_name: action === 'edit' ? experience.company_name : '',
        company_location: action === 'edit' ? experience.company_location : '',
        job_title: action === 'edit' ? experience.job_title : '',
        start_date: action === 'edit' ? dayjs(experience.start_date, 'DD/MM/YYYY').format('DD/MM/YYYY') : '',
        end_date: action === 'edit' ? dayjs(experience.end_date, 'DD/MM/YYYY').format('DD/MM/YYYY') : '',
        is_current: false,
        description: action === 'edit' ? experience.description : '',
        show: action === 'edit' ? experience.show : true
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});
    const todaysDate = {start: dayjs().format('DD/MM/YYYY')};
    const [starDateError, setStartDateError] = useState(null);
    const [endDateError, setEndDateError] = useState(null);
    const [editorState, setEditorState] = useState(() => {
        if (action === "edit" && experience.description) {
            const contentState = convertFromRaw(JSON.parse(experience.description));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });

        if(action === "edit") {
            setFormData({
                ...formData,
                is_current: experience.is_current
            })
        }

        if (action === "edit" && experience.description) {
            const contentState = convertFromRaw(JSON.parse(experience.description));
            const newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState);
        }

    }, [action, experience]);

    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setOpen(false);
        setMessage('');
        setSeverity('');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleCheckBoxchange = (e) => {
        if (e.target.checked === true) {
            setFormData({
                ...formData,
                end_date: '',
                is_current: e.target.checked
            });
        } else {
            setFormData({
                ...formData,
                is_current: e.target.checked
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/admin/dashboard/experiences/${action}`;
        const formDataToSend = new FormData();
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        formDataToSend.append('company_name', formData.company_name);
        formDataToSend.append('company_location', formData.company_location);
        formDataToSend.append('job_title', formData.job_title);
        formDataToSend.append('is_current', formData.is_current);
        formDataToSend.append('description', JSON.stringify(rawContentState));
        formDataToSend.append('lang', language);
        formDataToSend.append('show', formData.show ? 1 : 0);

        if(action ==='edit') {
            formDataToSend.append('start_date', dayjs(formData.start_date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
        } else {
            if(formData.start_date) {
                if (dayjs(formData.start_date, 'DD/MM/YYYY', true).isValid()) {
                    formDataToSend.append('start_date', dayjs(formData.start_date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
                } else {
                    console.error('Invalid start_date format:', formData.start_date);
                }
            }
        }

        if(action ==='edit') {
            formDataToSend.append('end_date', dayjs(formData.end_date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
        } else {
            if (!formData.is_current && formData.end_date) {
                if (dayjs(formData.end_date, 'DD/MM/YYYY', true).isValid()) {
                    formDataToSend.append('end_date', dayjs(formData.end_date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
                } else {
                    console.error('Invalid end_date format:', formData.end_date);
                }
            }
        }


        if (action === 'edit') {
            formDataToSend.append('id', experience.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = action === 'edit' ? 'Expérience modifié avec succès.' : 'Expérience ajouté avec succès.';
                const open = true;
                const severity = 'success';
                localStorage.setItem('snackbarMessage', message);
                localStorage.setItem('snackbarState', open);
                localStorage.setItem('snackbarSeverity', severity);
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            const message = action === 'edit' ? 'Une erreur est survenu lorsque vous avez essayer de modifier une expérience. Veuillez réessayer.' : 'Une erreur est survenu lorsque vous avez essayer d\'ajouter une expérience. Veuillez réessayer.';
            setOpen(true);
            setMessage(message);
            setSeverity('error');
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une experience : ', error);
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'company_name') message = 'Le nom de l\'entreprise est requis';
        if(e.target.name === 'company_location') message = 'Le lieu de travail est requise';
        if(e.target.name === 'job_title') message = 'Le titre du job est requise';

        if(e.target.value.length === 0) {
            setErrorInput({
                ...errorInput,
                [e.target.name]: {
                    message,
                    status: true
                }

            })
        } else {
            setErrorInput({
                ...errorInput,
                [e.target.name]: {
                    message: '',
                    status: false
                }
            })
        }
    }

    const handleBlurOnRichEditor = (e) => {
        if(e.target.textContent.length === 0) {
            setErrorInput({
                ...errorInput,
                description: {
                    message: 'Une description est requise',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                description: {
                    message: '',
                    status: false
                }
            })
        }
    }

    const handleStartDateError = useMemo(() => {
        switch (starDateError) {
            case 'cannotBeEmpty':
                return 'Vous devez renseigner une date de début';
            case 'cannotBeAfterEnd':
                return 'La date de début ne peut pas être après la date de fin';
            default:
                return null;
        }
    }, [starDateError])

    const handleEndDateError = useMemo(() => {
        switch (endDateError) {
            case 'cannotBeEmpty':
                return 'Vous devez renseigner une date de fin';
            case 'cannotBeBeforeStart':
                return 'La date de fin ne peut pas être avant la date de début';
            case 'cannotBeAfterToday':
                return 'La date de fin ne peut pas être après la date d\'aujourd\'hui';
            case 'cannotBeSetIfCurrent':
                return 'Vous ne pouvez pas renseigner une date de fin si le job est toujours en cours';
            default:
                return null;
        }
    }, [endDateError]);

    const handleEditorStateChange = (editorState) => {
        setEditorState(editorState);
    }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <div className="grid gap-3 grid-cols-3">
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.company_name !== undefined ? errorInput.company_name.status : false}
                    helperText={errorInput.company_name !== undefined ? errorInput.company_name.message : ''}
                    id="company_name"
                    label="Nom de l'entreprise'"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="company_name"
                    required
                    defaultValue={action === 'edit' ? experience.company_name : null}
                    className="w-full"
                />
            </div>
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.company_location !== undefined ? errorInput.company_location.status : false}
                    helperText={errorInput.company_location !== undefined ? errorInput.company_location.message : ''}
                    id="company_location"
                    label="Lieu de travail"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="company_location"
                    required
                    defaultValue={action === 'edit' ? experience.company_location : null}
                    className="w-full"
                />
            </div>
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.job_title !== undefined ? errorInput.job_title.status : false}
                    helperText={errorInput.job_title !== undefined ? errorInput.job_title.message : ''}
                    id="job_title"
                    label="Titre du job"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="job_title"
                    required
                    defaultValue={action === 'edit' ? experience.job_title : null}
                    className="w-full"
                />
            </div>
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date de début"
                        defaultValue={action === "edit" ? dayjs(experience.start_date, "DD/MM/YYYY") : null}
                        onChange={(date) => setFormData({...formData, start_date: dayjs(date).format('DD/MM/YYYY')})}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        onError={(newError) => setStartDateError(newError)}
                        className="w-full"
                        slotProps={{
                            textField: {
                                onBlur: () => {
                                    if (formData.start_date.length === 0) {
                                        setStartDateError('cannotBeEmpty');
                                    } else if(formData.start_date > formData.end_date) {
                                        setStartDateError('cannotBeAfterEnd');
                                    }else {
                                        setStartDateError(null);
                                    }
                                },
                                error: handleStartDateError !== null ? true : false,
                                helperText: handleStartDateError
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date de fin"
                        defaultValue={action === "edit" ? dayjs(experience.end_date, "DD/MM/YYYY") : null}
                        onChange={(date) => setFormData({...formData, end_date: dayjs(date).format('DD/MM/YYYY')})}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        onError={(newError) => setEndDateError(newError)}
                        className="w-full"
                        slotProps={{
                            textField: {
                                onBlur: () => {
                                    if (formData.end_date.length === 0 && formData.is_current === false) {
                                        setEndDateError('cannotBeEmpty');
                                    } else if(formData.end_date < formData.start_date) {
                                        setEndDateError('cannotBeBeforeStart');
                                    } else if(formData.end_date > todaysDate.start) {
                                        setEndDateError('cannotBeAfterToday');
                                    } else if(formData.is_current) {
                                        setEndDateError('cannotBeSetIfCurrent');
                                    } else {
                                        setEndDateError(null);
                                    }
                                },
                                error: handleEndDateError !== null ? true : false,
                                helperText: handleEndDateError
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>
            <div>
                <p>Choisir la langue pour l'expérience : </p>
                <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage} />
            </div>
            <div>
                <p>Montrer/Cacher l'expérience : </p>
                <Switch
                    checked={action === "edit" ? formData.show === 1 : formData.show}
                    onChange={e => setFormData({...formData, show: e.target.checked ? 1 : 0 })}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
            <div>
                <FormControlLabel
                value="start"
                checked={formData.is_current}
                control={<Checkbox onChange={handleCheckBoxchange} />}
                label="Tojours en cours :"
                labelPlacement="start"
                />
            </div>
            <div className="col-span-3">
                <FormControl>
                    <FormLabel>Description de l'expérience professionnelle</FormLabel>
                    <WysiwygEditor handleEditorStateChange={handleEditorStateChange} editorState={editorState} onBlur={handleBlurOnRichEditor} />
                    <FormHelperText style={{color: '#C41C1C'}}>{errorInput.description !== undefined ? errorInput.description.message : ''}</FormHelperText>
                </FormControl>
            </div>
            <div className="grid grid-flow-col gap-3 justify-start">
                <Button variant="contained" className="self-end justify-self-center" style={{ backgroundColor: grey[500] }} href="/admin/dashboard/experiences">Annuler</Button>
                <Button variant="contained" className="self-end justify-self-center" type="submit">{action === "edit" ? "Modifier l'expérience" : "Ajouter une expérience"}</Button>
            </div>
        </div>
    </form>
  )
}

export default ExperienceForm


// At Data essential I had several missions, mainly focused on application development but also on deployment,
// infrastructure maintenance, I was also able to participate in several projects using the DevOps methodology and its technologies.

// I worked for clients such as Foyer Assurance ,  la commission européenne , Grant Thornton , Victor Buck Services , EY , Crédit Suisse , SIGI , ...
// Main Missions:
// Customer interventions and follow-up for various requests.
// Deployment, maintenance, decommissioning of VxRail/vmware cluster.
// Automation of tasks and creation of various PoCs.
// Application development.
// Compass application development project:
// React front-end development.
// Customer follow-up and implementation of requests.
// Automating development and deployment using GCP.
// Script Development:
// Python Script Development.
// Automate Kubernetes manifest creation.
// Established a standard format for users.
// Application Modernisation:
// Convert a Python application to a React Application.
// Implementation of new features upon customer request.
// Transformation of the application into a cross-platform desktop app using electronJS.