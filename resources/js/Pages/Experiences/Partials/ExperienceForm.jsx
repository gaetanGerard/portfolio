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

const ExperienceForm = () => {
    const {experience, action} = usePage().props;
    const [formData, setFormData] = useState({
        company_name: action === 'edit' ? experience.company_name : '',
        company_location: action === 'edit' ? experience.company_location : '',
        job_title: action === 'edit' ? experience.job_title : '',
        start_date: action === 'edit' ? experience.start_date : '',
        end_date: action === 'edit' ? experience.end_date : '',
        is_current: false,
        description: action === 'edit' ? experience.description : '',
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

    }, [action, experience]);

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
        formDataToSend.append('start_date', formData.start_date);
        formDataToSend.append('end_date', formData.end_date);
        formDataToSend.append('is_current', formData.is_current);
        formDataToSend.append('description', formData.description);

        if (action === 'edit') {
            formDataToSend.append('id', experience.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            window.location.href = '/admin/dashboard/experiences';
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une experience : ', error);
        }
    }


  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="company_name" label="Nom de l'entreprise'" onChange={handleInputChange} variant="filled" name="company_name" required defaultValue={action === 'edit' ? experience.company_name : null} />
        </div>
        <div>
            <TextField type="text" id="company_location" label="Lieu de travail" onChange={handleInputChange} variant="filled" name="company_location" required defaultValue={action === 'edit' ? experience.company_location : null} />
        </div>
        <div>
            <TextField type="text" id="job_title" label="Titre du job" onChange={handleInputChange} variant="filled" name="job_title" required defaultValue={action === 'edit' ? experience.job_title : null} />
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date de début"
                    defaultValue={action === "edit" ? dayjs(experience.start_date, "DD/MM/YYYY") : dayjs()}
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
                    onChange={(date) => setFormData({...formData, end_date: dayjs(date).format('DD/MM/YYYY')})}
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
            defaultValue={action === 'edit' ? experience.description : "Description du parcours professionnel"}
            variant="filled"
            name="description"
            onChange={handleInputChange}
            required
            />
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier l'expérience'" : "Ajouter une expérience"}</Button>
    </form>
  )
}

export default ExperienceForm