import {useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Dashboard({ auth }) {
    useEffect(() => {
        axios.get('/admin/dashboard').then(response => {
            console.log(response);
        });
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Liste des projets sous forme de tableau</div>
                    </div>
                    <Button variant="contained" className="mt-2" href={route('projects.add')}>Ajouter un projet</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
