import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TechnologiesForm from './Partials/TechnologiesForm';


export default function Add({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter une technologie</h2>}
        >
            <Head title="Ajouter une technologie" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <TechnologiesForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}