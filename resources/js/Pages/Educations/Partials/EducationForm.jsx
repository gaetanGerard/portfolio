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

const EducationForm = () => {
    const {education, action} = usePage().props;
    const [formData, setFormData] = useState({
        school_name: action === 'edit' ? education.school_name : '',
        degree: action === 'edit' ? education.degree : '',
        place_of_study: action === 'edit' ? education.place_of_study : '',
        start_date: action === 'edit' ? education.start_date : '',
        end_date: action === 'edit' ? education.end_date : '',
        is_current: false,
        description: action === 'edit' ? education.description : '',
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
                is_current: education.is_current
            })
        }

    }, [action, education]);

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
        const url = `/admin/dashboard/educations/${action}`;
        const formDataToSend = new FormData();
        formDataToSend.append('school_name', formData.school_name);
        formDataToSend.append('degree', formData.degree);
        formDataToSend.append('place_of_study', formData.place_of_study);
        formDataToSend.append('start_date', dayjs(formData.start_date).format('DD/MM/YYYY'));
        formDataToSend.append('end_date', formData.is_current ? '' : dayjs(formData.end_date).format('DD/MM/YYYY'));
        formDataToSend.append('is_current', formData.is_current);
        formDataToSend.append('description', formData.description);

        if (action === 'edit') {
            formDataToSend.append('id', education.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = action === 'edit' ? 'Education modifié avec succès.' : 'Education ajouté avec succès.';
                const open = true;
                const severity = 'success';
                localStorage.setItem('snackbarMessage', message);
                localStorage.setItem('snackbarState', open);
                localStorage.setItem('snackbarSeverity', severity);
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            const message = action === 'edit' ? 'Une erreur est survenu lorsque vous avez essayer de modifier une éducation. Veuillez réessayer.' : 'Une erreur est survenu lorsque vous avez essayer d\'ajouter une éducation. Veuillez réessayer.';
            setOpen(true);
            setMessage(message);
            setSeverity('error');
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une éducation : ', error);
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'school_name') message = 'Le nom de l\'école est requis';
        if(e.target.name === 'degree') message = 'Le nom du diplôme est requis';
        if(e.target.name === 'place_of_study') message = 'Le lieu de l\'éducation est requis';
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
                return 'Vous ne pouvez pas renseigner une date de fin vous suivez toujours ce cours';
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
                    error={errorInput.school_name !== undefined ? errorInput.school_name.status : false}
                    helperText={errorInput.school_name !== undefined ? errorInput.school_name.message : ''}
                    id="school_name"
                    label="Nom de l'école"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="school_name"
                    required
                    className="w-full"
                    defaultValue={action === 'edit' ? education.school_name : null}
                />
            </div>
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.degree !== undefined ? errorInput.degree.status : false}
                    helperText={errorInput.degree !== undefined ? errorInput.degree.message : ''}
                    id="degree"
                    label="Diplôme"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="degree"
                    required
                    className="w-full"
                    defaultValue={action === 'edit' ? education.degree : null}
                />
            </div>
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.place_of_study !== undefined ? errorInput.place_of_study.status : false}
                    helperText={errorInput.place_of_study !== undefined ? errorInput.place_of_study.message : ''}
                    id="place_of_study"
                    label="Lieux des études"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="place_of_study"
                    required
                    className="w-full"
                    defaultValue={action === 'edit' ? education.place_of_study : null}
                />
            </div>
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date de début"
                        defaultValue={action === "edit" ? dayjs(education.start_date, "DD/MM/YYYY") : dayjs()}
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
                        defaultValue={dayjs(formData.end_date, "DD/MM/YYYY")}
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
                    <FormLabel>Description de l'éducation</FormLabel>
                    <Textarea
                    id="description"
                    onBlur={handleBlur}
                    error={errorInput.description !== undefined ? errorInput.description.status : false}
                    label="Description"
                    minRows={4}
                    defaultValue={action === 'edit' ? education.description : ""}
                    variant="outlined"
                    name="description"
                    onChange={handleInputChange}
                    placeholder="Description de l'éducation"
                    required
                    />
                    <FormHelperText style={{color: '#C41C1C'}}>{errorInput.description !== undefined ? errorInput.description.message : ''}</FormHelperText>
                </FormControl>
            </div>
        </div>
        <div className="grid grid-flow-col gap-3 justify-start">
            <Button variant="contained" className="self-end justify-self-center" style={{ backgroundColor: grey[500] }} href="/admin/dashboard/educations">Annuler</Button>
            <Button variant="contained" type="submit">{action === "edit" ? "Modifier l'éducation" : "Ajouter une éducation"}</Button>
        </div>
    </form>
  )
}

export default EducationForm