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
    const { educations } = usePage().props;
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

    const handleDeleteEducation = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/educations/delete/${id}`);
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
            console.error('Une erreur est survenue lors de la suppression de l\'éducation :', error);
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
        { field: 'school_name', headerName: 'Nom de l\'école', width: 150, flex: 1 },
        { field: 'school_location', headerName: 'Lieux de l\'école', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center justify-center">
                    <Tooltip title="Détail">
                        <IconButton href={`/admin/dashboard/educations/education/${params.row.id}`}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <IconButton href={`/admin/dashboard/educations/edit?id=${params.row.id}`}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDeleteEducation(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
    ];

    const rows = educations.map((education) => {
        return {
            id: education.id,
            school_name: education.school_name,
            school_location: education.school_location,
        };
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Education</h2>}
        >
            <Head title="Education" />

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
                            slots={{ noRowsOverlay: () => (<CustomNoRowsOverlay message='Aucune éducation trouvé.' />) }}
                        />
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/educations/add'>Ajouter une Education</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
