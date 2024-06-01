import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CategoriesForm from './Partials/CategoriesForm';


export default function Add({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter une catégorie</h2>}
        >
            <Head title="Ajouter une catégorie" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <CategoriesForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
