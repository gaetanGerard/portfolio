import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

export default function Dashboard({ auth }) {
    const {projects, technoCategory, technologies} = usePage().props;

    const handleDeleteProject = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/projects/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression du projet :', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/categories/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de la catégorie :', error);
        }
    };

    const handleDeleteTechnology = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/technologies/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de la technologie :', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projets & Technologies</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                            {projects.length > 0 ? projects.map((project, index) => (
                                <li key={index}>
                                    <h3>Titre : {project.title}</h3>
                                    <img src={`${project.main_img}`} alt={`${project.title}`} />
                                    <p>Description : {project.short_description}</p>
                                    {project.demo_link != null ? (<p>Demo Link: {project.demo_link}</p>) : null}
                                    {project.github_repo != null ? (<p>Github: {project.github_repo}</p>) : null}
                                    <div className="button-group">
                                        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/projects/edit?id=${project.id}`}>Modifier</Button>
                                        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteProject(project.id)}>Supprimer</Button>
                                    </div>
                                </li>
                            ))  : <p>Aucun projet n'a été trouvé.</p>}
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/projects/add'>Ajouter un projet</Button>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                            {technologies.length > 0 ? technologies.map((technology, index) => (
                                    <li key={index}>
                                        <h3>Nom : {technology.name}</h3>
                                        <img src={`${technology.icon_path}`} alt={`${technology.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}  />
                                        <div className="button-group">
                                            <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/technologies/edit?id=${technology.id}`}>Modifier</Button>
                                            <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteTechnology(technology.id)}>Supprimer</Button>
                                        </div>
                                    </li>
                                ))  : <p>Aucune technologie n'a été trouvé.</p>}
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/technologies/add'>Ajouter une technologie</Button>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                            {technoCategory.length > 0 ? technoCategory.map((category, index) => (
                                <li key={index}>
                                    <h3>Nom : {category.name}</h3>
                                    <p>Description : {category.description}</p>
                                    <div className="button-group">
                                        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/categories/edit?id=${category.id}`}>Modifier</Button>
                                        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteCategory(category.id)}>Supprimer</Button>
                                    </div>
                                </li>
                            ))  : <p>Aucune catégorie n'a été trouvé.</p>}
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/categories/add'>Ajouter une catégorie</Button>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
