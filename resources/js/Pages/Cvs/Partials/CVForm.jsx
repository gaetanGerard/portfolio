import React, {useState, useEffect, useRef} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SwitchLanguage from '@/Components/SwitchLanguage';
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

const CVForm = () => {
    const {cv, action} = usePage().props;
    const [language, setLanguage] = useState(action === 'edit' ? cv.lang : 'fr');
    const [formData, setFormData] = useState({
        name: action==='edit' ? cv.name : '',
        cv: action==='edit' ? cv.cv_path : '',
        lang: action==='edit' ? cv.lang : 'fr'
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });
    }, []);

    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        setFormData({
            ...formData,
            lang: e.target.checked ? "fr" : "gb"

        })
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        })
    }

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

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            cv: e.target.files[0]
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('cv', formData.cv);
        form.append('lang', formData.lang);
        if(action === 'edit') {
            form.append('_method', 'put');
        }

        try {
            const res = await axios.post(route('cvs.upload'), form);
            router.get(document.referrer, res.data.path);
            console.log(res.data)
            setMessage(res.data.message);
            setSeverity('success');
            setOpen(true);
            setErrorInput({});
            if(action === 'edit') {
                router.replace(route('cvs.index'));
            } else {
                setFormData({
                    name: '',
                    cv: '',
                    lang: ''
                });
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 422) {
                setErrorInput(error.response.data.errors);
            } else {
                setMessage(error.response.data.message);
                setSeverity('error');
                setOpen(true);
            }
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'name') message = 'Le Nom du CV est requis';

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

    console.log(formData)

  return (
    <>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nom du CV"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errorInput.name?.status}
                helperText={errorInput.name?.message}
            />
            <div>
                <p>Choisir la langue du projet : </p>
                <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage} />
            </div>
            <div>
                <p>Choisir le fichier du CV : {formData.cv ? formData.cv.name : ''} </p>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    id="icon_path"
                    name="icon_path"
                    onChange={handleFileChange}
                    required
                    className="self-center justify-self-center"
                    >
                    Ajouter une icône
                    <VisuallyHiddenInput type="file" />
                </Button>
            </div>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
            >
                {action === 'edit' ? 'Modifier' : 'Ajouter'}
            </Button>
        </form>
    </>
  )
}

export default CVForm