import React, {useState, useEffect, useRef} from 'react';
import { usePage, router } from '@inertiajs/react';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/joy/FormHelperText';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import SwitchLanguage from '@/Components/SwitchLanguage';

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

export const ProjectForm = () => {
    const {project, technologies, action, localeData} = usePage().props;
    const [imgError, setImgError] = useState("");
    const [language, setLanguage] = useState(action === 'edit' ? project.lang : 'fr');
    const [formData, setFormData] = useState({
        title: action==='edit' ? project.title : '',
        short_description: action==='edit' ? project.short_description : '',
        used_technologies: action==='edit' ? project.used_technologies : [],
        images: action==='edit' ? project.images : [],
        main_img: action==='edit' ? project.main_img : '',
        demo_link: action==='edit' ? project.demo_link : null,
        github_repo: action==='edit' ? project.github_repo : null,
        description: action==='edit' ? project.description : ''
    });
    const [selectedImg, setSelectedImg] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [errorInput, setErrorInput] = useState({});
    const autocompleteRef = useRef(null);

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });

        if(action === 'edit') {
            setSelectedImg(project.images);
        }
    }, []);

    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
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

    // Associé la clé name de l'input à la clé du state et ajouter la valeur de l'input à la clé du state
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Chaque fois qu'une image est uploader, ajouter l'image dans le dossier /storage/app/public/uploads
    // Récupérer le chemin relatif et l'ajouter à l'état formData (car se sont les données qui seront envoyées à la DB)
    // ensuite afficher les images uploadées
    const handleImageChange = async (e) => {

        const uploadedImages = [];

        const formDataToSend = new FormData();
        formDataToSend.append('image', e.target.files[0]);

        try {
            const response = await axios.post(`/admin/dashboard/projects/${action}/upload-image`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            uploadedImages.push(response.data.path);
        } catch (error) {
            console.error('Error uploading image: ', error);
        }

        setSelectedImg([...selectedImg, ...uploadedImages]);

        setFormData({
            ...formData,
            images: [...formData.images, ...uploadedImages]
        });
        setErrorInput({
            ...errorInput,
            images: {
                message: '',
                status: false
            }
        });
    }

    // cet objet est encore du WIP car il faut ajouter toute la logique CRUD pour les technologies
    // ensuite je pourrais recharger la liste et l'envoyer à la DB
    const handleTechnoChange = (e, value) => {
        setFormData({
            ...formData,
            used_technologies: value
        });
        setErrorInput({
            ...errorInput,
            used_technologies: {
                message: '',
                status: false
            }
        });
    }

    // Gérer l'image de couverture du projet
    const handleSelectedImg = (index) => {
        setFormData({
            ...formData,
            main_img: selectedImg[index]
        });
        setErrorInput({
            ...errorInput,
            main_img: {
                message: '',
                status: false
            }
        });
    }

    const currentCoverImg = () => {
        if(formData.main_img.length === 0 & action === "edit") {
            return <img src={project.main_img} alt={project.title} />
        } else if(formData.main_img.length > 0) {
            return <img src={formData.main_img} alt={formData.title} />
        }
    }

    const handleDeleteImg = (e, index) => {
        e.preventDefault();
        if(selectedImg.length > 1) {
            const imgToDelete = selectedImg[index];
            const updatedImages = selectedImg.filter((img, imgIndex) => imgIndex !== index);
            setSelectedImg(updatedImages);
            const data = {
                id: project.id,
                path: imgToDelete,
                images: updatedImages,
                main_img: action === 'edit' ? project.main_img : formData.main_img
            }

            if (selectedImg[index] === formData.main_img || selectedImg[index] === project.main_img) {
                setFormData({
                    ...formData,
                    images: updatedImages,
                    main_img: selectedImg[index+1]
                });
            }

            axios.delete(`/admin/dashboard/projects/${action}/delete-image`, {
            data })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('There was an error deleting the image!', error);
            });
        } else {
            setImgError("Vous ne pouvez pas supprimer la dernière image");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/admin/dashboard/projects/${action}`;
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('short_description', formData.description);
        formDataToSend.append('main_img', formData.main_img);
        formDataToSend.append('demo_link', formData.demo_link || '');
        formDataToSend.append('github_repo', formData.github_repo || '');
        formDataToSend.append('description', formData.description);
        formDataToSend.append('lang', language);

        if(formData.main_img.length === 0) {
            setErrorInput({ ...errorInput, main_img: { message: 'Vous devez ajouter une image de couverture', status: true } });
        } else {
            setErrorInput({ ...errorInput, main_img: { message: '', status: false } });
        }

        if(selectedImg.length === 0) {
            setErrorInput({ ...errorInput, images: { message: 'Vous devez ajouter au moins une image', status: true }, main_img: { message: 'Vous devez ajouter une image de couverture', status: true } });
        } else {
            setErrorInput({ ...errorInput, images: { message: '', status: false }, main_img: { message: '', status: false } });
            selectedImg.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image);
            });
        }

        formData.used_technologies.forEach((technology, index) => {
            formDataToSend.append(`used_technologies[${index}]`, technology);
        });

        if (action === 'edit') {
            formDataToSend.append('id', project.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            if (response.data.success) {
                const message = action === 'edit' ? 'Projet modifié avec succès.' : 'Projet ajouté avec succès.';
                const open = true;
                const severity = 'success';
                localStorage.setItem('snackbarMessage', message);
                localStorage.setItem('snackbarState', open);
                localStorage.setItem('snackbarSeverity', severity);
                setErrorInput({});
                router.get(document.referrer, response.data.experience);
            }
          } catch (error) {
            const message = action === 'edit' ? 'Une erreur est survenu lorsque vous avez essayer de modifier un projet. Veuillez réessayer.' : 'Une erreur est survenu lorsque vous avez essayer d\'ajouter un projet. Veuillez réessayer.';
            setOpen(true);
            setMessage(message);
            setSeverity('error');
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter un projet : ', error);
        }
    }

    const handleBlur = (e) => {
        let message = '';
        if(e.target.name === 'title') message = 'Le titre du projet est requis';
        if(e.target.name === 'description') message = 'La description du projet est requise';

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

    const handleTechnoBlur = () => {
        if(formData.used_technologies.length === 0) {
            setErrorInput({
                ...errorInput,
                used_technologies: {
                    message: 'Vous devez ajouter au moins une technologie',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                used_technologies: {
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
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
                <div>
                    <TextField
                        type="text"
                        error={errorInput.title !== undefined ? errorInput.title.status : false}
                        helperText={errorInput.title !== undefined ? errorInput.title.message : ''}
                        id="title"
                        onBlur={handleBlur}
                        label="Titre du projet"
                        onChange={handleInputChange}
                        variant="outlined"
                        name="title"
                        required
                        defaultValue={action === 'edit' ? project.title : null}
                        className="w-full"
                    />
                </div>
                {/* <div>
                    <TextField type="text" id="short_description" label="Courte description du projet" onChange={handleInputChange} variant="outlined" name="short_description" required defaultValue={action === 'edit' ? project.short_description : null} />
                </div> */}
                <div>
                    <Autocomplete
                        multiple
                        id="used_technologies"
                        options={technologies.map((option) => option.name)}
                        freeSolo
                        onChange={handleTechnoChange}
                        defaultValue={action === 'edit' && project ? project.used_technologies : []}
                        ref={autocompleteRef}
                        onBlur={handleTechnoBlur}
                        className="w-full"
                        renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                        }
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Technologies utilisées"
                            placeholder="Technologies"
                            name='used_technologies'
                            error={errorInput.used_technologies !== undefined ? errorInput.used_technologies.status : false}
                            helperText={errorInput.used_technologies !== undefined ? errorInput.used_technologies.message : ''}
                        />
                        )}
                    />
                </div>
                <div>
                    <TextField type="url" className="w-full" id="demo_link" label="Lien démo"  onChange={handleInputChange} variant="outlined" name="demo_link" defaultValue={action === 'edit' ? project.demo_link : null} />
                </div>
                <div>
                    <TextField type="url" className="w-full" id="github_repo" label="Lien Github"  onChange={handleInputChange} variant="outlined" name="github_repo" defaultValue={action === 'edit' ? project.github_repo : null} />
                </div>
                <div>
                    <p>Choisir la langue du projet : </p>
                    <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage} />
                </div>
                <div className="col-span-2">
                <FormControl>
                    <FormLabel>Description du projet</FormLabel>
                    <Textarea
                    id="description"
                    label="Description"
                    minRows={4}
                    defaultValue={action === 'edit' ? project.description : ""}
                    variant="outlined"
                    name="description"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errorInput.description !== undefined ? errorInput.description.status : false}
                    required
                    placeholder="Description du projet"
                    className="w-full self-center"
                    />
                    <FormHelperText style={{color: '#C41C1C'}}>{errorInput.description !== undefined ? errorInput.description.message : ''}</FormHelperText>
                </FormControl>
                </div>

            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3 mt-3">
                <div className="grid grid-rows-5 gap-3">
                    <p className="font-bold mb-3 self-start row-start-1 row-end-1">Images du projet</p>
                    <div className="flex flex-wrap content-start row-start-2 row-end-4">
                        {errorInput.images !== undefined ? <p className={`${errorInput.images.status === true ? "block" : "hidden" } text-red-600`}>{errorInput.images.message}</p> : null}
                        {selectedImg.map((img, index) => (
                            <div className="relative transition-all duration-300 hover:scale-105 m-1" key={index} >
                                <IconButton
                                        onClick={(e) => handleDeleteImg(e, index)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: 0
                                        }}
                                    >
                                    <DeleteIcon />
                                </IconButton>
                                <img src={img} alt={`Image ${index}`} className="object-cover w-28 h-28 cursor-pointer" onClick={() => handleSelectedImg(index)} />
                            </div>))}
                    </div>
                    <div className="row-start-5 row-end-5 self-end">
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            id="images"
                            name="images"
                            onChange={handleImageChange}
                            multiple
                            required
                            className="w-full"
                            >
                            Ajouter une image
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </div>
                </div>
                <div>
                    <p className="font-bold">Image de couverture</p>
                    {errorInput.main_img !== undefined ? <p className={`${errorInput.main_img.status === true ? "block" : "hidden" } text-red-600`}>{errorInput.main_img.message}</p> : null}
                    {currentCoverImg()}
                </div>
            </div>
            <div className="grid grid-flow-col gap-3 justify-start">
                <Button variant="contained" style={{ backgroundColor: grey[500] }} className="mt-3" href="/admin/dashboard/projects">Annuler</Button>
                <Button variant="contained" className="mt-3" type="submit">{action === "edit" ? "Modifier le projet" : "Créer un projet"}</Button>
            </div>
        </form>
    </div>

  )
}

export default ProjectForm;
