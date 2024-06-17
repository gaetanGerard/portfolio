import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import CustomNoRowsOverlay from '@/Components/CustomNoRowOverlay';
import Tooltip from '@mui/material/Tooltip';

const Index = ({ auth }) => {
    const {technologies} = usePage().props;
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

    const handleDeleteTechnology = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/technologies/delete/${id}`);
            const message = response.data.message;
            const open = true;
            const severity = 'success';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            window.location.reload();
        } catch (error) {
            const message = 'Une erreur est survenue lors de la suppression du projet.';
            const open = true;
            const severity = 'error';
            localStorage.setItem('snackbarMessage', message);
            localStorage.setItem('snackbarState', open);
            localStorage.setItem('snackbarSeverity', severity);
            console.error('Une erreur est survenue lors de la suppression de la technologie :', error);
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
        { field: 'name', headerName: 'Nom', width: 150, flex: 1 },
        { field: 'lang', headerName: 'Langue', minWidth: 100, flex: 1},
        { field: 'icon_path', headerName: 'Icone', width: 150, flex: 1, renderCell: (params) => (
            <img src={`${params.value}`} alt={`${params.row.name}`} style={{ width: '50px', height: '50px', objectFit: 'contain' }}  />
        )
        },
        { field: 'show', headerName: 'Afficher', width: 150, flex: 1, renderCell: (params) => (
            <div className="button-group">
                {params.row.show === 1 ?
                (<Tooltip title="Afficher">
                        <VisibilityIcon />
                </Tooltip>) :
                (<Tooltip title="Cacher">
                        <VisibilityOffIcon />
                </Tooltip>)}
            </div>
        )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="button-group">
                    <Tooltip title="Détail">
                        <IconButton href={`/admin/dashboard/technologies/technology/${params.row.id}`}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <IconButton href={`/admin/dashboard/technologies/edit?id=${params.row.id}`}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDeleteTechnology(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const rows = technologies.map((technology, index) => {
        return {
            id: technology.id,
            name: technology.name,
            lang: technology.lang === "fr" ? "Français" : "Anglais",
            icon_path: technology.icon_path,
            show: technology.show,
        }
    });

  return (
    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Technologies</h2>}
    >
        <Head title="Technologies" />

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
                        slots={{ noRowsOverlay: () => (<CustomNoRowsOverlay message='Aucune technologie trouvé.' />) }}
                    />
                </div>
                <Button variant="contained" className="my-2" href='/admin/dashboard/technologies/add'>Ajouter une technologie</Button>
            </div>
        </div>
    </AuthenticatedLayout>
  )
}

export default Index