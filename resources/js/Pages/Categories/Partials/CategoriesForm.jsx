import React, {useState, useEffect} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import SwitchLanguage from '@/Components/SwitchLanguage';
import WysiwygEditor from '@/Components/WysiwygEditor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

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
    const [editorState, setEditorState] = useState(() => {
        if (action === "edit" && categories.description) {
            const contentState = convertFromRaw(JSON.parse(categories.description));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

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

        if (action === "edit" && categories.description) {
            const contentState = convertFromRaw(JSON.parse(categories.description));
            const newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState);
        }
    }, [categories]);

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
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', JSON.stringify(rawContentState));
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

    const handleBlurOnRichEditor = (e) => {
        if(e.target.textContent.length === 0) {
            setErrorInput({
                ...errorInput,
                description: {
                    message: 'Une description est requise',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                description: {
                    message: '',
                    status: false
                }
            })
        }
    }

    const handleEditorStateChange = (editorState) => {
        setEditorState(editorState);
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
            <div className="col-span-3">
                <FormControl>
                    <FormLabel>Description de la catégorie</FormLabel>
                    <WysiwygEditor handleEditorStateChange={handleEditorStateChange} editorState={editorState} onBlur={handleBlurOnRichEditor} />
                    <FormHelperText style={{color: '#C41C1C'}}>{errorInput.description !== undefined ? errorInput.description.message : ''}</FormHelperText>
                </FormControl>
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
