import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import ProjectForm from './Partials/ProjectForm';


export default function Add({ auth }) {
    const {action} = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{ action === "edit" ? 'Modifier' : 'Ajouter'} un projet</h2>}
        >
            <Head title={`${ action === "edit" ? 'Modifier' : 'Ajouter'} un projet`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <ProjectForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
