import React, {useState, useEffect} from 'react';
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
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        used_technologies: [],
        images: [],
        main_img: '',
        demo_link: '',
        github_repo: '',
        description: ''
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
            const response = await axios.post('/admin/dashboard/projects/add/upload-image', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            uploadedImages.push(response.data.path);
        } catch (error) {
            console.error('Error uploading image: ', error);
        }

        // console.log(uploadedImages);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post('/admin/dashboard/projects/add', formData);
            window.location.href = '/admin/dashboard';
          } catch (error) {
            console.error('Une erreur est survenu lorsque vous avez essayer d\'ajouter un projet : ', error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <TextField type="text" id="title" label="Titre du projet" onChange={handleInputChange} variant="filled" name="title" required />
        </div>
        <div>
            <TextField type="text" id="short_description" label="Courte description du projet" onChange={handleInputChange} variant="filled" name="short_description" required />
        </div>
        <div>
            <Autocomplete
                multiple
                id="used_technologies"
                options={listOfTechnologies.map((option) => option.name)}
                freeSolo
                onChange={handleTechnoChange}
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
            <label>Image de couverture</label>
            {selectedImg.map((img, index) => (
                <img src={img} alt={`Image ${index}`} onClick={() => handleSelectedImg(index)} key={index} />
            ))}
        </div>
        <div>
            <TextField type="url" id="demo_link" label="Lien démo" onChange={handleInputChange} variant="filled" name="demo_link" />
        </div>
        <div>
            <TextField type="url" id="github_repo" label="Lien Github" onChange={handleInputChange} variant="filled" name="github_repo" />
        </div>
        <div>
            <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            defaultValue="Description du projet"
            variant="filled"
            name="description"
            onChange={handleInputChange}
            required
            />
        </div>
        <Button variant="contained" type="submit">Créer un projet</Button>
    </form>
  )
}

export default ProjectForm;
