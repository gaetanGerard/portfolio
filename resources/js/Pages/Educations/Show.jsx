import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const Show = ({ auth }) => {
    const {education} = usePage().props;

    const handleDeleteEducation = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/educations/delete/${id}`);
            window.location.href = '/admin/dashboard/educations';
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
    <div>
        <p>Nom de l'école : <span>{education.school_name}</span></p>
        <p>Diplôme : <span>{education.degree}</span></p>
        <p>Lieu : <span>{education.place_of_study}</span></p>
        <p>Début : <span>{dayjs(education.start_date).format('DD/MM/YYYY')}</span></p>
        {education.is_current ? (<p>En cours : Oui</p>) : (<p>Fin : <span>{dayjs(education.end_date).format('DD/MM/YYYY')}</span></p>)}
        <p>Description : <span>{education.description}</span></p>
        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/educations/edit?id=${education.id}`}>Modifier</Button>
        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteEducation(education.id)}>Supprimer</Button>
    </div>
</AuthenticatedLayout>
  )
}

export default Show