import React, {useState, useEffect} from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CategoriesForm = () => {
    const { action, categories } = usePage().props;
    const [formData, setFormData] = React.useState({
        name: action==='edit' ? categories.name : '',
        description: action==='edit' ? categories.description : ''
    });

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });
    }, []);

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
            window.location.href = '/admin/dashboard';
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une catégorie : ', error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="name" label="Nom de la Catégorie" onChange={handleInputChange} variant="filled" name="name" required defaultValue={action === 'edit' ? categories.name : null} />
        </div>
        <div>
            <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={action === 'edit' ? categories.description : "Description de la catégorie"}
            variant="filled"
            name="description"
            onChange={handleInputChange}
            required
            />
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier la catégorie" : "Créer une catégorie"}</Button>
    </form>
  )
}

export default CategoriesForm
