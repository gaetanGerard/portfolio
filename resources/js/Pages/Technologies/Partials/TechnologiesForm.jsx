import React, {useState, useEffect} from 'react'
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

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
    const {technology, technoCategories, action} = usePage().props;
    const [formData, setFormData] = useState({
        name: action === 'edit' ? technology.name : '',
        category_id: action === 'edit' ? technology.category_id : '',
        icon_path: action === 'edit' ? technology.icon_path : '',
        technology_url: action === 'edit' ? technology.technology_url : '',
        skill_level: action === 'edit' ? technology.skill_level : '',
    });
    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });
    }, []);

    const sliderStep = [
        {
            value: 0,
            label: 'Débutant',
        },
        {
            value: 25,
            label: 'Intermédiaire',
        },
        {
            value: 50,
            label: 'Avancé',
        },
        {
            value: 75,
            label: 'Expert',
        },
        {
            value: 100,
            label: 'Maître',
        }
    ];

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

    const handleSliderChange = (e, value) => {
        setFormData({
            ...formData,
            skill_level: value
        });
    }

    const handleIconChange = async (e) => {
        const formDataToSend = new FormData();
        formDataToSend.append('icon', e.target.files[0]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/admin/dashboard/technologies/${action}`;
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('icon_path', formData.icon_path);
        formDataToSend.append('technology_url', formData.technology_url);
        formDataToSend.append('skill_level', formData.skill_level.toString());

        if (action === 'edit') {
            formDataToSend.append('id', technology.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une technologie : ', error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="name" label="Nom de la technologie" onChange={handleInputChange} variant="filled" name="name" required defaultValue={action === 'edit' ? technology.name : null} />
        </div>
        <div>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={technoCategories.map((option) => option.name)}
                onChange={handleCategoryChange}
                defaultValue={action === 'edit' && technology ? technoCategories[technology.category_id].name : null}
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
            {formData.icon_path.length > 0 ? (<img src={formData.icon_path} alt={`Image ${formData.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />) : null}
        </div>
        <div>
            <TextField type="text" id="technology_url" label="Lien Documentation Technologie" onChange={handleInputChange} variant="filled" name="technology_url" required defaultValue={action === 'edit' ? technology.technology_url : null} />
        </div>
        <div>
            <Slider
                aria-label="Maitrise de la technologie"
                defaultValue={action === "edit" ? Number(technology.skill_level) : 0}
                getAriaValueText={sliderStep.value}
                step={25}
                valueLabelDisplay="auto"
                marks={sliderStep}
                onChange={handleSliderChange}
            />
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier la technologie" : "Ajouter une technologie"}</Button>
    </form>
  )
}

export default TechnologiesForm