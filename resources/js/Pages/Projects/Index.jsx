import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import CustomNoRowsOverlay from '@/Components/CustomNoRowOverlay';
import Tooltip from '@mui/material/Tooltip';

const Index = ({ auth }) => {
    const {projects, localeData} = usePage().props;
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

    const handleDeleteProject = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/projects/delete/${id}`);
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
            console.error('Une erreur est survenue lors de la suppression du projet :', error);
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


    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
      };

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 40, flex: 1},
        { field: 'title', headerName: 'Titre', minWidth: 200, flex: 1},
        { field: 'lang', headerName: 'Langue', minWidth: 100, flex: 1},
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
            field: 'demo_link',
            headerName: 'Demo',
            minWidth: 75,
            flex: 1,
            renderCell: (params) => (
                <Tooltip title={"Lien vers le site"} placement="top" arrow>
                    <IconButton aria-label="detail" variant="contained" className="mt-2" href={params.row.demo_link} target="_blank" rel="noreferrer noopener"><LanguageIcon /></IconButton>
                </Tooltip>
            ), },
        {
            field: 'github_repo',
            headerName: 'Github',
            minWidth: 75,
            flex: 1,
            renderCell: (params) => (
                <Tooltip title={"Lien vers le Repo Github"} placement="top" arrow>
                    <IconButton aria-label="detail" variant="contained" className="mt-2" href={params.row.github_repo} target="_blank" rel="noreferrer noopener"><GitHubIcon /></IconButton>
                </Tooltip>
            ),
        },
        {
          field: 'detail',
          headerName: 'Détail',
          minWidth: 75,
          flex: 1,
          renderCell: (params) => (
            <Tooltip title={"Détail"} placement="top" arrow>
                <IconButton aria-label="detail" variant="contained" className="mt-2" href={`/admin/dashboard/projects/project/${params.row.id}`}><InfoIcon /></IconButton>
            </Tooltip>
          ),
        },
        {
          field: 'edit',
          headerName: 'Modifier',
          minWidth: 75,
          flex: 1,
          renderCell: (params) => (
            <Tooltip title={"Modifier"} placement="top" arrow>
                <IconButton aria-label="edit" variant="contained" className="mt-2" href={`/admin/dashboard/projects/edit?id=${params.row.id}`}><EditIcon /></IconButton>
            </Tooltip>
          ),
        },
        {
          field: 'delete',
          headerName: 'Supprimer',
          minWidth: 100,
          flex: 1,
          renderCell: (params) => (
            <Tooltip title={"Supprimer"} placement="top" arrow>
                <IconButton aria-label="delete" variant="contained" className="mt-2" onClick={() => handleDeleteProject(params.row.id)}><DeleteIcon /></IconButton>
            </Tooltip>
          ),
        },
    ]

    const rows = projects.map((project, index) => {
        return {
            id: project.id,
            title: project.title,
            lang: project.lang === "fr" ? "Français" : "Anglais",
            demo_link: project.demo_link != null ? project.demo_link : "N.A.",
            github_repo: project.github_repo != null ? project.github_repo : "N.A.",
            show: project.show,
        }
    }
    );

  return (
    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projets</h2>}
    >
        <Head title="Projets" />

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
                        slots={{ noRowsOverlay: () => (<CustomNoRowsOverlay message='Aucun projet trouvé.' />) }}
                    />
                </div>
                <Button variant="contained" className="my-2" href='/admin/dashboard/projects/add'>Ajouter un projet</Button>
            </div>
        </div>
    </AuthenticatedLayout>
  )
}

export default Index