import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Dashboard({ auth }) {
    const {projects, technoCategory, technologies, experiences, educations} = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Typography variant="h3" component="h1" className="text-3xl font-bold text-gray-800">Tableau de bord</Typography>
                    <div className="mt-6 mb-4 border-b border-gray-200">
                        <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Statistiques</Typography>
                    </div>
                    <div>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">Projets</Typography>
                                {projects.length > 0 ? (<Typography variant="body2" component="p">
                                    {projects.length}
                                </Typography>) : <Typography variant="body2" component="p">Aucun projet</Typography>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">Technologies</Typography>
                                {technologies.length > 0 ? (<Typography variant="body2" component="p">
                                    {technologies.length}
                                </Typography>) : <Typography variant="body2" component="p">Aucune technologie</Typography>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">Catégories de technologies</Typography>
                                {technoCategory.length > 0 ? (<Typography variant="body2" component="p">
                                    {technoCategory.length}
                                </Typography>) : <Typography variant="body2" component="p">Aucune catégorie de technologie</Typography>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">Expériences</Typography>
                                {experiences.length > 0 ? (<Typography variant="body2" component="p">
                                    {experiences.length}
                                </Typography>) : <Typography variant="body2" component="p">Aucune expérience</Typography>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">Formations</Typography>
                                {educations.length > 0 ? (<Typography variant="body2" component="p">
                                    {educations.length}
                                </Typography>) : <Typography variant="body2" component="p">Aucune formation</Typography>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
