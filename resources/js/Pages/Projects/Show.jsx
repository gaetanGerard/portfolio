import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Show = ({ auth }) => {
    const {project, technologies, categories} = usePage().props;
    const [techArr, setTechArr] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    useEffect(() => {
        const storedMessage = localStorage.getItem('snackbarMessage');
        const storedOpen = localStorage.getItem('snackbarState') === 'true';
        const storedSeverity = localStorage.getItem('snackbarSeverity');

        if (storedMessage && storedOpen && storedSeverity !== null) {
            setMessage(storedMessage);
            setOpen(storedOpen);
            setSeverity(storedSeverity);
        }

        if(open) {
            const timeoutId = setTimeout(() => {
                localStorage.removeItem('snackbarMessage');
                localStorage.removeItem('snackbarState');
                localStorage.removeItem('snackbarSeverity');

                setMessage('');
                setSeverity('');
                setOpen(false);
            }, 5000);

            return () => clearTimeout(timeoutId);
        }

        const matchedTechnologies = project.used_technologies.map(tech =>
            technologies.find(t => t.name === tech)
          );

        setTechArr(matchedTechnologies);
    }, [project.used_technologies, technologies, open]);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        localStorage.removeItem('snackbarMessage');
        localStorage.removeItem('snackbarState');
        localStorage.removeItem('snackbarSeverity');
        setOpen(false);
      };

    const handleDeleteProject = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/projects/delete/${id}`);
            const message = response.data.message;
            const open = true;
            const severity = 'success';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            window.location.href = '/admin/dashboard/projects';
        } catch (error) {
            const message = 'Une erreur est survenue lors de la suppression du projet.';
            const open = true;
            const severity = 'error';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            console.error('Une erreur est survenue lors de la suppression du projet :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projet : {project.title}</h2>}
>
    <Head title="Projet" />
    <div className="m-3">
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
                <div className="grid lg:grid-cols-2 gap-3 md:grid-cols-1">
                    <div>
                        <h3 className="text-3xl">Informations du projet</h3>
                        <p className="font-bold">Titre : <span className="font-normal">{project.title}</span></p>
                        <p className="font-bold">Date de création : <span className="font-normal">{dayjs(project.created_at).format('DD/MM/YYYY')}</span></p>
                        <p className="font-bold">Date de mise à jour : <span className="font-normal">{dayjs(project.updated_at).format('DD/MM/YYYY')}</span></p>
                        <div>
                            <p className="font-bold">Image de couverture : </p>
                            <img src={`${project.main_img}`} alt={`${project.title}`} style={{ width: '300px', height: '200px', objectFit: 'cover' }}  />
                        </div>
                        <p className="font-bold">Description : <span className="font-normal">{project.description}</span></p>
                        {project.demo_link != null ? (
                            <p className="font-bold grid grid-flow-col justify-start content-center items-center">
                                Lien vers le site :
                                <Tooltip title={"Lien vers le site"} placement="top" arrow>
                                    <IconButton aria-label="detail" variant="contained" href={project.demo_link} target="_blank" rel="noreferrer noopener"><LanguageIcon /></IconButton>
                                </Tooltip>
                            </p>
                        ) : null}
                        {project.github_repo != null ? (
                            <p className="font-bold grid grid-flow-col justify-start content-center items-center">
                                Github:
                                <Tooltip title={"Lien vers le Repo Github"} placement="top" arrow>
                                    <IconButton aria-label="detail" variant="contained" href={project.github_repo} target="_blank" rel="noreferrer noopener"><GitHubIcon /></IconButton>
                                </Tooltip>
                            </p>) : null}
                    </div>
                    <div>
                        <h3 className="text-3xl">Technologies utilisées</h3>
                        <div className="grid lg:grid-flow-col md:grid-cols-3 md:auto-rows-max auto-cols-max mt-5">
                            {techArr.map((technology, index) => (
                                <Tooltip title={technology.name} key={index} placement="top" arrow>
                                    <Link href={`/admin/dashboard/technologies/technology/${technology.id}`}>
                                        <img src={`${technology.icon_path}`} alt={`${technology.name}`} className="w-20 h-20 object-cover hover:scale-105 transition-all duration-300"  />
                                    </Link>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
                <h3 className="text-3xl">Liste d'images</h3>
                <div className="grid md:grid-flow-col sm:grid-flow-row auto-rows-max gap-2">
                    {project.images.map((image, index) => (
                        <img key={index} src={`${image}`} alt={`${project.title}`} style={{ width: '300px', height: '200px', objectFit: 'cover' }}  />
                    ))}
                </div>
            </div>
        </div>
        <div className="grid grid-flow-col justify-start gap-2">
            <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/projects/edit?id=${project.id}`}>Modifier</Button>
            <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteProject(project.id)}>Supprimer</Button>
        </div>
    </div>
</AuthenticatedLayout>
  )
}

export default Show