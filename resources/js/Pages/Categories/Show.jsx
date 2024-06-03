import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

const Show = ({ auth }) => {
    const {category} = usePage().props;

    const handleDeleteCategory = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/categories/delete/${id}`);
            window.location.href = '/admin/dashboard/categories';
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de la catégorie :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Education</h2>}
>
    <Head title="Education" />
    <div>
        <p>Nom de la catégorie : <span>{category.name}</span></p>
        <p>Description : <span>{category.description}</span></p>
        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/categories/edit?id=${category.id}`}>Modifier</Button>
        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteCategory(category.id)}>Supprimer</Button>
    </div>
</AuthenticatedLayout>
  )
}

export default Show