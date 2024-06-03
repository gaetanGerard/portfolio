import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

const Index = ({ auth }) => {
    const {technologies} = usePage().props;

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
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Technologies</h2>}
    >
        <Head title="Technologies" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <ul className="p-6 text-gray-900">
                        {technologies.length > 0 ? technologies.map((technology, index) => (
                                <li key={index}>
                                    <h3>Nom : {technology.name}</h3>
                                    <img src={`${technology.icon_path}`} alt={`${technology.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}  />
                                    <div className="button-group">
                                        <Button variant="contained" className="mt-2" href={`/admin/dashboard/technologies/technology/${technology.id}`}>Voire</Button>
                                        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/technologies/edit?id=${technology.id}`}>Modifier</Button>
                                        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteTechnology(technology.id)}>Supprimer</Button>
                                    </div>
                                </li>
                            ))  : <p>Aucune technologie n'a été trouvé.</p>}
                    </ul>
                </div>
                <Button variant="contained" className="my-2" href='/admin/dashboard/technologies/add'>Ajouter une technologie</Button>
            </div>
        </div>
    </AuthenticatedLayout>
  )
}

export default Index