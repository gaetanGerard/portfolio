import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';

const Show = ({ auth }) => {
    const {technology, categories} = usePage().props;
    const [category] = useState(categories.find(category => category.id === technology.category_ids));
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

    }, [open]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        localStorage.removeItem('snackbarMessage');
        localStorage.removeItem('snackbarState');
        localStorage.removeItem('snackbarSeverity');
        setOpen(false);
    };

    const handleDeleteTechnology = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/technologies/delete/${id}`);
            const message = response.data.message;
            const open = true;
            const severity = 'success';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            window.location.href = '/admin/dashboard/technologies';
        } catch (error) {
            const message = 'Une erreur est survenue lors de la suppression de la technologie.';
            const open = true;
            const severity = 'error';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            console.error('Une erreur est survenue lors de la suppression de la catégorie :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Technologie : {technology.name}</h2>}
>
    <Head title="Technologie" />
    <div>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <div className=" m-3">
            <div className="grid lg:grid-cols-2 gap-3 md:grid-cols-1 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
                <div>
                    <h3 className="text-3xl">Informations sur la technologie</h3>
                    <p className="font-bold">Nom de la technologie : <span className="font-normal">{technology.name}</span></p>
                    <p className="font-bold">Visibilité : <span className="font-normal">{technology.show === 1 ? "Visible" : "Caché"}</span></p>
                    <div>
                        <p className="font-bold">Catégorie :  </p>
                        <ul>
                            {categories.map((category, index) => <li className="font-normal" key={index}>- {category.name}</li>)}
                        </ul>
                    </div>
                    <p className="font-bold">Langue : <span className="font-normal">{technology.lang === "fr" ? "Français" : "Anglais"}</span></p>
                    <p className="font-bold">Visibilité : <span className="font-normal">{technology.show === 1 ? "Visible" : "Caché"}</span></p>
                    <p className="font-bold">Maitrise : <span className="font-normal">{technology.skill_level}/100</span></p>
                    <p className="font-bold grid grid-flow-col justify-start content-center items-center">
                        Lien vers la documentation :
                        <Tooltip title={"Lien vers le site"} placement="top" arrow>
                            <IconButton aria-label="detail" variant="contained" href={technology.technology_url} target="_blank" rel="noreferrer noopener"><LanguageIcon /></IconButton>
                        </Tooltip>
                    </p>
                </div>
                <div>
                    <h3 className="text-3xl">Icône</h3>
                    <img src={`${technology.icon_path}`} alt={`${technology.name}`} style={{ width: '100px', height: '100px', objectFit: 'contain' }}  />
                </div>
            </div>
            <div className="grid grid-flow-col justify-start gap-2">
                <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/technologies/edit?id=${technology.id}`}>Modifier</Button>
                <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteTechnology(technology.id)}>Supprimer</Button>
            </div>
        </div>
    </div>

</AuthenticatedLayout>
  )
}

export default Show