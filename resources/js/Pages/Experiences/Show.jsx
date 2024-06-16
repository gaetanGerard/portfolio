import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const Show = ({ auth  }) => {
    const { experience } = usePage().props;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    const rawContentState = JSON.parse(experience.description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));

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

    const handleDeleteExperience = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/experiences/delete/${id}`);
            const message = response.data.message;
            const open = true;
            const severity = 'success';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            window.location.href = '/admin/dashboard/experiences';
        } catch (error) {
            const message = 'Une erreur est survenue lors de la suppression de l\'expérience.';
            const open = true;
            const severity = 'error';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            console.error('Une erreur est survenue lors de la suppression de l\'expérience :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expériences Professionel : {experience.company_name}</h2>}
>
    <Head title="Expériences Professionel" />
    <div className="m-3">
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
        <div className="grid lg:grid-cols-3 gap-3 md:grid-cols-1 bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
            <p className="font-bold">Nom de l'entreprise : <span className="font-normal">{experience.company_name}</span></p>
            <p className="font-bold">Titre du job : <span className="font-normal">{experience.job_title}</span></p>
            <p className="font-bold">Lieu : <span className="font-normal">{experience.company_location}</span></p>
            <p className="font-bold">Langue : <span className="font-normal">{experience.lang === "fr" ? "Français" : "Anglais"}</span></p>
            <p className="font-bold">Visibilité : <span className="font-normal">{experience.show === 1 ? "Visible" : "Caché"}</span></p>
            <p className="font-bold">Début : <span className="font-normal">{dayjs(experience.start_date).format('DD/MM/YYYY')}</span></p>
            {experience.is_current ? (<p className="font-bold">En cours : Oui</p>) : (<p className="font-bold">Fin : <span className="font-normal">{dayjs(experience.end_date).format('DD/MM/YYYY')}</span></p>)}
            <div className="col-span-3">
                <p className="font-bold">Description :</p>
                <div dangerouslySetInnerHTML={{ __html: markup }} className="grid grid-flow-row gap-4" />
            </div>
        </div>
        <div className="grid grid-flow-col justify-start gap-2">
            <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/experiences/edit?id=${experience.id}`}>Modifier</Button>
            <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteExperience(experience.id)}>Supprimer</Button>
        </div>
    </div>
</AuthenticatedLayout>
  )
}

export default Show