import React, {useState, useEffect} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CategoriesForm = () => {
    const { action, categories } = usePage().props;
    const [formData, setFormData] = React.useState({
        name: action==='edit' ? categories.name : '',
        description: action==='edit' ? categories.description : ''
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

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

        if (action === 'edit') {
            formDataToSend.append('id', categories.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = response.data.message;
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

  return (
    <div>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit} className="grid gap-1 bg-white overflow-hidden shadow-sm sm:rounded-lg grid-rows-3 p-3">
            <div>
                <TextField type="text" className="w-full" id="name" label="Nom de la Catégorie" onChange={handleInputChange} variant="outlined" name="name" required defaultValue={action === 'edit' ? categories.name : null} />
            </div>
            <div>
                <TextField
                id="description"
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
            <Button variant="contained" className="self-center justify-self-center" type="submit">{action === "edit" ? "Modifier la catégorie" : "Créer une catégorie"}</Button>
        </form>
    </div>
  )
}

export default CategoriesForm
