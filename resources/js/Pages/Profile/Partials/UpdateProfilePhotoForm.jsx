import React, { useState } from 'react'
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

const UpdateProfilePhotoForm = ({ className = '' }) => {
    const user = usePage().props.auth.user;
    const [uploading, setUploading] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        en_description: user.en_description || '',
        fr_description: user.fr_description || '',
        user_img: user.user_img || '',
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await axios.post(route('profile.uploadImage'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setData('user_img', response.data.path);
            } catch (error) {
                console.error('Image upload failed:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                console.log('Profile updated successfully.');
            },
            onError: (error) => {
                console.error('Profile update failed:', error);
            },
        });
    };

  return (
    <section className={className}>
        <header>
            <h2 className="text-lg font-medium text-gray-900">Update Profile Photo</h2>

            <p className="mt-1 text-sm text-gray-600">
                Update your account's profile photo.
            </p>
        </header>

        <form onSubmit={submit} className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <InputLabel htmlFor="user_img" value="Upload Image" />

                    <TextInput
                        id="user_img"
                        className="mt-1 block w-full"
                        onChange={handleImageUpload}
                        type="file"
                    />
                    {uploading && <p>Uploading...</p>}
                    <InputError className="mt-2" message={errors.user_img} />
                </div>
                {data.user_img && <img src={`${data.user_img}`} className="place-self-center object-contain w-10/12 h-10/12 cursor-pointer" alt={`Image ${user.name}`}/>}
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600">Saved.</p>
                </Transition>
            </div>
        </form>
    </section>
  )
}

export default UpdateProfilePhotoForm