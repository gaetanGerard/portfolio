import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';

const Index = ({ auth }) => {
    const {projects} = usePage().props;

    const handleDeleteProject = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/projects/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression du projet :', error);
        }
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
        { field: 'short_description', headerName: 'Description', minWidth: 200, flex: 1 },
        {
            field: 'demo_link',
            headerName: 'Demo',
            minWidth: 75,
            flex: 1,
            renderCell: (params) => (
              <IconButton aria-label="detail" variant="contained" className="mt-2" href={params.row.demo_link} target="_blank" rel="noreferrer noopener"><LanguageIcon /></IconButton>
            ), },
        {
            field: 'github_repo',
            headerName: 'Github',
            minWidth: 75,
            flex: 1,
            renderCell: (params) => (
              <IconButton aria-label="detail" variant="contained" className="mt-2" href={params.row.github_repo} target="_blank" rel="noreferrer noopener"><GitHubIcon /></IconButton>
            ),
        },
        {
          field: 'detail',
          headerName: 'Détail',
          minWidth: 75,
          flex: 1,
          renderCell: (params) => (
            <IconButton aria-label="detail" variant="contained" className="mt-2" href={`/admin/dashboard/projects/project/${params.row.id}`}><InfoIcon /></IconButton>
          ),
        },
        {
          field: 'edit',
          headerName: 'Modifier',
          minWidth: 75,
          flex: 1,
          renderCell: (params) => (
            <IconButton aria-label="edit" variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/projects/edit?id=${params.row.id}`}><EditIcon /></IconButton>
          ),
        },
        {
          field: 'delete',
          headerName: 'Supprimer',
          minWidth: 100,
          flex: 1,
          renderCell: (params) => (
            <IconButton aria-label="delete" variant="contained" className="mt-2" color="error" onClick={() => handleDeleteProject(params.row.id)}><DeleteIcon /></IconButton>
          ),
        },
    ]

    const rows = projects.map((project, index) => {
        return {
            id: project.id,
            title: project.title,
            short_description: truncateText(project.short_description, 10),
            demo_link: project.demo_link != null ? project.demo_link : "N.A.",
            github_repo: project.github_repo != null ? project.github_repo : "N.A."
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
                {projects.length > 0 ? (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </div>
                ) : <Typography variant="h6" className="mt-2">Aucun projet n'a été trouvé.</Typography>}
                <Button variant="contained" className="my-2" href='/admin/dashboard/projects/add'>Ajouter un projet</Button>
            </div>
        </div>
    </AuthenticatedLayout>
  )
}

export default Index