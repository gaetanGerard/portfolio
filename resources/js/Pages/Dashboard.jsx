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
                    <div className="grid lg:grid-cols-5 gap-3 md:grid-cols-3 md:mx-0 lg:mx-0 sm:grid-cols-1 sm:mx-1">
                        <Card className="grid justify-items-center items-stretch">
                            <CardContent className="grid grid-rows-2 justify-items-center items-stretch">
                                <Typography variant="h5" component="div" className="text-center">Projets</Typography>
                                {projects.length > 0 ? (<Typography variant="body2" component="p"  className="self-center">
                                    {projects.length}
                                </Typography>) : <Typography variant="body2" component="p"  className="self-center">Aucun projet</Typography>}
                            </CardContent>
                        </Card>
                        <Card className="grid justify-items-center items-stretch">
                            <CardContent className="grid grid-rows-2 justify-items-center items-stretch">
                                <Typography variant="h5" component="div" className="text-center">Technologies</Typography>
                                {technologies.length > 0 ? (<Typography variant="body2" component="p" className="self-center">
                                    {technologies.length} {technologies.length > 1 ? 'technologies' : 'technologie'}
                                </Typography>) : <Typography variant="body2" component="p" className="self-center">Aucune technologie</Typography>}
                            </CardContent>
                        </Card>
                        <Card className="grid justify-items-center items-stretch">
                            <CardContent className="grid grid-rows-2 justify-items-center items-stretch">
                                <Typography variant="h5" component="div" className="text-center">Catégories</Typography>
                                {technoCategory.length > 0 ? (<Typography variant="body2" component="p" className="self-center">
                                    {technoCategory.length} {technoCategory.length > 1 ? 'catégories' : 'catégorie'} ({technoCategory.length/2}FR / {technoCategory.length/2}EN )
                                </Typography>) : <Typography variant="body2" component="p" className="self-center">Aucune catégorie</Typography>}
                            </CardContent>
                        </Card>
                        <Card className="grid justify-items-center items-stretch">
                            <CardContent className="grid grid-rows-2 justify-items-center items-stretch">
                                <Typography variant="h5" component="div" className="text-center">Expériences</Typography>
                                {experiences.length > 0 ? (<Typography variant="body2" component="p" className="self-center">
                                    {experiences.length} {experiences.length > 1 ? 'expériences' : 'expérience'} ({experiences.length/2}FR / {experiences.length/2}EN )
                                </Typography>) : <Typography variant="body2" component="p" className="self-center">Aucune expérience</Typography>}
                            </CardContent>
                        </Card>
                        <Card className="grid justify-items-center items-stretch">
                            <CardContent className="grid grid-rows-2 justify-items-center items-stretch">
                                <Typography variant="h5" component="div" className="text-center">Formations</Typography>
                                {educations.length > 0 ? (<Typography variant="body2" component="p" className="self-center">
                                    {educations.length} {educations.length > 1 ? 'formations' : 'formation'} ({educations.length/2}FR / {educations.length/2}EN )
                                </Typography>) : <Typography variant="body2" component="p" className="self-center">Aucune formation</Typography>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
