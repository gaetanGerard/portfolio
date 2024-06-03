import {useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const Show = ({ auth }) => {
    const {project, technologies, categories} = usePage().props;
    const [techArr, setTechArr] = useState([]);

    useEffect(() => {
        const matchedTechnologies = project.used_technologies.map(tech =>
            technologies.find(t => t.name === tech)
          );

        setTechArr(matchedTechnologies);
    }, [project.used_technologies, technologies]);

    const handleDeleteProject = async (id) => {
        try {
            const response = await axios.delete(`/admin/dashboard/projects/delete/${id}`);
            window.location.href = '/admin/dashboard/projects';
            console.log(response.data.message);
        } catch (error) {
            console.error('Une erreur est survenue lors de la suppression du projet :', error);
        }
    };

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projet</h2>}
>
    <Head title="Projet" />
    <div>
        <p>Titre : <span>{project.title}</span></p>
        <p>Date de création : {dayjs(project.created_at).format('DD/MM/YYYY')}</p>
        <p>Date de mise à jour : {dayjs(project.updated_at).format('DD/MM/YYYY')}</p>
        <img src={`${project.main_img}`} alt={`${project.title}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}  />
        <p>Courte description : {project.short_description}</p>
        <p>Description : {project.description}</p>
        {project.demo_link != null ? (<p>Demo Link: {project.demo_link}</p>) : null}
        {project.github_repo != null ? (<p>Github: {project.github_repo}</p>) : null}
        <div className="button-group">
            <h3>Technologies utilisées</h3>
            <ul>
                {techArr.map((technology, index) => (
                    <li key={index}>
                        <p>Nom de la technologie : <span>{technology.name}</span></p>
                        <img src={`${technology.icon_path}`} alt={`${technology.name}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }}  />
                        <p>Maitrise : {technology.skill_level}/100</p>
                        <div><a href={technology.technology_url} target="_blank" rel="noreferrer">Lien de documentation</a></div>
                    </li>
                ))}
            </ul>
        </div>
        <Button variant="contained" className="mt-2" color="warning" href={`/admin/dashboard/projects/edit?id=${project.id}`}>Modifier</Button>
        <Button variant="contained" className="mt-2" color="error" onClick={() => handleDeleteProject(project.id)}>Supprimer</Button>
    </div>
</AuthenticatedLayout>
  )
}

export default Show