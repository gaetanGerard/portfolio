import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import CustomNoRowsOverlay from '@/Components/CustomNoRowOverlay';
import Tooltip from '@mui/material/Tooltip';

export default function Index({ auth }) {
    const { experiences } = usePage().props;
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

    const handleDeleteExperience = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/experiences/delete/${id}`);
            const message = response.data.message;
            const open = true;
            const severity = 'success';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            window.location.reload();
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        localStorage.removeItem('snackbarMessage');
        localStorage.removeItem('snackbarState');
        localStorage.removeItem('snackbarSeverity');
        setOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'company_name', headerName: 'Nom de l\'entreprise', width: 200, flex: 1 },
        { field: 'job_title', headerName: 'Titre du job', width: 200, flex: 1 },
        { field: 'company_location', headerName: 'Lieu de l\'entreprise', width: 200, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center justify-center">
                    <Tooltip title="Détail" placement="top">
                        <IconButton href={`/admin/dashboard/experiences/experience/${params.row.id}`}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier" placement="top">
                        <IconButton href={`/admin/dashboard/experiences/edit?id=${params.row.id}`}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer" placement="top">
                        <IconButton onClick={() => handleDeleteExperience(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const rows = experiences.map((experience) => {
        return {
            id: experience.id,
            company_name: experience.company_name,
            job_title: experience.job_title,
            company_location: experience.company_location,
        };
    });

    console.log(experiences);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expériences Professionel</h2>}
        >
            <Head title="Expériences professionnel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                    <div style={{ height: 371, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                            slots={{ noRowsOverlay: () => (<CustomNoRowsOverlay message='Aucune catégorie trouvé.' />) }}
                        />
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/experiences/add'>Ajouter une expérience</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
