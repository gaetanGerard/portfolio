import React, {useState, useEffect} from 'react'
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
        skill_level: action === 'edit' ? technology.skill_level : '0',
    });
    const [categoryName, setCategoryName] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });

        technoCategories.map((category) => {
            if (category.id === formData.category_id) {
                setCategoryName(category.name);
            }
        });

    }, [technoCategories, formData.category_id]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setOpen(false);
        setMessage('');
        setSeverity('');
    };

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
            setCategoryName(value);
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

        if(formData.icon_path.length === 0) {
            setErrorInput({
                ...errorInput,
                icon_path: {
                    message: 'Vous devez ajouter une icône',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                icon_path: {
                    message: '',
                    status: false
                }
            })
        }

        if (action === 'edit') {
            formDataToSend.append('id', technology.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = action === 'edit' ? 'Technologie modifié avec succès.' : 'Technologie ajouté avec succès.';
                const open = true;
                const severity = 'success';
                localStorage.setItem('snackbarMessage', message);
                localStorage.setItem('snackbarState', open);
                localStorage.setItem('snackbarSeverity', severity);
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            const message = action === 'edit' ? 'Une erreur est survenu lorsque vous avez essayer de modifier une technologie. Veuillez réessayer.' : 'Une erreur est survenu lorsque vous avez essayer d\'ajouter une technologie. Veuillez réessayer.';
            setOpen(true);
            setMessage(message);
            setSeverity('error');
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter une technologie : ', error);
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'name') message = 'Le nom de la technologie est requis';
        if(e.target.name === 'technology_url') message = 'Le lien vers la documentation est requis';

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

    const handleCategoryBlur = () => {
        if(formData.category_id.length === 0) {
            setErrorInput({
                ...errorInput,
                category_id: {
                    message: 'Vous devez ajouter une catégorie',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                category_id: {
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
        <form onSubmit={handleSubmit}>
            <div>
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 bg-white overflow-hidden shadow-sm sm:rounded-lg grid-rows-3 p-3">
                    <div>
                        <TextField
                            type="text"
                            onBlur={handleBlur}
                            error={errorInput.name !== undefined ? errorInput.name.status : false}
                            helperText={errorInput.name !== undefined ? errorInput.name.message : ''}
                            className="w-full"
                            id="name"
                            label="Nom de la technologie"
                            onChange={handleInputChange}
                            variant="outlined"
                            name="name"
                            required
                            defaultValue={action === 'edit' ? technology.name : null}
                        />
                    </div>
                    <div>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={technoCategories.map((option) => option.name)}
                            onChange={handleCategoryChange}
                            value={categoryName}
                            isOptionEqualToValue={(option, value) => option === value}
                            className="w-full"
                            onBlur={handleCategoryBlur}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Catégories"
                                    variant="outlined"
                                    error={errorInput.category_id !== undefined ? errorInput.category_id.status : false}
                                    helperText={errorInput.category_id !== undefined ? errorInput.category_id.message : ''}
                                />)}
                        />
                    </div>
                    <div className="col-span-2">
                        <TextField
                            type="text"
                            onBlur={handleBlur}
                            error={errorInput.technology_url !== undefined ? errorInput.technology_url.status : false}
                            helperText={errorInput.technology_url !== undefined ? errorInput.technology_url.message : ''}
                            className="w-full"
                            id="technology_url"
                            label="Lien Documentation Technologie"
                            onChange={handleInputChange}
                            variant="outlined"
                            name="technology_url"
                            required
                            defaultValue={action === 'edit' ? technology.technology_url : null}
                        />
                    </div>
                    <div className="px-4 col-span-2 justify-items-center">
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
                </div>
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3  mt-3" >
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
                        className="self-center justify-self-center"
                        >
                        Ajouter une icône
                        <VisuallyHiddenInput type="file" />
                    </Button>
                    {errorInput.icon_path !== undefined ? (<p className="text-red-500">{errorInput.icon_path.message}</p>) : null}
                    {formData.icon_path.length > 0 ? (<img src={formData.icon_path} alt={`Image ${formData.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />) : null}
                </div>
            </div>
            <div className="grid grid-flow-col gap-3 justify-start">
                <Button variant="contained" style={{ backgroundColor: grey[500] }} className="mt-3" href="/admin/dashboard/technologies">Annuler</Button>
                <Button variant="contained" className="mt-3" type="submit">{action === "edit" ? "Modifier la technologie" : "Ajouter une technologie"}</Button>
            </div>
        </form>
    </div>
  )
}

export default TechnologiesForm