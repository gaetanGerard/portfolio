import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

const Index = ({ auth }) => {
    const {categories} = usePage().props;

    const handleDeleteCategory = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/categories/delete/${id}`);
            window.location.reload();
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression de la catégorie :', error);
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
                        {categories.length > 0 ? categories.map((category, index) => (
                            <li key={index}>
                                <h3>Nom : {category.name}</h3>
                                <p>Description : {category.description}</p>
                                <div className="button-group">
                                    <Button variant="contained" className="mt-2" href={`/admin/dashboard/categories/category/${category.id}`}>Voire</Button>
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
  )
}

export default Index