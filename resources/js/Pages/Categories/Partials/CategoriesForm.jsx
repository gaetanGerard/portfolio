import React, {useState, useEffect} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SwitchLanguage from '@/Components/SwitchLanguage';

const CategoriesForm = () => {
    const { action, categories, localeData } = usePage().props;
    const [language, setLanguage] = useState(action === 'edit' ? categories.lang : 'fr');
    const [formData, setFormData] = React.useState({
        name: action==='edit' ? categories.name : '',
        description: action==='edit' ? categories.description : ''
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});

    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        })
    }


    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/admin/dashboard/categories/${action}`;
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('lang', language);

        if (action === 'edit') {
            formDataToSend.append('id', categories.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = action === 'edit' ? 'Catégorie modifié avec succès.' : 'Catégorie ajouté avec succès.';
                const open = true;
                const severity = 'success';
                localStorage.setItem('snackbarMessage', message);
                localStorage.setItem('snackbarState', open);
                localStorage.setItem('snackbarSeverity', severity);
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            const message = action === 'edit' ? 'Une erreur est survenu lorsque vous avez essayer de modifier une catégorie. Veuillez réessayer.' : 'Une erreur est survenu lorsque vous avez essayer d\'ajouter une catégorie. Veuillez réessayer.';
            setOpen(true);
            setMessage(message);
            setSeverity('error');
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une catégorie : ', error);
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'name') message = 'Le nom de la catégorie est requis';
        if(e.target.name === 'description') message = 'Une description de la catégorie est requise';

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

  return (
    <div>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit} className="grid gap-1 bg-white overflow-hidden shadow-sm sm:rounded-lg grid-rows-3 p-3">
            <div>
                <TextField
                    type="text"
                    onBlur={handleBlur}
                    error={errorInput.name !== undefined ? errorInput.name.status : false}
                    helperText={errorInput.name !== undefined ? errorInput.name.message : ''}
                    className="w-full"
                    id="name"
                    label="Nom de la Catégorie"
                    onChange={handleInputChange}
                    variant="outlined"
                    name="name"
                    required
                    defaultValue={action === 'edit' ? categories.name : null}
                />
            </div>
            <div>
                <p>Choisir la langue de la catégorie : </p>
                <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage} />
            </div>
            <div>
                <TextField
                id="description"
                onBlur={handleBlur}
                error={errorInput.description !== undefined ? errorInput.description.status : false}
                helperText={errorInput.description !== undefined ? errorInput.description.message : ''}
                label="Description"
                multiline
                rows={4}
                defaultValue={action === 'edit' ? categories.description : "Description de la catégorie"}
                variant="outlined"
                name="description"
                className="w-full"
                onChange={handleInputChange}
                required
                />
            </div>
            <div className="grid grid-flow-col gap-3 justify-start">
                <Button variant="contained" className="self-center justify-self-center" style={{ backgroundColor: grey[500] }} href="/admin/dashboard/categories">Annuler</Button>
                <Button variant="contained" className="self-center justify-self-center" type="submit">{action === "edit" ? "Modifier la catégorie" : "Créer une catégorie"}</Button>
            </div>
        </form>
    </div>
  )
}

export default CategoriesForm
