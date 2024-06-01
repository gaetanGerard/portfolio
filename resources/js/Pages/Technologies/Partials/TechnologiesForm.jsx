import React, {useState, useEffect} from 'react'
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const TechnologiesForm = () => {
    const {technologies, technoCategories, action} = usePage().props;
    const [formData, setFormData] = useState({
        name: action === 'edit' ? technologies.name : '',
        category_id: action === 'edit' ? technologies.category_id : '',
        icon_path: action === 'edit' ? technologies.icon_path : '',
        technology_url: action === 'edit' ? technologies.technology_url : '',
        skill_level: action === 'edit' ? technologies.skill_level : '',
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

    const handleCategoryChange = (e, value) => {
        if(value !== null) {
            const categoryId = technoCategories.filter(category => category.name === value);
            setFormData({
                ...formData,
                category_id: value !== null ? categoryId[0].id : ''
            });
        }
        else {
            setFormData({
                ...formData,
                category_id: ''
            });
        }
    }

    const handleIconChange = async (e) => {
        const formDataToSend = new FormData();
        formDataToSend.append('icon', e.target.files[0]);

        let uploadedIcon = '';

        try {
            const response = await axios.post(`/admin/dashboard/technologies/${action}/upload-icon`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            setFormData({
                ...formData,
                icon_path: response.data.icon_path
            });
        } catch (error) {
            console.error('Error uploading image: ', error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData)
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="name" label="Nom de la technologie" onChange={handleInputChange} variant="filled" name="name" required defaultValue={action === 'edit' ? technologies.name : null} />
        </div>
        <div>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={technoCategories.map((option) => option.name)}
                onChange={handleCategoryChange}
                defaultValue={action === 'edit' && technologies ? technoCategories[technologies.category_id] : null}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Catégories" variant="filled" />}
            />
        </div>
        <div>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                id="icon_path"
                name="icon_path"
                onChange={handleIconChange}
                required
                >
                Ajouter une icône
                <VisuallyHiddenInput type="file" />
            </Button>
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier la technologie" : "Ajouter une technologie"}</Button>
    </form>
  )
}

export default TechnologiesForm