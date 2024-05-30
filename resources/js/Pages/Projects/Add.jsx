import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import DeleteUserForm from './Partials/DeleteUserForm';
// import UpdatePasswordForm from './Partials/UpdatePasswordForm';
// import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import ProjectForm from './Partials/ProjectForm';


export default function Add({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter un projet</h2>}
        >
            <Head title="Ajouter un projet" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <ProjectForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
