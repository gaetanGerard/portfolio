import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import CVForm from './Partials/CVForm';


export default function Add({ auth }) {
    const {action} = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{ action === "edit" ? 'Modifier' : 'Ajouter'} un CV</h2>}
        >
            <Head title={`${ action === "edit" ? 'Modifier' : 'Ajouter'} un CV`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <CVForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
