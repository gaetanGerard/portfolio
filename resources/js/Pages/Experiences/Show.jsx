import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const Show = ({ auth  }) => {
    const { experience } = usePage().props;

    const handleDeleteExperience = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/experiences/delete/${id}`);
            window.location.href = '/admin/dashboard/experiences';
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
    <Head title="Expériences Professionel" />
    <div>
        <p>Nom de l'entreprise : <span>{experience.company_name}</span></p>
        <p>Titre du job : <span>{experience.job_title}</span></p>
        <p>Lieu : <span>{experience.company_location}</span></p>
        <p>Début : <span>{dayjs(experience.start_date).format('DD/MM/YYYY')}</span></p>
        {experience.is_current ? (<p>En cours : Oui</p>) : (<p>Fin : <span>{dayjs(experience.end_date).format('DD/MM/YYYY')}</span></p>)}
        <p>Description : <span>{experience.description}</span></p>
        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/experiences/edit?id=${experience.id}`}>Modifier</Button>
        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteExperience(experience.id)}>Supprimer</Button>
    </div>
</AuthenticatedLayout>
  )
}

export default Show