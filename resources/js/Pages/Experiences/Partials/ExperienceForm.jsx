import React, {useState, useEffect, useMemo} from 'react';
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

const ExperienceForm = () => {
    const {experience, action, previousUrl} = usePage().props;
    const [formData, setFormData] = useState({
        company_name: action === 'edit' ? experience.company_name : '',
        company_location: action === 'edit' ? experience.company_location : '',
        job_title: action === 'edit' ? experience.job_title : '',
        start_date: action === 'edit' ? experience.start_date : '',
        end_date: action === 'edit' ? experience.end_date : '',
        is_current: false,
        description: action === 'edit' ? experience.description : '',
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});
    const todaysDate = {start: dayjs().format('DD/MM/YYYY')};
    const [starDateError, setStartDateError] = useState(null);
    const [endDateError, setEndDateError] = useState(null);

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

    }, [action, experience]);

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
        formDataToSend.append('company_name', formData.company_name);
        formDataToSend.append('company_location', formData.company_location);
        formDataToSend.append('job_title', formData.job_title);
        formDataToSend.append('start_date', dayjs(formData.start_date).format('DD/MM/YYYY'));
        formDataToSend.append('end_date', formData.is_current ? '' : dayjs(formData.end_date).format('DD/MM/YYYY'));
        formDataToSend.append('is_current', formData.is_current);
        formDataToSend.append('description', formData.description);

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
        if(e.target.name === 'description') message = 'Une description est requise';

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
                    <Textarea
                    id="description"
                    onBlur={handleBlur}
                    error={errorInput.description !== undefined ? errorInput.description.status : false}
                    label="Description"
                    defaultValue={action === 'edit' ? experience.description : ""}
                    variant="outlined"
                    name="description"
                    placeholder="Description de l'expérience professionnelle"
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    minRows={4}
                    />
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