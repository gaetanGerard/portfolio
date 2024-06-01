import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Button from '@mui/material/Button';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expériences Professionel</h2>}
        >
            <Head title="Expériences professionnel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <ul className="p-6 text-gray-900">
                            Aucune expériences trouvées
                        </ul>
                    </div>
                    <Button variant="contained" className="my-2" href='/admin/dashboard/experiences/add'>Ajouter une expériences</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
