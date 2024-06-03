import {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

const Show = ({ auth }) => {
    const {technology, categories} = usePage().props;
    const [category] = useState(categories.find(category => category.id === technology.category_id));

    console.log(technology)

    const handleDeleteTechnology = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/technologies/delete/${id}`);
            window.location.href = '/admin/dashboard/technologies';
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de la catégorie :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Technologie</h2>}
>
    <Head title="Technologie" />
    <div>
        <p>Nom de la technologie : <span>{technology.name}</span></p>
        <p>Catégorie : {category.name}</p>
        <img src={`${technology.icon_path}`} alt={`${technology.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}  />
        <p>Maitrise : {technology.skill_level}/100</p>
        <div><a href={technology.technology_url} target="_blank" rel="noreferrer">Lien de documentation</a></div>
        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/technologies/edit?id=${technology.id}`}>Modifier</Button>
        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteTechnology(technology.id)}>Supprimer</Button>
    </div>
</AuthenticatedLayout>
  )
}

export default Show