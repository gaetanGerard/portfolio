import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

export default function Index({ auth }) {
    const { experiences } = usePage().props;

    const handleDeleteExperience = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/experiences/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de l\'expérience :', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expériences Professionel</h2>}
        >
            <Head title="Expériences professionnel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                            {experiences.length > 0 ? experiences.map((experience, index) => (
                                    <li key={index}>
                                        <h3>Nom de l'entreprise : {experience.company_name}</h3>
                                        <p>Titre du job : {experience.job_title}</p>
                                        <div className="button-group">
                                            <Button variant="contained" className="mt-2" href={`/admin/dashboard/experiences/experience/${experience.id}`}>Voire</Button>
                                            <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/experiences/edit?id=${experience.id}`}>Modifier</Button>
                                            <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteExperience(experience.id)}>Supprimer</Button>
                                        </div>
                                    </li>
                                ))  : <p>Aucun projet n'a été trouvé.</p>}
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/experiences/add'>Ajouter une expériences</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
