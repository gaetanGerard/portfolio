import React, {useState, useEffect} from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
        formDataToSend.append('start_date', formData.start_date);
        formDataToSend.append('end_date', formData.end_date);
        formDataToSend.append('is_current', formData.is_current);
        formDataToSend.append('description', formData.description);

        console.log(formData.is_current)

        if (action === 'edit') {
            formDataToSend.append('id', education.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            window.location.href = '/admin/dashboard/educations';
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une éducation : ', error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="school_name" label="Nom de l'école" onChange={handleInputChange} variant="filled" name="school_name" required defaultValue={action === 'edit' ? education.school_name : null} />
        </div>
        <div>
            <TextField type="text" id="degree" label="Diplôme" onChange={handleInputChange} variant="filled" name="degree" required defaultValue={action === 'edit' ? education.degree : null} />
        </div>
        <div>
            <TextField type="text" id="place_of_study" label="Lieux des études" onChange={handleInputChange} variant="filled" name="place_of_study" required defaultValue={action === 'edit' ? education.place_of_study : null} />
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date de début"
                    defaultValue={action === "edit" ? dayjs(education.start_date, "DD/MM/YYYY") : dayjs()}
                    onChange={(date) => setFormData({...formData, start_date: dayjs(date).format('DD/MM/YYYY')})}
                    renderInput={(params) => <TextField {...params} />}
                    format="DD/MM/YYYY"
                />
            </LocalizationProvider>
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date de fin"
                    defaultValue={dayjs(formData.end_date, "DD/MM/YYYY")}
                    onChange={(date) => setFormData({...formData, end_date: dayjs(date)})}
                    renderInput={(params) => <TextField {...params} />}
                    format="DD/MM/YYYY"
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
        <div>
            <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={action === 'edit' ? education.description : "Description du parcours scolaire"}
            variant="filled"
            name="description"
            onChange={handleInputChange}
            required
            />
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier l'éducation'" : "Ajouter une éducation"}</Button>
    </form>
  )
}

export default EducationForm