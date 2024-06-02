import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EducationForm from './Partials/EducationForm';


export default function Add({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter une Education</h2>}
        >
            <Head title="Ajouter une éducation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <EducationForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}