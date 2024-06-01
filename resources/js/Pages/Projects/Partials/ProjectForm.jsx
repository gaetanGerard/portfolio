import React, {useState, useEffect} from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

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
    const {project, action} = usePage().props;
    const [imgError, setImgError] = useState("");
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

    const listOfTechnologies = [
        { name: 'React' },
        { name: 'Laravel' },
        { name: 'Tailwind CSS' },
        { name: 'MySQL' },
        { name: 'MongoDB' },
        { name: 'Node.js' },
        { name: 'Express.js' },
        { name: 'Django' },
        { name: 'Flask' },
        { name: 'Python' },
        { name: 'PHP' },
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'SASS' },
        { name: 'SCSS' },
        { name: 'Bootstrap' },
        { name: 'Material-UI' },
        { name: 'GraphQL' },
        { name: 'REST API' },
        { name: 'WebSockets' },
        { name: 'Docker' },
        { name: 'Kubernetes' },
        { name: 'Git' },
        { name: 'GitHub' },
        { name: 'GitLab' },
        { name: 'Bitbucket' },
        { name: 'AWS' },
        { name: 'GCP' },
        { name: 'Firebase' },
        { name: 'PostgreSQL' },
        { name: 'SQLite' },
        { name: 'Redis' },
        { name: 'Prometheus' },
        { name: 'Grafana' },
        { name: 'Nginx' }
    ]

    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return config;
        });

        if(action === 'edit') {
            setSelectedImg(project.images);
        }

    }, []);

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
    }

    // cet objet est encore du WIP car il faut ajouter toute la logique CRUD pour les technologies
    // ensuite je pourrais recharger la liste et l'envoyer à la DB
    const handleTechnoChange = (e, value) => {
        setFormData({
            ...formData,
            used_technologies: value
        });
    }

    // Gérer l'image de couverture du projet
    const handleSelectedImg = (index) => {
        setFormData({
            ...formData,
            main_img: selectedImg[index]
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
        formDataToSend.append('short_description', formData.short_description);
        formDataToSend.append('main_img', formData.main_img);
        formDataToSend.append('demo_link', formData.demo_link || '');
        formDataToSend.append('github_repo', formData.github_repo || '');
        formDataToSend.append('description', formData.description);

        selectedImg.forEach((image, index) => {
            formDataToSend.append(`images[${index}]`, image);
        });

        formData.used_technologies.forEach((technology, index) => {
            formDataToSend.append(`used_technologies[${index}]`, technology);
        });

        if (action === 'edit') {
            formDataToSend.append('id', project.id);
        }

        try {
            const response = await axios.post(url, formDataToSend);
            window.location.href = '/admin/dashboard';
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter un projet : ', error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="title" label="Titre du projet" onChange={handleInputChange} variant="filled" name="title" required defaultValue={action === 'edit' ? project.title : null} />
        </div>
        <div>
            <TextField type="text" id="short_description" label="Courte description du projet" onChange={handleInputChange} variant="filled" name="short_description" required defaultValue={action === 'edit' ? project.short_description : null} />
        </div>
        <div>
            <Autocomplete
                multiple
                id="used_technologies"
                options={listOfTechnologies.map((option) => option.name)}
                freeSolo
                onChange={handleTechnoChange}
                defaultValue={action === 'edit' && project ? project.used_technologies : []}
                renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
                }
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="Technologies utilisées"
                    placeholder="Technologies"
                />
                )}
            />
        </div>
        <div>
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
                >
                Ajouter une image
                <VisuallyHiddenInput type="file" />
            </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <label>Liste d'image</label>
            {imgError.length > 0 ? <p>{imgError}</p> : null}
            {selectedImg.map((img, index) => (
                <div style={{ position: 'relative', margin: '10px' }} key={index} >
                    <button
                            onClick={(e) => handleDeleteImg(e, index)}
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                        Supprimer
                    </button>
                    <img src={img} alt={`Image ${index}`} style={{ cursor: 'pointer', width: '100px', height: '100px', objectFit: 'cover' }} onClick={() => handleSelectedImg(index)} />
                </div>))}
        </div>
        <div>
            <label>Image de couverture</label>
            {currentCoverImg()}
        </div>
        <div>
            <TextField type="url" id="demo_link" label="Lien démo" onChange={handleInputChange} variant="filled" name="demo_link" defaultValue={action === 'edit' ? project.demo_link : null} />
        </div>
        <div>
            <TextField type="url" id="github_repo" label="Lien Github" onChange={handleInputChange} variant="filled" name="github_repo" defaultValue={action === 'edit' ? project.github_repo : null} />
        </div>
        <div>
            <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={action === 'edit' ? project.description : "Description du projet"}
            variant="filled"
            name="description"
            onChange={handleInputChange}
            required
            />
        </div>
        <Button variant="contained" type="submit">{action === "edit" ? "Modifier le projet" : "Créer un projet"}</Button>
    </form>
  )
}

export default ProjectForm;
