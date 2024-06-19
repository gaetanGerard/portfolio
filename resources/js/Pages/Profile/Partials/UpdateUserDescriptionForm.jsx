import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const UpdateUserDescriptionForm = ({ className = '' }) => {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        en_description: user.en_description,
        fr_description: user.fr_description,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                console.log('Profile updated successfully.');
            },
            onError: (error) => {
                console.error('Profile update failed:', error);
            }
        });
    };

  return (
    <section className={className}>
        <header>
            <h2 className="text-lg font-medium text-gray-900">Update Description</h2>

            <p className="mt-1 text-sm text-gray-600">
            Update your account's description in English and French.
            </p>
        </header>

        <form onSubmit={submit} className="mt-6 space-y-6">
            <div>
                <InputLabel htmlFor="en_description" value="English Description" />

                <Textarea
                    id="en_description"
                    className="mt-1 block w-full"
                    value={data.en_description}
                    onChange={(e) => setData('en_description', e.target.value)}
                    required
                    isFocused
                    autoComplete="en_description"
                />

                <InputError className="mt-2" message={errors.en_description} />
            </div>

            <div>
                <InputLabel htmlFor="fr_description" value="French Description" />

                <Textarea
                    id="fr_description"
                    className="mt-1 block w-full"
                    value={data.fr_description}
                    onChange={(e) => setData('fr_description', e.target.value)}
                    required
                    autoComplete="fr_description"
                />

                <InputError className="mt-2" message={errors.fr_description} />
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

export default UpdateUserDescriptionForm