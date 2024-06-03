import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

export default function Index({ auth }) {
    const { educations } = usePage().props;

    const handleDeleteEducation = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/educations/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de l\'éducation :', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Education</h2>}
        >
            <Head title="Education" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                        {educations.length > 0 ? educations.map((education, index) => (
                                <li key={index}>
                                    <h3>Nom de l'école : {education.school_name}</h3>
                                    <p>Description : {education.description}</p>
                                    <div className="button-group">
                                        <Button variant="contained" className="mt-2" href={`/admin/dashboard/educations/education/${education.id}`}>Détail</Button>
                                        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/educations/edit?id=${education.id}`}>Modifier</Button>
                                        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteEducation(education.id)}>Supprimer</Button>
                                    </div>
                                </li>
                            ))  : <p>Aucune éducation n'a été trouvé.</p>}
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/educations/add'>Ajouter une Education</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
